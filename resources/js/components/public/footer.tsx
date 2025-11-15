import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowRight,
    CreditCard,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
    PackageCheck,
    Phone,
    ShieldCheck,
    Timer,
    Truck,
    Twitter,
    Youtube,
} from 'lucide-react';

type SiteSettings = {
    site_name: string;
    contact_email: string | null;
    contact_phone: string | null;
    physical_address: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    youtube_url: string | null;
};

const FEATURE_HIGHLIGHTS = [
    { icon: ShieldCheck, title: 'Paiement securise', description: 'Transactions protegees' },
    { icon: Truck, title: 'Livraison offerte des 90 TND', description: 'Partout en Tunisie' },
    { icon: Timer, title: 'Expedition 24h', description: 'Commandes prioritaires' },
];

const NAVIGATION_COLUMNS = [
    {
        heading: 'Decouvrir Bsissa',
        links: [
            { label: 'Notre histoire', href: '/about' },
            { label: 'Le blog', href: '/blog' },
            { label: 'Recettes gourmandes', href: '/recipes' },
            { label: 'Temoignages', href: '/testimonials' },
        ],
    },
    {
        heading: 'Service client',
        links: [
            { label: 'A propos', href: '/about' },
            { label: 'Suivi de commande', href: '/orders/track' },
            { label: 'Livraison & retours', href: '/shipping' },
            { label: 'Programme fidelite', href: '/loyalty' },
        ],
    },
    {
        heading: 'Informations legales',
        links: [
            { label: 'Mentions legales', href: '/legal' },
            { label: 'Politique de confidentialite', href: '/privacy' },
            { label: 'Conditions generales', href: '/terms' },
            { label: 'Gestion des cookies', href: '/cookies' },
        ],
    },
];

export default function PublicFooter({ siteSettings }: { siteSettings?: SiteSettings }) {
    const currentYear = new Date().getFullYear();

    // Build social links from site settings
    const socialLinks = [
        { icon: Instagram, label: 'Instagram', href: siteSettings?.instagram_url, colorClass: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-orange-400' },
        { icon: Facebook, label: 'Facebook', href: siteSettings?.facebook_url, colorClass: 'hover:bg-blue-600' },
        { icon: Twitter, label: 'Twitter', href: siteSettings?.twitter_url, colorClass: 'hover:bg-sky-500' },
        { icon: Youtube, label: 'YouTube', href: siteSettings?.youtube_url, colorClass: 'hover:bg-red-600' },
        { icon: Linkedin, label: 'LinkedIn', href: siteSettings?.linkedin_url, colorClass: 'hover:bg-slate-700' },
    ].filter(link => link.href); // Only show links that have URLs

    return (
        <footer className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white">
            <div className="border-b border-white/10">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5 sm:px-6 lg:px-8">
                    {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex gap-4 rounded-2xl bg-white/5 p-4 backdrop-blur transition hover:bg-white/10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-100">{title}</h3>
                                <p className="mt-1 text-sm text-emerald-200/80">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 ring-1 ring-white/20">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/90 text-emerald-950 font-black tracking-tight">B</div>
                            Bsissa Tresors du Terroir
                        </div>
                        <p className="max-w-md text-sm leading-relaxed text-emerald-100/80">
                            Des melanges authentiques pour celebrer le terroir tunisien. Saveurs naturelles, ingredients selectionnes, savoir-faire ancestral. Decouvrez une nouvelle
                            routine bien-etre et gourmande.
                        </p>
                    </div>

                    {NAVIGATION_COLUMNS.map(({ heading, links }) => (
                        <div key={heading} className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-100">{heading}</h4>
                            <ul className="space-y-3 text-sm text-emerald-100/75">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="inline-flex items-center gap-1 transition hover:pl-1 hover:text-white">
                                            <span className="h-1 w-1 rounded-full bg-emerald-400/60" aria-hidden="true" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-5 rounded-3xl bg-white/5 p-6 backdrop-blur">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-100">Contact</h4>
                        <p className="text-sm text-emerald-100/75">
                            Retrouvez-nous dans notre atelier pour degustations, ateliers et retraits de commandes. L&apos;experience Bsissa vous attend.
                        </p>
                        <div className="space-y-3 text-sm text-emerald-100/80">
                            {siteSettings?.physical_address && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
                                    <span>{siteSettings.physical_address}</span>
                                </div>
                            )}
                            {siteSettings?.contact_phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
                                    <a href={`tel:${siteSettings.contact_phone}`} className="transition hover:text-white">
                                        {siteSettings.contact_phone}
                                    </a>
                                </div>
                            )}
                            {siteSettings?.contact_email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
                                    <a href={`mailto:${siteSettings.contact_email}`} className="transition hover:text-white">
                                        {siteSettings.contact_email}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-3xl bg-white/5 p-6 backdrop-blur">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-100">Abonnez-vous</h4>
                        <p className="text-sm text-emerald-100/75">
                            Recevez nos nouveautes, recettes exclusives et offres privees. Une fois par semaine, pas plus.
                        </p>
                        <form className="flex flex-col gap-3 sm:flex-row sm:items-center" noValidate>
                            <Input
                                type="email"
                                placeholder="Votre adresse email"
                                className="h-12 flex-1 rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-amber-400"
                                required
                                aria-label="Adresse email"
                                name="newsletter_email"
                            />
                            <Button
                                type="submit"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-500 px-6 font-semibold text-emerald-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
                                aria-label="S'abonner a la newsletter"
                            >
                                Je m'abonne
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                        <p className="text-xs text-emerald-100/60">En vous inscrivant, vous acceptez notre politique de confidentialite.</p>
                    </div>

                    {socialLinks.length > 0 && (
                        <div className="space-y-5 rounded-3xl bg-white/5 p-6 backdrop-blur">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-100">Restez connectes</h4>
                            <p className="text-sm text-emerald-100/75">Suivez-nous pour decouvrir les coulisses, recettes video et evenements a venir.</p>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map(({ icon: Icon, label, href, colorClass }) => (
                                    <a
                                        key={label}
                                        href={href!}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        aria-label={label}
                                        className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition ${colorClass}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-white/10 bg-black/20">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-emerald-100/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>© {currentYear} {siteSettings?.site_name || 'Bsissa'}. Tous droits reserves.</p>
                    <div className="flex flex-wrap gap-4">
                        <a href="/sitemap" className="transition hover:text-white">
                            Plan du site
                        </a>
                        <a href="/accessibility" className="transition hover:text-white">
                            Accessibilite
                        </a>
                        <a href="/press" className="transition hover:text-white">
                            Espace presse
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
