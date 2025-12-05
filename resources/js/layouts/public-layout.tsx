import { type ReactNode } from 'react';
import PublicHeader from '@/components/public/header';
import PublicFooter from '@/components/public/footer';
import { usePage } from '@inertiajs/react';

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

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { props } = usePage<{ siteSettings?: SiteSettings }>();
    const siteSettings = props.siteSettings;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900">
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
                Aller au contenu principal
            </a>
            <PublicHeader siteSettings={siteSettings} />
            <main id="main-content" role="main" tabIndex={-1}>{children}</main>
            <PublicFooter siteSettings={siteSettings} />
        </div>
    );
}

