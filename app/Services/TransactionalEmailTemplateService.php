<?php

namespace App\Services;

use App\Models\TransactionalEmailTemplate;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TransactionalEmailTemplateService
{
    public const TEMPLATE_ORDER_CONFIRMATION = 'order_confirmation';
    public const TEMPLATE_STATUS_UPDATE = 'status_update';
    public const TEMPLATE_DELIVERY_CONFIRMATION = 'delivery_confirmation';

    /**
     * Default templates metadata and content.
     */
    private array $defaultTemplates = [
        self::TEMPLATE_ORDER_CONFIRMATION => [
            'label' => 'Confirmation de commande',
            'description' => 'Envoyee automatiquement apres la creation de la commande.',
            'subject' => 'Confirmation de votre commande {order_reference}',
            'body' => "Bonjour {customer_name},\n\nMerci pour votre commande {order_reference}. Nous la preparons avec soin.\n\nMontant total : {order_total}\nStatut actuel : {status_label}\n\nSuivre ma commande : {order_url}\n\nMerci pour votre confiance,\n{site_name}",
            'placeholders' => [
                'customer_name',
                'order_reference',
                'order_total',
                'status_label',
                'order_url',
                'site_name',
            ],
        ],
        self::TEMPLATE_STATUS_UPDATE => [
            'label' => 'Changement de statut',
            'description' => 'Envoyee a chaque mise a jour de statut.',
            'subject' => 'Mise a jour de votre commande {order_reference}',
            'body' => "Bonjour {customer_name},\n\nLe statut de votre commande {order_reference} passe de {old_status} a {new_status}.\n{status_description}\n\nVoir le suivi : {order_url}\n\nEquipe {site_name}",
            'placeholders' => [
                'customer_name',
                'order_reference',
                'old_status',
                'new_status',
                'status_description',
                'order_url',
                'site_name',
            ],
        ],
        self::TEMPLATE_DELIVERY_CONFIRMATION => [
            'label' => 'Confirmation de livraison',
            'description' => 'Envoyee lorsque la commande passe en statut livree.',
            'subject' => 'Votre commande {order_reference} est livree',
            'body' => "Bonjour {customer_name},\n\nBonne nouvelle ! Votre commande {order_reference} est indiquee comme livree.\n\nNous restons disponibles en cas de question.\n\nConsulter la commande : {order_url}\n\nMerci,\n{site_name}",
            'placeholders' => [
                'customer_name',
                'order_reference',
                'order_url',
                'site_name',
            ],
        ],
    ];

    public function getTemplates(): Collection
    {
        $this->ensureDefaultTemplates();

        return TransactionalEmailTemplate::orderBy('template_key')->get();
    }

    public function getTemplateMeta(): array
    {
        return collect($this->defaultTemplates)->map(fn ($template) => [
            'label' => $template['label'],
            'description' => $template['description'],
            'placeholders' => $template['placeholders'],
        ])->toArray();
    }

    public function updateTemplates(array $templates): void
    {
        DB::transaction(function () use ($templates) {
            foreach ($templates as $templateData) {
                TransactionalEmailTemplate::updateOrCreate(
                    ['template_key' => $templateData['template_key']],
                    [
                        'subject' => $templateData['subject'],
                        'body' => $templateData['body'],
                    ]
                );
            }
        });
    }

    public function renderTemplate(string $templateKey, array $replacements): array
    {
        $template = $this->getTemplate($templateKey);

        return [
            'subject' => $this->replacePlaceholders($template->subject, $replacements),
            'body' => $this->replacePlaceholders($template->body, $replacements),
        ];
    }

    public function getTemplate(string $templateKey): TransactionalEmailTemplate
    {
        $this->ensureDefaultTemplates();

        $template = TransactionalEmailTemplate::where('template_key', $templateKey)->first();

        if ($template) {
            return $template;
        }

        $default = $this->defaultTemplates[$templateKey] ?? [
            'subject' => 'Notification',
            'body' => 'Contenu indisponible.',
        ];

        return TransactionalEmailTemplate::create([
            'template_key' => $templateKey,
            'subject' => $default['subject'],
            'body' => $default['body'],
        ]);
    }

    private function ensureDefaultTemplates(): void
    {
        foreach ($this->defaultTemplates as $key => $template) {
            TransactionalEmailTemplate::firstOrCreate(
                ['template_key' => $key],
                [
                    'subject' => $template['subject'],
                    'body' => $template['body'],
                ]
            );
        }
    }

    private function replacePlaceholders(string $content, array $replacements): string
    {
        $search = [];
        $replace = [];

        foreach ($replacements as $key => $value) {
            $search[] = '{' . $key . '}';
            $replace[] = (string) ($value ?? '');
        }

        return str_replace($search, $replace, $content);
    }
}
