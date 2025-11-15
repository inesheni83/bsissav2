import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes/index';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2">
            {/* Left Side - Brand & Quote Section */}
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-stone-50 via-amber-25 to-yellow-50 lg:flex">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50/80 via-amber-50/60 to-yellow-50/80" />
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-12">
                    {/* Logo & Brand */}
                    <Link
                        href={home()}
                        className="flex items-center text-xl font-bold text-stone-800 transition-colors hover:text-amber-700"
                    >
                        <div className="mr-3 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-2 shadow-lg">
                            <AppLogoIcon className="size-6 fill-white" />
                        </div>
                        <span className="bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
                            {name}
                        </span>
                    </Link>

                    {/* Center decorative element */}
                    <div className="flex items-center justify-center">
                        <div className="rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 p-8 shadow-xl">
                            <div className="rounded-full bg-gradient-to-br from-amber-200 to-yellow-200 p-6">
                                <div className="size-16 rounded-full bg-gradient-to-br from-amber-300 to-yellow-300 shadow-inner" />
                            </div>
                        </div>
                    </div>

                    {/* Quote */}
                    {quote && (
                        <div className="max-w-md">
                            <blockquote className="space-y-4">
                                <p className="text-lg font-medium leading-relaxed text-stone-700">
                                    "{quote.message}"
                                </p>
                                <footer className="flex items-center space-x-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
                                    <span className="text-sm font-medium text-stone-500">
                                        {quote.author}
                                    </span>
                                </footer>
                            </blockquote>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-25 to-amber-25 px-8 lg:px-12">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 size-40 rounded-full bg-gradient-to-br from-amber-100/30 to-yellow-100/30 blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-gradient-to-br from-stone-100/40 to-amber-100/40 blur-2xl" />
                </div>

                <div className="relative z-10 w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="mb-8 flex items-center justify-center lg:hidden"
                    >
                        <div className="mr-3 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-2 shadow-lg">
                            <AppLogoIcon className="size-8 fill-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
                            {name}
                        </span>
                    </Link>

                    {/* Form Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-3xl font-bold text-stone-900">
                            {title}
                        </h1>
                        <p className="text-stone-600 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl ring-1 ring-stone-200/50">
                        {children}
                    </div>

                    {/* Additional decorative elements */}
                    <div className="mt-8 flex justify-center space-x-2">
                        <div className="size-2 rounded-full bg-amber-300" />
                        <div className="size-2 rounded-full bg-stone-300" />
                        <div className="size-2 rounded-full bg-yellow-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}