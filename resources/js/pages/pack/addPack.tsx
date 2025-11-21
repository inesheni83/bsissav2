import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Package, Upload, X, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useRef, useCallback } from 'react';
import { usePage } from '@inertiajs/react';

type Product = {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    category_id: number;
};

type SelectedProduct = {
    product_id: number;
    quantity: number;
    product: Product;
};

type PageProps = {
    products: Product[];
    errors: Record<string, string>;
};

export default function AddPack({ products }: PageProps) {
    const { errors: pageErrors = {} } = usePage<PageProps>().props;
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        reference_price: '',
        is_active: true,
        stock_quantity: '',
    });

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProductSelector, setShowProductSelector] = useState(false);

    const mainImageInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, is_active: checked }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = 5 - galleryImages.length;
        const filesToAdd = files.slice(0, remainingSlots);

        if (filesToAdd.length > 0) {
            setGalleryImages((prev) => [...prev, ...filesToAdd]);

            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGalleryPreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMainImage = () => {
        setMainImage(null);
        setMainImagePreview(null);
        if (mainImageInputRef.current) {
            mainImageInputRef.current.value = '';
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages((prev) => prev.filter((_, i) => i !== index));
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const addProduct = (product: Product) => {
        const exists = selectedProducts.find((p) => p.product_id === product.id);
        if (!exists) {
            setSelectedProducts((prev) => [
                ...prev,
                { product_id: product.id, quantity: 1, product },
            ]);
        }
        setShowProductSelector(false);
        setSearchQuery('');
    };

    const removeProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((p) => p.product_id !== productId));
    };

    const updateProductQuantity = (productId: number, quantity: number) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.product_id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
            )
        );
    };

    const calculateSavings = useCallback(() => {
        const price = parseFloat(formData.price) || 0;
        const refPrice = parseFloat(formData.reference_price) || 0;
        if (refPrice > price && price > 0) {
            const savings = refPrice - price;
            const percentage = Math.round((savings / refPrice) * 100);
            return { savings, percentage };
        }
        return null;
    }, [formData.price, formData.reference_price]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('is_active', formData.is_active ? '1' : '0');
        formDataToSend.append('stock_quantity', formData.stock_quantity);

        if (formData.reference_price) {
            formDataToSend.append('reference_price', formData.reference_price);
        }

        if (mainImage) {
            formDataToSend.append('main_image', mainImage);
        }

        galleryImages.forEach((image, index) => {
            formDataToSend.append(`gallery_images[${index}]`, image);
        });

        selectedProducts.forEach((item, index) => {
            formDataToSend.append(`products[${index}][product_id]`, item.product_id.toString());
            formDataToSend.append(`products[${index}][quantity]`, item.quantity.toString());
        });

        router.post(route('packs.store'), formDataToSend, {
            forceFormData: true,
            preserveState: (page) => Object.keys(page.props.errors || {}).length > 0,
            preserveScroll: (page) => Object.keys(page.props.errors || {}).length > 0,
            onError: (errors) => {
                console.error('Validation errors:', errors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const savings = calculateSavings();

    return (
        <AppLayout>
            <Head title="Créer un Pack" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Créer un nouveau Pack
                            </h1>
                            <p className="text-sm text-slate-600">
                                Créez un pack de produits avec des prix avantageux
                            </p>
                        </div>
                    </div>

                    {/* Error Display */}
                    {Object.keys(pageErrors).length > 0 && (
                        <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 shadow-sm" role="alert">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-red-900 mb-2">
                                        Veuillez corriger les erreurs suivantes :
                                    </h3>
                                    <ul className="space-y-1 text-sm text-red-800">
                                        {Object.entries(pageErrors).map(([field, error]) => (
                                            <li key={field} className="flex items-start gap-2">
                                                <span className="text-red-600 mt-0.5">•</span>
                                                <span><strong className="font-medium">{field}:</strong> {error}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de base</CardTitle>
                                <CardDescription>
                                    Renseignez les détails principaux du pack
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nom du pack *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Pack Découverte"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Décrivez le pack et ses avantages..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="price">Prix du pack (DT) *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="reference_price">Prix de référence (DT)</Label>
                                        <Input
                                            id="reference_price"
                                            name="reference_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.reference_price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                            Pour afficher l'économie réalisée
                                        </p>
                                    </div>
                                </div>

                                {savings && (
                                    <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-orange-100 text-orange-700">
                                                -{savings.percentage}%
                                            </Badge>
                                            <span className="text-sm text-slate-700">
                                                Économie de <strong>{Number(savings.savings).toFixed(2)} DT</strong>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="stock_quantity">Stock disponible *</Label>
                                        <Input
                                            id="stock_quantity"
                                            name="stock_quantity"
                                            type="number"
                                            min="0"
                                            value={formData.stock_quantity}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <Label htmlFor="is_active" className="cursor-pointer">
                                                Pack actif
                                            </Label>
                                            <p className="text-xs text-slate-500">
                                                Visible sur le site
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Image principale *</CardTitle>
                                <CardDescription>
                                    Ajoutez l'image principale du pack (JPG ou PNG, max 5MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {mainImagePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={mainImagePreview}
                                            alt="Aperçu"
                                            className="h-48 w-48 rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeMainImage}
                                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => mainImageInputRef.current?.click()}
                                        className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-emerald-500 hover:bg-emerald-50/50"
                                    >
                                        <Upload className="h-12 w-12 text-slate-400" />
                                        <p className="mt-2 text-sm text-slate-600">
                                            Cliquez pour ajouter une image
                                        </p>
                                        <p className="text-xs text-slate-500">JPG, PNG (max 5MB)</p>
                                    </div>
                                )}
                                <input
                                    ref={mainImageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleMainImageChange}
                                    className="hidden"
                                />
                            </CardContent>
                        </Card>

                        {/* Gallery Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Galerie d'images</CardTitle>
                                <CardDescription>
                                    Ajoutez jusqu'à 5 images supplémentaires (optionnel)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {galleryPreviews.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                                            {galleryPreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Galerie ${index + 1}`}
                                                        className="h-24 w-24 rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {galleryImages.length < 5 && (
                                        <div
                                            onClick={() => galleryInputRef.current?.click()}
                                            className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-emerald-500 hover:bg-emerald-50/50"
                                        >
                                            <Upload className="h-8 w-8 text-slate-400" />
                                            <p className="mt-2 text-sm text-slate-600">
                                                Ajouter des images ({galleryImages.length}/5)
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        ref={galleryInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        multiple
                                        onChange={handleGalleryImagesChange}
                                        className="hidden"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Produits du pack *</CardTitle>
                                <CardDescription>
                                    Sélectionnez les produits à inclure dans le pack
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedProducts.length > 0 && (
                                    <div className="space-y-2">
                                        {selectedProducts.map((item) => (
                                            <div
                                                key={item.product_id}
                                                className="flex items-center gap-4 rounded-lg border bg-white p-3"
                                            >
                                                {item.product.image_url && (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {item.product.slug}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor={`qty-${item.product_id}`} className="text-sm">
                                                        Qté:
                                                    </Label>
                                                    <Input
                                                        id={`qty-${item.product_id}`}
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateProductQuantity(
                                                                item.product_id,
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="w-20"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeProduct(item.product_id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showProductSelector ? (
                                    <div className="space-y-3 rounded-lg border bg-slate-50 p-4">
                                        <div className="flex items-center gap-2">
                                            <Search className="h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Rechercher un produit..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowProductSelector(false);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="max-h-60 space-y-1 overflow-y-auto">
                                            {filteredProducts.map((product) => {
                                                const isSelected = selectedProducts.some(
                                                    (p) => p.product_id === product.id
                                                );
                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        onClick={() => !isSelected && addProduct(product)}
                                                        disabled={isSelected}
                                                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                                                            isSelected
                                                                ? 'cursor-not-allowed bg-slate-200 opacity-50'
                                                                : 'hover:bg-white'
                                                        }`}
                                                    >
                                                        {product.image_url && (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {product.slug}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <Badge variant="secondary">Sélectionné</Badge>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                            {filteredProducts.length === 0 && (
                                                <p className="py-4 text-center text-sm text-slate-500">
                                                    Aucun produit trouvé
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowProductSelector(true)}
                                        className="w-full"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter un produit
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(route('packs.index'))}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                                Créer le pack
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
