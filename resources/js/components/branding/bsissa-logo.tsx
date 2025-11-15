import { cn } from '@/lib/utils';

type BsissaLogoProps = {
    variant?: 'full' | 'icon';
    className?: string;
};

/**
 * Brand mark for Bsissa Zed Moulouk.
 * The full variant combines an emblem with wordmark; icon variant returns only the emblem.
 */
export function BsissaLogo({ variant = 'full', className }: BsissaLogoProps) {
    const emblem = (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('drop-shadow-sm', className)}
        >
            <defs>
                <linearGradient id="bsissa-emblem-gradient" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B" />
                    <stop offset="0.5" stopColor="#F97316" />
                    <stop offset="1" stopColor="#16A34A" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="36" height="36" rx="18" fill="url(#bsissa-emblem-gradient)" />
            <path
                d="M18.25 11.5c-2.739 0-4.75 1.99-4.75 4.611 0 2.2 1.421 3.486 3.063 4.352l.002.001c1.4.735 2.485 1.258 2.485 2.409 0 1.127-.987 1.865-2.23 1.865-1.384 0-2.445-.623-3.087-1.83a1 1 0 0 0-1.747.964c.912 1.651 2.62 2.73 4.834 2.73 2.773 0 4.75-1.733 4.75-4.233 0-2.21-1.65-3.222-3.257-4.06l-.154-.08c-1.444-.754-2.14-1.21-2.14-2.383 0-.997.838-1.611 2.231-1.611 1.268 0 2.193.523 2.76 1.548a1 1 0 1 0 1.755-.95c-.785-1.451-2.3-2.333-4.17-2.333Zm8.593.028a1 1 0 0 0-.948.684l-5.092 15.287a1 1 0 0 0 1.922.64l5.092-15.287a1 1 0 0 0-.974-1.324Zm.907 5.972c-.552 0-1 .448-1 1s.448 1 1 1h1.8c.596 0 1.143.223 1.548.627.414.413.652.983.652 1.636 0 .651-.238 1.213-.652 1.626-.405.404-.952.627-1.548.627h-1.607c-.552 0-1 .448-1 1s.448 1 1 1h1.607c1.088 0 2.075-.41 2.824-1.158.749-.74 1.176-1.77 1.176-2.94 0-1.172-.427-2.202-1.176-2.942-.749-.748-1.736-1.158-2.824-1.158h-1.8Z"
                fill="#F9FAFB"
            />
        </svg>
    );

    if (variant === 'icon') {
        return emblem;
    }

    return (
        <div className={cn('flex items-center gap-3 text-white', className)}>
            {emblem}
            <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold uppercase tracking-[0.18em] text-emerald-100">Bsissa</span>
                <span className="text-xl font-black tracking-tight text-white">Zed Moulouk</span>
            </div>
        </div>
    );
}

