import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Globe, Layers, LifeBuoy, Package, PackageSearch, PlusCircle, ShoppingBag } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Mes produits',
        href: '/products',
        icon: ShoppingBag,
    },
    {
        title: 'Packs',
        href: '/admin/packs',
        icon: Package,
    },
    {
        title: 'Catégories',
        href: '/categories',
        icon: Layers,
    },
    {
        title: 'Commandes',
        href: '/orders',
        icon: PackageSearch,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Site public',
        href: '/',
        icon: Globe,
    },
    {
        title: 'Assistance',
        href: 'mailto:contact@bsissa.tn',
        icon: LifeBuoy,
    },
];

export function AppSidebar({navItems = [...mainNavItems]}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;
    const isManager = user?.role === 'admin' || user?.role === 'vendeur';
    const items = [...navItems];

    if (isManager) {
        items.push({
            title: 'Nouvelle catégorie',
            href: '/categories/create',
            icon: PlusCircle,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-emerald-100 bg-gradient-to-b from-white via-emerald-50/50 to-white text-emerald-900">
            <SidebarHeader className="border-b border-emerald-100 px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter className="border-t border-emerald-100 bg-white/60 px-2 py-4">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

