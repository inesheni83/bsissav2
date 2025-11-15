import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Settings,
    Save,
    Image as ImageIcon,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type SiteSettings = {
    id: number;
    site_name: string;
    logo: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    physical_address: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    youtube_url: string | null;
};

type PageProps = {
    settings: SiteSettings;
};

export default function SiteSettings({ settings }: PageProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.logo ? `/storage/${settings.logo}` : null
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        site_name: settings.site_name || '',
        logo: null as File | null,
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        physical_address: settings.physical_address || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        twitter_url: settings.twitter_url || '',
        linkedin_url: settings.linkedin_url || '',
        youtube_url: settings.youtube_url || '',
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteLogo = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer le logo ?')) {
            router.delete(route('admin.settings.site.deleteLogo'), {
                onSuccess: () => {
                    setLogoPreview(null);
                    setData('logo', null);
                },
            });
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.settings.site.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally reset logo file input after successful upload
                if (data.logo) {
                    setData('logo', null);
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Paramètres du site" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Paramètres du site</h1>
                                <p className="text-sm text-slate-600">Gérez les informations générales du site</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Settings className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* General Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-emerald-600" />
                                    Informations générales
                                </CardTitle>
                                <CardDescription>
                                    Configurez les informations de base de votre site
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Site Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="site_name">Nom du site *</Label>
                                    <Input
                                        id="site_name"
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        className="max-w-md"
                                        required
                                    />
                                    {errors.site_name && (
                                        <p className="text-sm text-red-600">{errors.site_name}</p>
                                    )}
                                </div>

                                {/* Logo */}
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Logo du site</Label>
                                    <div className="flex items-start gap-4">
                                        {logoPreview && (
                                            <div className="relative">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="h-32 w-32 rounded-lg border border-slate-200 object-contain p-2"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute -right-2 -top-2"
                                                    onClick={deleteLogo}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                        <div className="flex-1 max-w-md">
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                            />
                                            <p className="mt-1 text-xs text-slate-500">
                                                Formats acceptés: JPG, PNG, GIF, SVG (max 2MB)
                                            </p>
                                            {errors.logo && (
                                                <p className="text-sm text-red-600">{errors.logo}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-emerald-600" />
                                    Informations de contact
                                </CardTitle>
                                <CardDescription>
                                    Configurez les coordonnées de contact
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        Email de contact
                                    </Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="max-w-md"
                                        placeholder="contact@example.com"
                                    />
                                    {errors.contact_email && (
                                        <p className="text-sm text-red-600">{errors.contact_email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        Téléphone
                                    </Label>
                                    <Input
                                        id="contact_phone"
                                        type="tel"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="max-w-md"
                                        placeholder="+216 XX XXX XXX"
                                    />
                                    {errors.contact_phone && (
                                        <p className="text-sm text-red-600">{errors.contact_phone}</p>
                                    )}
                                </div>

                                {/* Physical Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="physical_address" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        Adresse physique
                                    </Label>
                                    <Textarea
                                        id="physical_address"
                                        value={data.physical_address}
                                        onChange={(e) => setData('physical_address', e.target.value)}
                                        className="max-w-md"
                                        rows={3}
                                        placeholder="Adresse complète..."
                                    />
                                    {errors.physical_address && (
                                        <p className="text-sm text-red-600">{errors.physical_address}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Facebook className="h-5 w-5 text-emerald-600" />
                                    Réseaux sociaux
                                </CardTitle>
                                <CardDescription>
                                    Configurez les liens vers vos réseaux sociaux
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Facebook */}
                                <div className="space-y-2">
                                    <Label htmlFor="facebook_url" className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-blue-600" />
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebook_url"
                                        type="url"
                                        value={data.facebook_url}
                                        onChange={(e) => setData('facebook_url', e.target.value)}
                                        className="max-w-md"
                                        placeholder="https://facebook.com/votreprofil"
                                    />
                                    {errors.facebook_url && (
                                        <p className="text-sm text-red-600">{errors.facebook_url}</p>
                                    )}
                                </div>

                                {/* Instagram */}
                                <div className="space-y-2">
                                    <Label htmlFor="instagram_url" className="flex items-center gap-2">
                                        <Instagram className="h-4 w-4 text-pink-600" />
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagram_url"
                                        type="url"
                                        value={data.instagram_url}
                                        onChange={(e) => setData('instagram_url', e.target.value)}
                                        className="max-w-md"
                                        placeholder="https://instagram.com/votreprofil"
                                    />
                                    {errors.instagram_url && (
                                        <p className="text-sm text-red-600">{errors.instagram_url}</p>
                                    )}
                                </div>

                                {/* Twitter */}
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_url" className="flex items-center gap-2">
                                        <Twitter className="h-4 w-4 text-blue-400" />
                                        Twitter / X
                                    </Label>
                                    <Input
                                        id="twitter_url"
                                        type="url"
                                        value={data.twitter_url}
                                        onChange={(e) => setData('twitter_url', e.target.value)}
                                        className="max-w-md"
                                        placeholder="https://twitter.com/votreprofil"
                                    />
                                    {errors.twitter_url && (
                                        <p className="text-sm text-red-600">{errors.twitter_url}</p>
                                    )}
                                </div>

                                {/* LinkedIn */}
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4 text-blue-700" />
                                        LinkedIn
                                    </Label>
                                    <Input
                                        id="linkedin_url"
                                        type="url"
                                        value={data.linkedin_url}
                                        onChange={(e) => setData('linkedin_url', e.target.value)}
                                        className="max-w-md"
                                        placeholder="https://linkedin.com/company/votreentreprise"
                                    />
                                    {errors.linkedin_url && (
                                        <p className="text-sm text-red-600">{errors.linkedin_url}</p>
                                    )}
                                </div>

                                {/* YouTube */}
                                <div className="space-y-2">
                                    <Label htmlFor="youtube_url" className="flex items-center gap-2">
                                        <Youtube className="h-4 w-4 text-red-600" />
                                        YouTube
                                    </Label>
                                    <Input
                                        id="youtube_url"
                                        type="url"
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        className="max-w-md"
                                        placeholder="https://youtube.com/@votrechaine"
                                    />
                                    {errors.youtube_url && (
                                        <p className="text-sm text-red-600">{errors.youtube_url}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
