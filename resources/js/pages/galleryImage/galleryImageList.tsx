import { Head, Link, router } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DeleteImageDialog } from '@/components/galleryImage/DeleteImageDialog';

type GalleryImage = {
    id: number;
    name: string;
    order: number;
    image: string | null;
    image_url?: string | null;
    created_at: string;
    updated_at: string;
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type GalleryImageListProps = {
    images: Paginator<GalleryImage>;
};

export default function GalleryImageList({ images }: GalleryImageListProps) {
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDeleteClick = (id: number, name: string) => {
        setDeleteTarget({ id, name });
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;

        setDeletingId(deleteTarget.id);
        router.delete(route('gallery-images.destroy', deleteTarget.id), {
            onFinish: () => {
                setDeletingId(null);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Gestion des Images de Galerie" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Galerie d'Images</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Gérez les images de votre galerie
                            </p>
                        </div>
                        <Link href={route('gallery-images.create')}>
                            <Button className="flex items-center gap-2" aria-label="Ajouter une nouvelle image">
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Ajouter une Image
                            </Button>
                        </Link>
                    </div>

                    {images.data.length > 0 ? (
                        <>
                            <div
                                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                role="list"
                                aria-label="Liste des images de galerie"
                            >
                                {images.data.map((image) => (
                                    <Card
                                        key={image.id}
                                        className="overflow-hidden transition-shadow hover:shadow-lg"
                                        role="listitem"
                                    >
                                        <div className="relative aspect-square bg-gray-100">
                                            {image.image_url ? (
                                                <img
                                                    src={image.image_url}
                                                    alt={`Image de galerie: ${image.name}`}
                                                    width="400"
                                                    height="400"
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <span
                                                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow"
                                                    aria-label={`Ordre d'affichage: ${image.order}`}
                                                >
                                                    Ordre: {image.order}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="mb-3 text-lg font-semibold text-gray-900 truncate">
                                                {image.name}
                                            </h3>
                                            <div className="flex gap-2" role="group" aria-label="Actions pour cette image">
                                                <Link
                                                    href={route('gallery-images.edit', image.id)}
                                                    className="flex-1"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        aria-label={`Modifier l'image ${image.name}`}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                                                        Modifier
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(image.id, image.name)}
                                                    disabled={deletingId === image.id}
                                                    aria-label={`Supprimer l'image ${image.name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {images.last_page > 1 && (
                                <nav
                                    className="mt-8 flex items-center justify-center gap-2"
                                    role="navigation"
                                    aria-label="Navigation de pagination"
                                >
                                    {images.links.map((link, index) => (
                                        <Link key={index} href={link.url || '#'}>
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                aria-current={link.active ? 'page' : undefined}
                                                aria-label={
                                                    link.label.includes('Previous') ? 'Page précédente' :
                                                    link.label.includes('Next') ? 'Page suivante' :
                                                    `Page ${link.label}`
                                                }
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </Link>
                                    ))}
                                </nav>
                            )}
                        </>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <ImageIcon className="mb-4 h-16 w-16 text-gray-400" aria-hidden="true" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                    Aucune image
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    Commencez par ajouter votre première image à la galerie.
                                </p>
                                <Link href={route('gallery-images.create')}>
                                    <Button aria-label="Ajouter une nouvelle image à la galerie">
                                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Ajouter une Image
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteTarget && (
                <DeleteImageDialog
                    imageName={deleteTarget.name}
                    isDeleting={deletingId === deleteTarget.id}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </AppLayout>
    );
}
