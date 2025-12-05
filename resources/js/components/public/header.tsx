import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { BsissaLogo } from '@/components/branding/bsissa-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowRight,
    ChevronDown,
    Mail,
    Menu,
    Phone,
    Search,
    ShoppingCart,
    User,
    X,
} from 'lucide-react';
import { dashboardSeller, home, login, logout } from '@/routes';
import type { SharedData } from '@/types';

type MenuLink = {
    name: string;
    href: string;
    highlight?: boolean;
};

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

type DeliveryInfo = {
    amount: number;
    is_free: boolean;
    threshold: number | null;
    remaining_for_free_shipping: number | null;
};

export default function PublicHeader({ siteSettings }: { siteSettings?: SiteSettings }) {
    const page = usePage<SharedData & { deliveryInfo?: DeliveryInfo }>();
    const { auth, cart, deliveryInfo, categories } = page.props;
    const currentUrl = page.url;
    const userRole = auth?.user?.role;
    const canAccessSellerArea = userRole === 'admin' || userRole === 'vendeur';
    const cartCount = cart?.items_count ?? 0;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const productsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
                setIsProductsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            const timeout = setTimeout(() => searchInputRef.current?.focus(), 120);
            return () => clearTimeout(timeout);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const menuLinks: MenuLink[] = useMemo(() => {
        const baseLinks: MenuLink[] = [
            { name: 'Accueil', href: home().url },
            { name: 'Packs', href: '/packs' },
        ];

        if (canAccessSellerArea) {
            baseLinks.push({
                name: 'Espace vendeur',
                href: dashboardSeller().url,
                highlight: userRole === 'vendeur',
            });
        }

        return baseLinks;
    }, [canAccessSellerArea, userRole]);

    const userMenuItems = auth.user
        ? [
              { name: 'Mes commandes', href: '/orders' },
              { name: 'Mon profil', href: '/settings' },
          ]
        : [];

    const isActive = (href: string) => {
        if (!currentUrl) {
            return false;
        }

        if (href === '/') {
            return currentUrl === '/';
        }

        return currentUrl === href || currentUrl.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-b from-emerald-950 via-emerald-950/90 to-emerald-950/70 text-white shadow-lg shadow-emerald-950/10 backdrop-blur">
            <Head title="Accueil" />

            {(siteSettings?.contact_phone || siteSettings?.contact_email) && (
                <div className="hidden border-b border-white/10 bg-emerald-950/80 text-xs font-medium text-emerald-100/80 lg:block">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
                        <div className="flex items-center gap-6">
                            {siteSettings?.contact_phone && (
                                <a href={`tel:${siteSettings.contact_phone}`} className="flex items-center gap-2 transition hover:text-white">
                                    <Phone className="h-4 w-4 text-amber-300" />
                                    {siteSettings.contact_phone}
                                </a>
                            )}
                            {siteSettings?.contact_email && (
                                <a href={`mailto:${siteSettings.contact_email}`} className="flex items-center gap-2 transition hover:text-white">
                                    <Mail className="h-4 w-4 text-amber-300" />
                                    {siteSettings.contact_email}
                                </a>
                            )}
                            {deliveryInfo && deliveryInfo.threshold !== null && deliveryInfo.threshold > 0 && (
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-amber-300" />
                                    <span>Plus que {Math.round(deliveryInfo.threshold)} TND pour bénéficier de la livraison gratuite !</span>
                                </div>
                            )}
                        </div>
                        <p className="hidden xl:block text-emerald-100/90">Saveurs authentiques de Tunisie · Livraison express en 24h</p>
                    </div>
                </div>
            )}

            <div className="relative">
                <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-8">
                        <Link
                            href={home()}
                            className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
                            aria-label="Retour Ã  l'accueil Bsissa Zed Moulouk"
                        >
                            <BsissaLogo />
                        </Link>

                        <nav className="hidden lg:block">
                            <ul className="flex items-center gap-1 text-sm">
                                {/* Lien Accueil */}
                                <li>
                                    <Link
                                        href={home().url}
                                        className={`group relative flex items-center gap-1 rounded-full px-4 py-2 font-medium transition ${
                                            isActive(home().url)
                                                ? 'bg-white/15 text-white shadow shadow-emerald-900/30'
                                                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        Accueil
                                        <span
                                            className={`pointer-events-none absolute inset-x-4 bottom-1 h-px rounded-full transition-transform duration-200 group-hover:scale-x-100 ${
                                                isActive(home().url) ? 'scale-x-100 bg-amber-400/80' : 'scale-x-0 bg-emerald-100/60'
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>

                                {/* Menu déroulant Produits */}
                                <li className="relative" ref={productsMenuRef}>
                                    <button
                                        onClick={() => setIsProductsMenuOpen((value) => !value)}
                                        className={`group relative flex items-center gap-1 rounded-full px-4 py-2 font-medium transition ${
                                            currentUrl?.includes('category_id')
                                                ? 'bg-white/15 text-white shadow shadow-emerald-900/30'
                                                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                        aria-haspopup="menu"
                                        aria-expanded={isProductsMenuOpen}
                                    >
                                        Produits
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isProductsMenuOpen && categories && categories.length > 0 && (
                                        <div className="absolute left-0 mt-3 w-56 rounded-2xl border border-white/10 bg-emerald-950/95 p-2 text-sm shadow-xl shadow-emerald-950/40 backdrop-blur">
                                            <div className="space-y-1">
                                                {categories.map((category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/?category_id=${category.id}`}
                                                        className="flex items-center justify-between rounded-lg px-3 py-2 text-emerald-50/90 transition hover:bg-white/10 hover:text-white"
                                                        onClick={() => setIsProductsMenuOpen(false)}
                                                    >
                                                        {category.name}
                                                        <ArrowRight className="h-3.5 w-3.5 text-emerald-100/60" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>

                                {/* Autres liens du menu */}
                                {menuLinks.filter(item => item.name !== 'Accueil').map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`group relative flex items-center gap-1 rounded-full px-4 py-2 font-medium transition ${
                                                isActive(item.href)
                                                    ? 'bg-white/15 text-white shadow shadow-emerald-900/30'
                                                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {item.name}
                                            {item.highlight && (
                                                <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-semibold text-emerald-950">Nouveau</span>
                                            )}
                                            <span
                                                className={`pointer-events-none absolute inset-x-4 bottom-1 h-px rounded-full transition-transform duration-200 group-hover:scale-x-100 ${
                                                    isActive(item.href) ? 'scale-x-100 bg-amber-400/80' : 'scale-x-0 bg-emerald-100/60'
                                                }`}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Ouvrir la recherche"
                            aria-expanded={isSearchOpen}
                            onClick={() => setIsSearchOpen((value) => !value)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-emerald-50 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <div className="relative">
                            <Link
                                href="/cart"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-emerald-50 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
                                aria-label="Panier"
                            >
                                <ShoppingCart className="h-6 w-6" />
                            </Link>
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-emerald-950 shadow-lg shadow-amber-500/40">
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen((value) => !value)}
                                className="flex items-center gap-2 rounded-full p-2 text-emerald-50 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
                                aria-haspopup="menu"
                                aria-expanded={isUserMenuOpen}
                            >
                                <User className="h-6 w-6" />
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                <span className="sr-only">Menu utilisateur</span>
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-emerald-950/95 p-2 text-sm shadow-xl shadow-emerald-950/40 backdrop-blur">
                                    {auth.user ? (
                                        <div className="space-y-1 text-emerald-50/90">
                                            <div className="mb-2 rounded-xl bg-white/10 px-3 py-2 text-xs uppercase tracking-wide text-emerald-100/70">
                                                Bonjour, {auth.user.name ?? 'Gourmet'}
                                            </div>
                                            {userMenuItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    {item.name}
                                                    <ArrowRight className="h-3.5 w-3.5 text-emerald-100/60" />
                                                </Link>
                                            ))}
                                            <Link
                                                href={logout().url}
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-white/10 hover:text-white"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Deconnexion
                                                <ArrowRight className="h-3.5 w-3.5 text-emerald-100/60" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <Link
                                            href={login().url}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-semibold text-emerald-950 transition hover:bg-amber-400"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Connexion
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMenuOpen((value) => !value)}
                            className="rounded-full p-2 text-emerald-50 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950 lg:hidden"
                            aria-label="Ouvrir le menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {isSearchOpen && (
                    <div className="absolute inset-x-0 top-full z-40 border-b border-white/10 bg-emerald-950/90 py-6 shadow-lg shadow-emerald-950/20 backdrop-blur">
                        <form action="/" method="get" className="mx-auto flex max-w-3xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:px-6">
                            <Input
                                ref={searchInputRef}
                                type="search"
                                name="search"
                                placeholder="Rechercher un produit, une recette..."
                                className="h-12 flex-1 rounded-full border-white/20 bg-white/10 text-white placeholder:text-emerald-100/70 focus-visible:ring-amber-300"
                            />
                            <Button type="submit" className="h-12 rounded-full bg-amber-500 px-6 text-emerald-950 shadow-amber-500/20 hover:bg-amber-400">
                                Rechercher
                            </Button>
                        </form>
                    </div>
                )}
            </div>

            {isMenuOpen && (
                <div className="lg:hidden">
                    <div
                        className="fixed inset-0 z-40 bg-emerald-950/80 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <nav className="fixed inset-y-0 right-0 z-50 w-80 max-w-full overflow-y-auto bg-emerald-950 px-6 pb-12 pt-24 shadow-2xl shadow-emerald-950/60">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                {/* Lien Accueil */}
                                <Link
                                    href={home().url}
                                    className={`block rounded-2xl px-4 py-3 text-base font-semibold transition ${
                                        isActive(home().url) ? 'bg-white/15 text-white shadow shadow-emerald-900/30' : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Accueil
                                </Link>

                                {/* Menu Produits avec catégories */}
                                <div>
                                    <button
                                        onClick={() => setIsMobileProductsOpen((value) => !value)}
                                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition ${
                                            currentUrl?.includes('category_id')
                                                ? 'bg-white/15 text-white shadow shadow-emerald-900/30'
                                                : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        Produits
                                        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isMobileProductsOpen && categories && categories.length > 0 && (
                                        <div className="mt-2 space-y-1 pl-4">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/?category_id=${category.id}`}
                                                    className="flex items-center justify-between rounded-xl px-4 py-2 text-sm text-emerald-100/80 transition hover:bg-white/10 hover:text-white"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {category.name}
                                                    <ArrowRight className="h-3.5 w-3.5 text-emerald-100/60" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Autres liens du menu */}
                                {menuLinks.filter(item => item.name !== 'Accueil').map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`block rounded-2xl px-4 py-3 text-base font-semibold transition ${
                                            isActive(item.href) ? 'bg-white/15 text-white shadow shadow-emerald-900/30' : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="rounded-3xl bg-white/5 p-4 text-sm text-emerald-100/80">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Besoin d'aide ?</h4>
                                <div className="mt-3 space-y-2">
                                    <a href="tel:+21671000000" className="flex items-center gap-2 transition hover:text-white">
                                        <Phone className="h-4 w-4 text-amber-300" />
                                        +216 71 000 000
                                    </a>
                                    <a href="mailto:contact@bsissa.tn" className="flex items-center gap-2 transition hover:text-white">
                                        <Mail className="h-4 w-4 text-amber-300" />
                                        contact@bsissa.tn
                                    </a>
                                </div>
                            </div>

                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-emerald-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
                            >
                                Commander maintenant
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

