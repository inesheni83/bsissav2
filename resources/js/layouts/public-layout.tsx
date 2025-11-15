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
            <PublicHeader siteSettings={siteSettings} />
            <main>{children}</main>
            <PublicFooter siteSettings={siteSettings} />
        </div>
    );
}

