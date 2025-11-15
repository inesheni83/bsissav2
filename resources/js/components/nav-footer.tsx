import { Icon } from '@/components/icon';
import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const href =
                            typeof item.href === 'string'
                                ? item.href
                                : item.href.url;
                        const isExternal =
                            href.startsWith('http') ||
                            href.startsWith('mailto:');

        const content = (
            <>
                {item.icon && (
                    <Icon
                        iconNode={item.icon}
                        className="h-5 w-5"
                    />
                )}
                <span>{item.title}</span>
            </>
        );

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    asChild
                    className="rounded-xl text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-900"
                >
                    {isExternal ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {content}
                        </a>
                    ) : (
                        <Link href={href} prefetch>
                            {content}
                        </Link>
                    )}
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

