import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { Phone, MapPin, Building2, User, Mail } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Paramètres du profil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    regions = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    regions?: string[];
}) {
    const { auth } = usePage<SharedData>().props;

    // Fallback list of Tunisia regions if not provided by backend
    const availableRegions = regions.length > 0 ? regions : [
        'Ariana',
        'Beja',
        'Ben Arous',
        'Bizerte',
        'Gabes',
        'Gafsa',
        'Jendouba',
        'Kairouan',
        'Kasserine',
        'Kebili',
        'Le Kef',
        'Mahdia',
        'La Manouba',
        'Medenine',
        'Monastir',
        'Nabeul',
        'Sfax',
        'Sidi Bouzid',
        'Siliana',
        'Sousse',
        'Tataouine',
        'Tozeur',
        'Tunis',
        'Zaghouan',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paramètres du profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Informations personnelles */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-primary" />
                                            Informations personnelles
                                        </CardTitle>
                                        <CardDescription>
                                            Mettez à jour vos informations de base
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nom complet</Label>
                                            <Input
                                                id="name"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                                placeholder="Entrez votre nom complet"
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={errors.name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Adresse e-mail</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="mt-1 block w-full pl-10"
                                                    defaultValue={auth.user.email}
                                                    name="email"
                                                    required
                                                    autoComplete="username"
                                                    placeholder="votre@email.com"
                                                />
                                            </div>
                                            <InputError
                                                className="mt-2"
                                                message={errors.email}
                                            />
                                        </div>

                                        {mustVerifyEmail &&
                                            auth.user.email_verified_at === null && (
                                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                                    <p className="text-sm text-amber-800">
                                                        Votre adresse e-mail n'est pas vérifiée.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            className="font-medium underline underline-offset-4 transition-colors hover:text-amber-900"
                                                        >
                                                            Renvoyer l'e-mail de vérification
                                                        </Link>
                                                    </p>

                                                    {status === 'verification-link-sent' && (
                                                        <div className="mt-2 text-sm font-medium text-green-700">
                                                            ✓ Un nouveau lien de vérification a été envoyé
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    className="mt-1 block w-full pl-10"
                                                    defaultValue={auth.user.phone ?? ''}
                                                    name="phone"
                                                    autoComplete="tel"
                                                    placeholder="+216 XX XXX XXX"
                                                />
                                            </div>
                                            <InputError
                                                className="mt-2"
                                                message={errors.phone}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Adresse de livraison */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Adresse de livraison
                                        </CardTitle>
                                        <CardDescription>
                                            Vos coordonnées pour la livraison de vos commandes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="address_line1">Adresse ligne 1</Label>
                                            <Input
                                                id="address_line1"
                                                type="text"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.address_line1 ?? ''}
                                                name="address_line1"
                                                autoComplete="address-line1"
                                                placeholder="Numéro et nom de rue"
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={errors.address_line1}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="address_line2">Adresse ligne 2 (optionnel)</Label>
                                            <Input
                                                id="address_line2"
                                                type="text"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.address_line2 ?? ''}
                                                name="address_line2"
                                                autoComplete="address-line2"
                                                placeholder="Appartement, étage, bâtiment..."
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={errors.address_line2}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="city">Ville</Label>
                                                <Input
                                                    id="city"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    defaultValue={auth.user.city ?? ''}
                                                    name="city"
                                                    autoComplete="address-level2"
                                                    placeholder="Tunis"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.city}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="state">Région</Label>
                                                <select
                                                    id="state"
                                                    name="state"
                                                    autoComplete="address-level1"
                                                    defaultValue={auth.user.state ?? ''}
                                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Sélectionnez une région</option>
                                                    {availableRegions.map((region) => (
                                                        <option key={region} value={region}>
                                                            {region}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.state}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="postal_code">Code postal</Label>
                                                <Input
                                                    id="postal_code"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    defaultValue={auth.user.postal_code ?? ''}
                                                    name="postal_code"
                                                    autoComplete="postal-code"
                                                    placeholder="1000"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.postal_code}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="country">Pays</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="country"
                                                    type="text"
                                                    className="mt-1 block w-full pl-10"
                                                    defaultValue={auth.user.country ?? 'Tunisie'}
                                                    name="country"
                                                    autoComplete="country-name"
                                                    placeholder="Tunisie"
                                                />
                                            </div>
                                            <InputError
                                                className="mt-2"
                                                message={errors.country}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Bouton de sauvegarde */}
                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        size="lg"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="transition ease-in-out duration-200"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Enregistré avec succès
                                        </div>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* Section de suppression du compte */}
                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
