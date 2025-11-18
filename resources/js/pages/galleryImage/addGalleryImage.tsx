import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddGalleryImage() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        order: 0,
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('gallery-images.store'));
    };

    return (
        <AppLayout>
            <Head title="Ajouter une Image" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => window.history.back()}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                        <h2 className="text-3xl font-bold text-gray-900">Ajouter une Image</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Ajoutez une nouvelle image à la galerie
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de l'Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nom de l'image */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nom de l'image <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nom unique de l'image"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Ordre */}
                                <div className="space-y-2">
                                    <Label htmlFor="order">
                                        Ordre d'affichage <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value))}
                                        placeholder="0"
                                        className={errors.order ? 'border-red-500' : ''}
                                    />
                                    {errors.order && (
                                        <p className="text-sm text-red-600">{errors.order}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Les images seront affichées selon cet ordre
                                    </p>
                                </div>

                                {/* Upload d'image */}
                                <div className="space-y-2">
                                    <Label htmlFor="image">
                                        Image <span className="text-red-500">*</span>
                                    </Label>
                                    {!imagePreview ? (
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="image"
                                                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                                                    errors.image ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Cliquez pour télécharger</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF ou WebP (MAX. 5MB)
                                                    </p>
                                                </div>
                                                <input
                                                    id="image"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                    {errors.image && (
                                        <p className="text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing ? 'Ajout en cours...' : 'Ajouter l\'image'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        disabled={processing}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
