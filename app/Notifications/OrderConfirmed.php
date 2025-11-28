<?php

namespace App\Notifications;

use App\Models\Order;
use App\Services\TransactionalEmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmed extends Notification
{
    use Queueable;

    public function __construct(public Order $order)
    {
        if (config('app.env') === 'local') {
            $this->connection = 'sync';
        }
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $templateService = app(TransactionalEmailTemplateService::class);
        $deliveryFee = $this->order->deliveryFee?->amount ?? 0;
        $total = $this->order->subtotal + $deliveryFee;

        $rendered = $templateService->renderTemplate(
            TransactionalEmailTemplateService::TEMPLATE_ORDER_CONFIRMATION,
            [
                'customer_name' => $this->order->first_name,
                'order_reference' => $this->order->reference,
                'order_total' => number_format($total, 2, ',', ' ') . ' TND',
                'status_label' => Order::statusMeta($this->order->status)['label'],
                'order_url' => route('orders.show', $this->order->id),
                'site_name' => config('app.name'),
            ]
        );

        return $this->buildMailMessage($rendered['subject'], $rendered['body']);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_reference' => $this->order->reference,
            'status' => $this->order->status,
        ];
    }

    private function buildMailMessage(string $subject, string $body): MailMessage
    {
        $mailMessage = (new MailMessage())->subject($subject);

        foreach (preg_split("/\r\n|\n|\r/", trim($body)) as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            $mailMessage->line($line);
        }

        $mailMessage->action('Voir ma commande', route('orders.show', $this->order->id));

        return $mailMessage;
    }
}
