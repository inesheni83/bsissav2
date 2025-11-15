import { BsissaLogo } from '@/components/branding/bsissa-logo';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 shadow-sm ring-1 ring-white/70">
                <BsissaLogo variant="icon" className="size-9" />
            </div>
            <div className="ml-2 hidden flex-1 text-left text-sm font-semibold text-emerald-900 sm:grid">
                <span className="truncate leading-tight">Bsissa Zed Moulouk</span>
                <span className="text-xs font-normal text-emerald-600">Console vendeur</span>
            </div>
        </>
    );
}
