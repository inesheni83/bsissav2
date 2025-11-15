<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $order->reference }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 15px;
        }
        .header-left, .header-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .header-right {
            text-align: right;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 5px;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
        }
        .info-table {
            width: 100%;
            margin-bottom: 15px;
        }
        .info-table td {
            padding: 5px 0;
        }
        .info-table .label {
            font-weight: bold;
            width: 120px;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table.items th {
            background-color: #10b981;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        table.items td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        table.items tr:last-child td {
            border-bottom: none;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            margin-top: 20px;
            text-align: right;
        }
        .total-row {
            margin-bottom: 8px;
        }
        .total-label {
            display: inline-block;
            width: 150px;
            font-weight: bold;
        }
        .total-amount {
            display: inline-block;
            width: 120px;
            text-align: right;
        }
        .grand-total {
            font-size: 16px;
            color: #10b981;
            padding-top: 10px;
            border-top: 2px solid #10b981;
            margin-top: 10px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }
        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .badge-processing {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .badge-shipped {
            background-color: #e0e7ff;
            color: #3730a3;
        }
        .badge-delivered {
            background-color: #d1fae5;
            color: #065f46;
        }
        .badge-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="company-name">BSISSA ZED ELMOULOUK</div>
                <div>Produits Naturels et Traditionnels</div>
                <div>Tunisie</div>
            </div>
            <div class="header-right">
                <div class="invoice-title">FACTURE</div>
                <div><strong>N°:</strong> {{ $invoice->invoice_number ?? $order->reference }}</div>
                <div><strong>Commande:</strong> {{ $order->reference }}</div>
                <div><strong>Date:</strong> {{ isset($invoice) ? $invoice->invoice_date->format('d/m/Y') : \Carbon\Carbon::parse($order->created_at)->format('d/m/Y') }}</div>
            </div>
        </div>

        <!-- Client Information -->
        <div class="section">
            <div class="section-title">Informations Client</div>
            <table class="info-table">
                <tr>
                    <td class="label">Nom:</td>
                    <td>{{ $customer_name }}</td>
                </tr>
                <tr>
                    <td class="label">Email:</td>
                    <td>{{ $customer_email }}</td>
                </tr>
                <tr>
                    <td class="label">Téléphone:</td>
                    <td>{{ $customer_phone }}</td>
                </tr>
            </table>
        </div>

        <!-- Delivery Address -->
        <div class="section">
            <div class="section-title">Adresse de Livraison</div>
            <table class="info-table">
                <tr>
                    <td class="label">Destinataire:</td>
                    <td>{{ $delivery['first_name'] }} {{ $delivery['last_name'] }}</td>
                </tr>
                <tr>
                    <td class="label">Adresse:</td>
                    <td>{{ $delivery['address'] }}</td>
                </tr>
                <tr>
                    <td class="label">Ville:</td>
                    <td>{{ $delivery['postal_code'] }} {{ $delivery['city'] }}</td>
                </tr>
                <tr>
                    <td class="label">Région:</td>
                    <td>{{ $delivery['region'] }}, {{ $delivery['country'] }}</td>
                </tr>
                <tr>
                    <td class="label">Téléphone:</td>
                    <td>{{ $delivery['phone'] }}</td>
                </tr>
            </table>
        </div>

        <!-- Order Items -->
        <div class="section">
            <div class="section-title">Détails de la Commande</div>
            <table class="items">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th class="text-center">Quantité</th>
                        <th class="text-right">Prix Unitaire</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item['name'] }}</strong>
                            @if(!empty($item['note']))
                            <br><small style="color: #6b7280;">Note: {{ $item['note'] }}</small>
                            @endif
                        </td>
                        <td class="text-center">{{ $item['quantity'] }}</td>
                        <td class="text-right">{{ number_format($item['unit_price'], 2, ',', ' ') }} TND</td>
                        <td class="text-right"><strong>{{ number_format($item['total_price'], 2, ',', ' ') }} TND</strong></td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Total Section -->
        <div class="total-section">
            @php
                $orderSubtotal = $subtotal ?? $order->subtotal;
                $deliveryFeeAmount = $delivery_fee ?? 0;
                $vatRate = 19.00;
                $subtotalHT = $orderSubtotal / (1 + ($vatRate / 100));
                $vatAmount = $orderSubtotal - $subtotalHT;
                $totalWithVAT = $orderSubtotal;
                $grandTotal = $totalWithVAT + $deliveryFeeAmount;
            @endphp
            <div class="total-row">
                <span class="total-label">Sous-total HT:</span>
                <span class="total-amount">{{ number_format($subtotalHT, 2, ',', ' ') }} TND</span>
            </div>
            <div class="total-row">
                <span class="total-label">TVA ({{ number_format($vatRate, 0) }}%):</span>
                <span class="total-amount">{{ number_format($vatAmount, 2, ',', ' ') }} TND</span>
            </div>
            <div class="total-row">
                <span class="total-label">Sous-total TTC:</span>
                <span class="total-amount">{{ number_format($totalWithVAT, 2, ',', ' ') }} TND</span>
            </div>
            <div class="total-row">
                <span class="total-label">Frais de livraison:</span>
                <span class="total-amount">{{ number_format($deliveryFeeAmount, 2, ',', ' ') }} TND</span>
            </div>
            <div class="total-row grand-total">
                <span class="total-label">TOTAL À PAYER:</span>
                <span class="total-amount"><strong>{{ number_format($grandTotal, 2, ',', ' ') }} TND</strong></span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Merci pour votre commande !</p>
        </div>
    </div>
</body>
</html>
