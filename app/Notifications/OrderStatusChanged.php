<?php

namespace App\Notifications;

use App\Models\Order;
use App\Services\TransactionalEmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Order $order,
        public string $oldStatus,
        public string $newStatus
    ) {
        // Use sync queue in local environment for immediate execution
        if (config('app.env') === 'local') {
            $this->connection = 'sync';
        }
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $templateService = app(TransactionalEmailTemplateService::class);
        $statusMeta = Order::statusMeta($this->newStatus);
        $oldStatusMeta = Order::statusMeta($this->oldStatus);

        $templateKey = $this->newStatus === 'delivered'
            ? TransactionalEmailTemplateService::TEMPLATE_DELIVERY_CONFIRMATION
            : TransactionalEmailTemplateService::TEMPLATE_STATUS_UPDATE;

        $rendered = $templateService->renderTemplate($templateKey, [
            'customer_name' => $this->order->first_name,
            'order_reference' => $this->order->reference,
            'old_status' => $oldStatusMeta['label'],
            'new_status' => $statusMeta['label'],
            'status_label' => $statusMeta['label'],
            'status_description' => $statusMeta['description'],
            'order_url' => route('orders.show', $this->order->id),
            'site_name' => config('app.name'),
        ]);

        return $this->buildMailMessage($rendered['subject'], $rendered['body']);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_reference' => $this->order->reference,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'old_status_label' => Order::statusMeta($this->oldStatus)['label'],
            'new_status_label' => Order::statusMeta($this->newStatus)['label'],
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
