<?php

namespace App\Support;

use App\Models\Order;
use Illuminate\Support\Arr;

class OrderPresenter
{
    public static function detail(Order $order): array
    {
        $delivery = [
            'first_name' => $order->first_name,
            'last_name' => $order->last_name,
            'address' => $order->address,
            'country' => $order->country,
            'region' => $order->region,
            'city' => $order->city,
            'postal_code' => $order->postal_code,
            'phone' => $order->phone,
            'note' => $order->note,
        ];

        $items = collect($order->items ?? [])
            ->map(fn (array $item) => [
                'product_id' => Arr::get($item, 'product_id'),
                'name' => Arr::get($item, 'name', 'Produit'),
                'image' => Arr::get($item, 'image'),
                'quantity' => (int) Arr::get($item, 'quantity', 0),
                'unit_price' => (float) Arr::get($item, 'unit_price', 0),
                'total_price' => (float) Arr::get($item, 'total_price', 0),
                'note' => Arr::get($item, 'note'),
            ])
            ->values()
            ->all();

        // Récupérer les frais de livraison
        $deliveryFeeAmount = $order->deliveryFee?->amount ?? 0;
        $total = (float) $order->subtotal + (float) $deliveryFeeAmount;

        return [
            'id' => $order->id,
            'reference' => $order->reference,
            'status' => $order->status,
            'status_meta' => Order::statusMeta($order->status),
            'subtotal' => (float) $order->subtotal,
            'delivery_fee' => (float) $deliveryFeeAmount,
            'total' => $total,
            'items_count' => (int) $order->items_count,
            'items' => $items,
            'delivery' => $delivery,
            'created_at' => optional($order->created_at)->toIso8601String(),
        ];
    }

    public static function summary(Order $order): array
    {
        // Récupérer les frais de livraison
        $deliveryFeeAmount = $order->deliveryFee?->amount ?? 0;
        $total = (float) $order->subtotal + (float) $deliveryFeeAmount;

        return [
            'id' => $order->id,
            'reference' => $order->reference,
            'status' => $order->status,
            'status_meta' => Order::statusMeta($order->status),
            'subtotal' => (float) $order->subtotal,
            'delivery_fee' => (float) $deliveryFeeAmount,
            'total' => $total,
            'items_count' => (int) $order->items_count,
            'created_at' => optional($order->created_at)->toIso8601String(),
        ];
    }
}
