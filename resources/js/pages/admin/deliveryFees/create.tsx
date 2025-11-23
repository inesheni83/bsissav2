import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

type FormData = {
    delivery_person_name: string;
    delivery_person_phone: string;
    amount: number | string;
    free_shipping_threshold: number | string;
    is_active: boolean;
    notes: string;
};

export default function DeliveryFeesCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        delivery_person_name: '',
        delivery_person_phone: '',
        amount: '',
        free_shipping_threshold: '',
        is_active: false,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.delivery-fees.store'));
    };

    return (
        <AppLayout>
            <Head title="Ajouter un frais de livraison" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Ajouter un frais de livraison</h1>
                                <p className="text-sm text-slate-600">Enregistrez un nouveau frais de livraison</p>
                            </div>
                            <Link href={route('admin.delivery-fees.index')}>
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du frais de livraison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery_person_name">Nom du livreur *</Label>
                                        <Input
                                            id="delivery_person_name"
                                            type="text"
                                            placeholder="Nom complet du livreur"
                                            value={data.delivery_person_name}
                                            onChange={(e) => setData('delivery_person_name', e.target.value)}
                                            className={errors.delivery_person_name ? 'border-red-500' : ''}
                                        />
                                        {errors.delivery_person_name && (
                                            <p className="text-sm text-red-600">{errors.delivery_person_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="delivery_person_phone">Téléphone du livreur *</Label>
                                        <Input
                                            id="delivery_person_phone"
                                            type="tel"
                                            placeholder="+216 XX XXX XXX"
                                            value={data.delivery_person_phone}
                                            onChange={(e) => setData('delivery_person_phone', e.target.value)}
                                            className={errors.delivery_person_phone ? 'border-red-500' : ''}
                                        />
                                        {errors.delivery_person_phone && (
                                            <p className="text-sm text-red-600">{errors.delivery_person_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Montant (TND) *</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className={errors.amount ? 'border-red-500' : ''}
                                        />
                                        {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="free_shipping_threshold">Seuil de livraison gratuite (TND)</Label>
                                        <Input
                                            id="free_shipping_threshold"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Ex: 100.00"
                                            value={data.free_shipping_threshold}
                                            onChange={(e) => setData('free_shipping_threshold', e.target.value)}
                                            className={errors.free_shipping_threshold ? 'border-red-500' : ''}
                                        />
                                        {errors.free_shipping_threshold && <p className="text-sm text-red-600">{errors.free_shipping_threshold}</p>}
                                        <p className="text-xs text-slate-500">
                                            Montant minimum du panier pour bénéficier de la livraison gratuite. Laissez vide pour désactiver.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (optionnel)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Ajoutez des notes supplémentaires..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        className={errors.notes ? 'border-red-500' : ''}
                                    />
                                    {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked === true)}
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer font-normal">
                                            Définir comme livreur actif
                                        </Label>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Note: Un seul livreur peut être actif à la fois. Si vous activez celui-ci, les autres seront automatiquement désactivés.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Link href={route('admin.delivery-fees.index')}>
                                        <Button type="button" variant="outline">
                                            Annuler
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
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
