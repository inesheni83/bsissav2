import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { dashboardSeller } from '@/routes';
import { index as productsIndex } from '@/routes/products';
import { create as createProductRoute } from '@/actions/App/Http/Controllers/Product/AddProductController';
import { NavItem, type BreadcrumbItem, type SharedData } from '@/types';
import { LayoutGrid, Layers, PackageSearch, Plus, ShoppingBag, FileText, Truck, Users, Settings } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard vendeur',
        href: dashboardSeller(),
        icon: LayoutGrid,
    },
    {
        title: 'Mes produits',
        href: productsIndex(),
        icon: PackageSearch,
    },
    {
        title: 'Catégories',
        href: '/categories',
        icon: Layers,
    },
    {
        title: 'Gestion des commandes',
        href: '/admin/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Gestion des factures',
        href: '/admin/invoices',
        icon: FileText,
    },
    {
        title: 'Gestion de frais de livraison',
        href: '/admin/delivery-fees',
        icon: Truck,
    },
    {
        title: 'Gestion des clients',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Paramètres du site',
        href: '/admin/settings/site',
        icon: Settings,
    },
];

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    items,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; items?: NavItem[] }>) {
    const { auth } = usePage<SharedData>().props;

    // Filter menu items based on user role
    // Only show admin/vendeur menus if user is admin or vendeur
    const filteredItems = items ?? (auth.user && (auth.user.role === 'admin' || auth.user.role === 'vendeur')
        ? mainNavItems
        : []);

    return (
        <AppShell variant="sidebar">
            <AppSidebar navItems={filteredItems} />
            <AppContent variant="sidebar" className="bg-white">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
