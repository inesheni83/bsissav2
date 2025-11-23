<?php

namespace App\Services;

use App\Models\DeliveryFee;

class DeliveryFeeService
{
    /**
     * Calculate delivery fee based on subtotal and active delivery fee settings.
     */
    public function calculateDeliveryFee(float $subtotal): array
    {
        $activeDeliveryFee = DeliveryFee::where('is_active', true)->first();

        if (!$activeDeliveryFee) {
            return [
                'amount' => 0,
                'is_free' => false,
                'threshold' => null,
                'remaining_for_free_shipping' => null,
            ];
        }

        $deliveryAmount = (float) $activeDeliveryFee->amount;
        $freeShippingThreshold = $activeDeliveryFee->free_shipping_threshold
            ? (float) $activeDeliveryFee->free_shipping_threshold
            : null;

        // Check if free shipping applies
        $isFree = false;
        $remainingForFreeShipping = null;

        if ($freeShippingThreshold !== null && $subtotal >= $freeShippingThreshold) {
            $isFree = true;
            $deliveryAmount = 0;
        } elseif ($freeShippingThreshold !== null && $subtotal < $freeShippingThreshold) {
            $remainingForFreeShipping = $freeShippingThreshold - $subtotal;
        }

        return [
            'amount' => $deliveryAmount,
            'is_free' => $isFree,
            'threshold' => $freeShippingThreshold,
            'remaining_for_free_shipping' => $remainingForFreeShipping,
        ];
    }
}
