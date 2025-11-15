<?php

namespace App\Notifications;

use App\Models\Order;
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
        $statusMeta = Order::statusMeta($this->newStatus);
        $oldStatusMeta = Order::statusMeta($this->oldStatus);

        return (new MailMessage)
            ->subject('Mise à jour de votre commande ' . $this->order->reference)
            ->greeting('Bonjour ' . $this->order->first_name . ',')
            ->line('Le statut de votre commande **' . $this->order->reference . '** a été mis à jour.')
            ->line('**Ancien statut:** ' . $oldStatusMeta['label'])
            ->line('**Nouveau statut:** ' . $statusMeta['label'])
            ->line($statusMeta['description'])
            ->action('Voir ma commande', route('orders.show', $this->order->id))
            ->line('Merci pour votre confiance !');
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
}
