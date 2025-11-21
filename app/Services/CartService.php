<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\DeliveryFee;
use App\Models\Order;
use App\Models\Pack;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CartService
{
    public function __construct(private DatabaseManager $db)
    {
    }

    public function getOwner(): array
    {
        if (Auth::check()) {
            return ['user_id' => Auth::id(), 'session_id' => null];
        }

        return [
            'user_id' => null,
            'session_id' => session()->getId(),
        ];
    }

    public function getCartItems(): LengthAwarePaginator
    {
        $owner = $this->getOwner();

        return CartItem::with(['product', 'pack', 'weightVariant'])
            ->forOwner($owner['user_id'], $owner['session_id'])
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }

    public function getItems(): Collection
    {
        $owner = $this->getOwner();

        return CartItem::with(['product', 'pack', 'weightVariant'])
            ->forOwner($owner['user_id'], $owner['session_id'])
            ->orderByDesc('created_at')
            ->get();
    }

    public function addItem(Product $product, int $quantity, ?int $weightVariantId = null): CartItem
    {
        $owner = $this->getOwner();

        return $this->db->transaction(function () use ($product, $quantity, $owner, $weightVariantId) {
            $payload = array_merge($owner, [
                'product_id' => $product->id,
                'weight_variant_id' => $weightVariantId,
            ]);

            $cartItem = CartItem::firstOrNew($payload);

            // Obtenir le prix depuis la variante si disponible
            if ($weightVariantId) {
                $weightVariant = $product->weightVariants()->find($weightVariantId);
                if ($weightVariant) {
                    $cartItem->unit_price = $weightVariant->promotional_price ?? $weightVariant->price;
                } else {
                    throw new \RuntimeException('La variante de poids sélectionnée n\'existe pas.');
                }
            } else {
                throw new \RuntimeException('Veuillez sélectionner un poids pour ce produit.');
            }

            $cartItem->quantity = max(
                1,
                ($cartItem->exists ? $cartItem->quantity : 0) + $quantity
            );
            $cartItem->total_price = $cartItem->quantity * $cartItem->unit_price;
            $cartItem->save();

            return $cartItem->load(['product', 'weightVariant']);
        });
    }

    public function addPack(Pack $pack, int $quantity): CartItem
    {
        $owner = $this->getOwner();

        return $this->db->transaction(function () use ($pack, $quantity, $owner) {
            // Check stock availability
            if ($pack->stock_quantity < $quantity) {
                throw new \RuntimeException('Stock insuffisant pour ce pack.');
            }

            $payload = array_merge($owner, [
                'pack_id' => $pack->id,
                'product_id' => null,
                'weight_variant_id' => null,
            ]);

            $cartItem = CartItem::where($payload)->first();

            if ($cartItem) {
                // Update existing cart item
                $newQuantity = $cartItem->quantity + $quantity;
                if ($pack->stock_quantity < $newQuantity) {
                    throw new \RuntimeException('Stock insuffisant pour ce pack.');
                }
                $cartItem->quantity = $newQuantity;
            } else {
                // Create new cart item
                $cartItem = new CartItem($payload);
                $cartItem->quantity = $quantity;
            }

            $cartItem->unit_price = $pack->price;
            $cartItem->total_price = $cartItem->quantity * $cartItem->unit_price;
            $cartItem->save();

            return $cartItem->load('pack');
        });
    }

    public function updateItem(CartItem $cartItem, int $quantity): CartItem
    {
        return $this->db->transaction(function () use ($cartItem, $quantity) {
            $cartItem->quantity = max(1, $quantity);
            $cartItem->total_price = $cartItem->quantity * $cartItem->unit_price;
            $cartItem->save();

            return $cartItem->load('product');
        });
    }

    public function removeItem(CartItem $cartItem): void
    {
        $this->db->transaction(fn () => $cartItem->delete());
    }

    public function clear(): void
    {
        $owner = $this->getOwner();

        $this->db->transaction(function () use ($owner) {
            CartItem::forOwner($owner['user_id'], $owner['session_id'])->delete();
        });

        session()->forget('checkout.delivery');
    }

    public function getSummary(): array
    {
        $items = $this->getItems();
        $subtotal = $items->sum('total_price');

        return [
            'subtotal' => (float) $subtotal,
            'items_count' => $items->sum('quantity'),
        ];
    }

    public function finalizeCheckout(array $delivery): Order
    {
        $owner = $this->getOwner();
        $items = $this->getItems();

        if ($items->isEmpty()) {
            throw new \RuntimeException('Le panier est vide.');
        }

        $subtotal = (float) $items->sum('total_price');
        $itemsCount = (int) $items->sum('quantity');

        // Récupérer les frais de livraison actifs
        $activeDeliveryFee = DeliveryFee::where('is_active', true)->first();
        $deliveryFeesId = $activeDeliveryFee?->id;

        return $this->db->transaction(function () use ($owner, $items, $subtotal, $itemsCount, $delivery, $deliveryFeesId) {
            // Vérifier la disponibilité du stock avant de créer la commande
            foreach ($items as $item) {
                if ($item->pack) {
                    $availableStock = $item->pack->stock_quantity;
                    if ($availableStock < $item->quantity) {
                        throw new \RuntimeException(
                            "Stock insuffisant pour le pack {$item->pack->name}. " .
                            "Stock disponible: {$availableStock}, Quantité demandée: {$item->quantity}"
                        );
                    }
                } elseif ($item->weightVariant) {
                    $availableStock = $item->weightVariant->stock_quantity;
                    if ($availableStock < $item->quantity) {
                        throw new \RuntimeException(
                            "Stock insuffisant pour {$item->product->name} - {$item->weightVariant->weight_value}{$item->weightVariant->weight_unit}. " .
                            "Stock disponible: {$availableStock}, Quantité demandée: {$item->quantity}"
                        );
                    }
                }
            }

            $order = Order::create([
                'user_id' => $owner['user_id'],
                'session_id' => $owner['session_id'],
                'reference' => $this->generateOrderReference(),
                'first_name' => $delivery['first_name'],
                'last_name' => $delivery['last_name'],
                'address' => $delivery['address'],
                'country' => $delivery['country'],
                'region' => $delivery['region'],
                'city' => $delivery['city'],
                'postal_code' => $delivery['postal_code'],
                'phone' => $delivery['phone'],
                'note' => $delivery['note'] ?? null,
                'subtotal' => $subtotal,
                'delivery_fees_id' => $deliveryFeesId,
                'items_count' => $itemsCount,
                'items' => $items->map(function (CartItem $item) {
                    if ($item->pack) {
                        return [
                            'pack_id' => $item->pack_id,
                            'product_id' => null,
                            'weight_variant_id' => null,
                            'name' => 'Pack: ' . $item->pack->name,
                            'image' => $item->pack->main_image_url,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'total_price' => (float) $item->total_price,
                        ];
                    }

                    $name = $item->product?->name ?? 'Produit #' . $item->product_id;
                    if ($item->weightVariant) {
                        $name .= ' - ' . $item->weightVariant->weight_value . ' ' . $item->weightVariant->weight_unit;
                    }

                    return [
                        'pack_id' => null,
                        'product_id' => $item->product_id,
                        'weight_variant_id' => $item->weight_variant_id,
                        'name' => $name,
                        'image' => $item->product?->image,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'total_price' => (float) $item->total_price,
                    ];
                })->values()->all(),
                'status' => 'pending',
            ]);

            // Mettre à jour le stock des produits (weight variants) et packs
            foreach ($items as $item) {
                if ($item->pack) {
                    $item->pack->decrement('stock_quantity', $item->quantity);
                } elseif ($item->weightVariant) {
                    $item->weightVariant->decrement('stock_quantity', $item->quantity);
                }
            }

            CartItem::forOwner($owner['user_id'], $owner['session_id'])->delete();

            session()->forget('checkout.delivery');

            return $order;
        });
    }

    private function generateOrderReference(): string
    {
        return 'CMD-' . strtoupper(Str::random(10));
    }
}
