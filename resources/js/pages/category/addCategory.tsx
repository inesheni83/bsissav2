import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

type CategoryForm = {
    name: string;
    slug: string;
    description: string;
};

export default function AddCategory() {
    const { data, setData, post, processing, errors } = useForm<CategoryForm>({
        name: '',
        slug: '',
        description: '',
    });
    const [autoSlug, setAutoSlug] = useState(true);

    useEffect(() => {
        if (autoSlug) {
            setData('slug', slugify(data.name));
        }
    }, [autoSlug, data.name, setData]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(route('categories.store'));
    };

    const handleFieldChange = (field: keyof CategoryForm, value: string) => {
        setData(field, value);

        if (field === 'name' && autoSlug) {
            setData('slug', slugify(value));
        }
    };

    return (
        <AppLayout>
            <Head title="Nouvelle catégorie" />

            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-amber-50" />

            <div className="min-h-screen pb-16">
                <header className="border-b border-emerald-100/70 bg-white/85 backdrop-blur">
                    <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="ghost" size="sm" className="gap-2 text-emerald-700">
                                <Link href={route('categories.index')}>
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour
                                </Link>
                            </Button>
                            <div className="h-6 w-px bg-emerald-100" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
                                    Catégories
                                </p>
                                <h1 className="text-lg font-semibold text-emerald-900 sm:text-xl">
                                    Nouvelle catégorie
                                </h1>
                                <p className="text-sm text-emerald-700/70">
                                    Organisez votre catalogue avec des catégories claires et inspirantes.
                                </p>
                            </div>
                        </div>
                        {processing && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enregistrement...
                            </div>
                        )}
                    </div>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto mt-10 max-w-4xl px-4 sm:px-6 lg:px-8"
                >
                    <Card className="border-emerald-100/70 shadow-lg shadow-emerald-200/30">
                        <CardHeader className="border-b border-emerald-100/60 bg-gradient-to-r from-white via-emerald-50/40 to-white">
                            <CardTitle className="text-base font-semibold text-emerald-900">
                                Informations principales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-emerald-800">
                                        Nom de la catégorie <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) => handleFieldChange('name', event.target.value)}
                                        placeholder="Exemple : Produits artisanaux"
                                        className="border-emerald-200 text-emerald-900 focus:border-emerald-400"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="slug" className="text-sm font-medium text-emerald-800">
                                            Slug
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="auto_slug"
                                                checked={autoSlug}
                                                onCheckedChange={(checked) => setAutoSlug(Boolean(checked))}
                                            />
                                            <Label htmlFor="auto_slug" className="text-xs text-emerald-600">
                                                Auto
                                            </Label>
                                        </div>
                                    </div>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(event) => handleFieldChange('slug', event.target.value)}
                                        placeholder="produits-artisanaux"
                                        disabled={autoSlug}
                                        className="border-emerald-200 text-emerald-900 disabled:bg-emerald-50"
                                    />
                                    {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-emerald-800">
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(event) => handleFieldChange('description', event.target.value)}
                                    rows={4}
                                    placeholder="Décrivez la personnalité de cette catégorie pour guider vos clients."
                                    className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t border-emerald-100/60 bg-emerald-50/40 px-6 py-4">
                            <div className="text-xs text-emerald-600/80">
                                Astuce : choisissez un nom qui reflète l’univers sensoriel de vos produits.
                            </div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 shadow-md shadow-emerald-300/50 hover:from-emerald-400 hover:to-emerald-500"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Enregistrer
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}

function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}
