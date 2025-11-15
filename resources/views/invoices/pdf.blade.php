<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture {{ $invoice->invoice_number }}</title>
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
            color: #000000;
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
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .info-column {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding-right: 15px;
        }
        .info-box {
            background-color: transparent;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .info-box-title {
            font-size: 13px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
        }
        .info-row {
            margin-bottom: 5px;
        }
        .info-label {
            font-weight: bold;
            color: #6b7280;
            font-size: 11px;
        }
        .info-value {
            color: #1f2937;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table.items th {
            background-color: transparent;
            color: #000000;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #000000;
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
        .totals-table {
            width: 100%;
            margin-top: 20px;
        }
        .totals-table td {
            padding: 8px 0;
        }
        .totals-table .label-col {
            text-align: right;
            padding-right: 20px;
            width: 70%;
        }
        .totals-table .amount-col {
            text-align: right;
            width: 30%;
        }
        .totals-row {
            font-size: 13px;
        }
        .subtotal-row {
            border-top: 1px solid #e5e7eb;
            padding-top: 10px !important;
        }
        .vat-row {
            color: #6b7280;
        }
        .total-row {
            font-size: 16px;
            font-weight: bold;
            color: #000000;
            border-top: 2px solid #000000;
            padding-top: 10px !important;
        }
        .payment-info {
            background-color: #fef3c7;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .payment-info-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .legal-mentions {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9fafb;
            border-left: 3px solid #10b981;
            font-size: 10px;
            color: #6b7280;
        }
        .legal-mentions-title {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
            font-size: 11px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <div class="company-name">{{ $invoice->seller_name }}</div>
                <div style="white-space: pre-line;">{{ $invoice->seller_address }}</div>
                @if($invoice->seller_registration)
                <div><strong>Matricule fiscal:</strong> {{ $invoice->seller_registration }}</div>
                @endif
                @if($invoice->seller_vat_number)
                <div><strong>N° TVA:</strong> {{ $invoice->seller_vat_number }}</div>
                @endif
            </div>
            <div class="header-right">
                <div><strong>FACTURE N°:</strong> {{ $invoice->invoice_number }}</div>
                <div><strong>Date:</strong> {{ $invoice->invoice_date->format('d/m/Y') }}</div>
            </div>
        </div>

        <!-- Client and Invoice Information -->
        <div class="info-grid">
            <div class="info-column">
                <div class="info-box">
                    <div class="info-box-title">FACTURÉ À</div>
                    <div class="info-row">
                        <div class="info-value"><strong>{{ $invoice->client_name }}</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-value">{{ $invoice->client_email }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-value">{{ $invoice->client_phone }}</div>
                    </div>
                    <div class="info-row" style="margin-top: 8px;">
                        <div class="info-value" style="white-space: pre-line;">{{ $invoice->client_address }}</div>
                    </div>
                </div>
            </div>
            <div class="info-column">
                <div class="info-box">
                    <div class="info-box-title">DÉTAILS DE LA FACTURE</div>
                    <div class="info-row">
                        <span class="info-label">Commande:</span>
                        <span class="info-value">{{ $order->reference }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Mode de paiement:</span>
                        <span class="info-value">{{ $invoice->payment_method }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Items -->
        <div class="section">
            <table class="items">
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th class="text-center">Quantité</th>
                        <th class="text-right">Prix Unitaire HT</th>
                        <th class="text-right">Total HT</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                    <tr>
                        <td>
                            {{ $item['name'] }}
                            @if(!empty($item['note']))
                            <br><small style="color: #6b7280;">Note: {{ $item['note'] }}</small>
                            @endif
                        </td>
                        <td class="text-center">{{ $item['quantity'] }}</td>
                        <td class="text-right">{{ number_format($item['unit_price'], 2, ',', ' ') }}</td>
                        <td class="text-right">{{ number_format($item['total_price'], 2, ',', ' ') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Totals -->
            <table class="totals-table">
                <tr class="totals-row subtotal-row">
                    <td class="label-col">Sous-total HT:</td>
                    <td class="amount-col"><strong>{{ number_format($invoice->subtotal_ht, 2, ',', ' ') }} TND</strong></td>
                </tr>
                <tr class="totals-row vat-row">
                    <td class="label-col">TVA ({{ number_format($invoice->vat_rate, 2, ',', ' ') }}%):</td>
                    <td class="amount-col"><strong>{{ number_format($invoice->vat_amount, 2, ',', ' ') }} TND</strong></td>
                </tr>
                <tr class="totals-row total-row">
                    <td class="label-col">TOTAL TTC:</td>
                    <td class="amount-col">{{ number_format($invoice->total_ttc, 2, ',', ' ') }} TND</td>
                </tr>
            </table>
        </div>

        <!-- Notes -->
        @if($invoice->notes)
        <div class="section">
            <div class="section-title">Notes</div>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px;">
                {{ $invoice->notes }}
            </div>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Merci pour votre confiance !</p>
            <p style="margin-top: 5px;">Pour toute question concernant cette facture, veuillez nous contacter.</p>
        </div>
    </div>
</body>
</html>
