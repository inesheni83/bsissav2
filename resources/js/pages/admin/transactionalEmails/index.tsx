import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MailCheck, RefreshCcw, PackageCheck, Save, ShieldCheck } from 'lucide-react';
import { FormEvent } from 'react';

type TemplateKey = 'order_confirmation' | 'status_update' | 'delivery_confirmation';

type Template = {
    template_key: TemplateKey;
    subject: string;
    body: string;
};

type TemplateMeta = Record<
    TemplateKey,
    {
        label: string;
        description: string;
        placeholders: string[];
    }
>;

type PageProps = {
    templates: Template[];
    templateMeta: TemplateMeta;
};

const templateIcons: Record<TemplateKey, typeof MailCheck> = {
    order_confirmation: MailCheck,
    status_update: RefreshCcw,
    delivery_confirmation: PackageCheck,
};

const orderedKeys: TemplateKey[] = [
    'order_confirmation',
    'status_update',
    'delivery_confirmation',
];

export default function TransactionalEmails({ templates, templateMeta }: PageProps) {
    const { data, setData, post, processing, errors } = useForm<{ templates: Template[] }>({
        templates: templates.map((template) => ({
            template_key: template.template_key,
            subject: template.subject,
            body: template.body,
        })),
    });

    const updateField = (templateKey: TemplateKey, field: 'subject' | 'body', value: string) => {
        setData('templates', data.templates.map((template) =>
            template.template_key === templateKey
                ? { ...template, [field]: value }
                : template
        ));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.transactional-emails.update'), {
            preserveScroll: true,
        });
    };

    const getFieldError = (index: number, field: 'subject' | 'body') =>
        errors[`templates.${index}.${field}` as keyof typeof errors];

    return (
        <AppLayout>
            <Head title="Emails transactionnels" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                                Communication client
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900">Emails transactionnels</h1>
                            <p className="text-sm text-slate-600">
                                Configurez les sujets et contenus envoyes automatiquement apres chaque action cle.
                            </p>
                        </div>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Visible pour admin & vendeur
                        </Badge>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        {orderedKeys.map((key) => {
                            const templateIndex = data.templates.findIndex((template) => template.template_key === key);
                            const template = templateIndex >= 0
                                ? data.templates[templateIndex]
                                : { template_key: key, subject: '', body: '' };

                            const meta = templateMeta?.[key];
                            const Icon = templateIcons[key];
                            const subjectError = templateIndex >= 0 ? getFieldError(templateIndex, 'subject') : undefined;
                            const bodyError = templateIndex >= 0 ? getFieldError(templateIndex, 'body') : undefined;

                            return (
                                <Card key={key} className="border-emerald-100 shadow-sm">
                                    <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Icon className="h-5 w-5 text-emerald-600" />
                                                {meta?.label ?? key}
                                            </CardTitle>
                                            <CardDescription className="text-slate-600">
                                                {meta?.description ?? 'Personnalisez ce message.'}
                                            </CardDescription>
                                        </div>
                                        {meta?.placeholders?.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {meta.placeholders.map((placeholder) => (
                                                    <Badge
                                                        key={placeholder}
                                                        variant="outline"
                                                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    >
                                                        {`{${placeholder}}`}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : null}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label
                                                className="text-sm font-medium text-slate-700"
                                                htmlFor={`${key}-subject`}
                                            >
                                                Objet du mail
                                            </label>
                                            <Input
                                                id={`${key}-subject`}
                                                value={template.subject}
                                                onChange={(event) =>
                                                    updateField(key, 'subject', event.target.value)
                                                }
                                                placeholder="Ex: Confirmation de votre commande {order_reference}"
                                            />
                                            {subjectError && (
                                                <p className="text-sm text-red-600">{subjectError}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                className="text-sm font-medium text-slate-700"
                                                htmlFor={`${key}-body`}
                                            >
                                                Contenu
                                            </label>
                                            <Textarea
                                                id={`${key}-body`}
                                                value={template.body}
                                                onChange={(event) =>
                                                    updateField(key, 'body', event.target.value)
                                                }
                                                rows={7}
                                                className="font-mono"
                                                placeholder="Bonjour {customer_name}, merci pour votre commande {order_reference}..."
                                            />
                                            {bodyError && <p className="text-sm text-red-600">{bodyError}</p>}
                                            <p className="text-xs text-slate-500">
                                                Utilisez les placeholders pour inserer automatiquement les informations de commande.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
