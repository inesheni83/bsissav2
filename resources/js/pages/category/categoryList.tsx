import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type Category = {
    id: number;
    name: string;
    slug: string | null;
    description: string | null;
    products_count: number;
    created_at: string | null;
    updated_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type CategoriesPageProps = {
    categories: {
        data: Category[];
        links: PaginationLink[];
        current_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
};

export default function CategoryList({ categories, filters }: CategoriesPageProps) {
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        get(route('categories.index'), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            data: {
                ...data,
            },
        });
    };

    const handleReset = () => {
        setData({ search: '' });
        get(route('categories.index'), {
            data: {},
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (category: Category) => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ? Cette action est définitive.`,
            )
        ) {
            router.delete(route('categories.destroy', category.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Catégories" />
            <div className="space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-emerald-900">Gestion des catégories</h1>
                        <p className="text-sm text-slate-600">
                            Ajoutez, modifiez ou supprimez les catégories utilisées par vos produits.
                        </p>
                    </div>
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href={route('categories.create')}>
                            <Plus className="h-4 w-4" />
                            Nouvelle catégorie
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filtrer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-center">
                            <Input
                                placeholder="Rechercher une catégorie..."
                                value={data.search}
                                onChange={(event) => setData('search', event.target.value)}
                                className="md:max-w-sm"
                            />
                            <div className="flex gap-3">
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                    Appliquer
                                </Button>
                                <Button type="button" variant="outline" onClick={handleReset}>
                                    Réinitialiser
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-lg font-semibold text-emerald-900">
                            {categories.total} catégorie{categories.total > 1 ? 's' : ''}
                        </CardTitle>
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                            Mis à jour automatiquement
                        </Badge>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Nom</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Slug</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Produits</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Description</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                            Aucune catégorie ne correspond à votre recherche.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-slate-50/60">
                                            <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {category.slug ?? <span className="italic text-slate-400">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{category.products_count}</td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {category.description ? (
                                                    <span className="line-clamp-2 max-w-md">{category.description}</span>
                                                ) : (
                                                    <span className="italic text-slate-400">Aucune description</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" asChild title="Modifier">
                                                        <Link href={route('categories.edit', category.id)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleDelete(category)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {categories.links.length > 1 && (
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                {categories.links.map((link, index) =>
                                    link.url ? (
                                        <Link key={`pagination-${index}`} href={link.url}>
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className={
                                                    link.active
                                                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                }
                                            >
                                                {formatLabel(link.label)}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button key={`pagination-${index}`} variant="ghost" size="sm" disabled>
                                            {formatLabel(link.label)}
                                        </Button>
                                    ),
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function formatLabel(label: string): string {
    const map: Record<string, string> = {
        '&laquo;': '«',
        '&raquo;': '»',
        '&lsaquo;': '‹',
        '&rsaquo;': '›',
        '&nbsp;': ' ',
    };

    return label.replace(/&[a-zA-Z]+;/g, (entity) => map[entity] ?? entity).replace(/<[^>]+>/g, '');
}
