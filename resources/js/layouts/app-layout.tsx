import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { NavItem, type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    items?: NavItem[];
}

export default ({ children, breadcrumbs, items, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} items={items} {...props} >
        {children}
    </AppLayoutTemplate>
);
