import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TabsContextValue = {
    value: string;
    setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

type TabsProps = {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
    className?: string;
};

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const currentValue = value ?? internalValue;

    useEffect(() => {
        if (defaultValue !== undefined) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue]);

    const context = useMemo<TabsContextValue>(
        () => ({
            value: currentValue,
            setValue: (next) => {
                if (value === undefined) {
                    setInternalValue(next);
                }
                onValueChange?.(next);
            },
        }),
        [currentValue, value, onValueChange],
    );

    return (
        <TabsContext.Provider value={context}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('inline-flex items-center justify-center gap-2', className)}>{children}</div>;
}

type TabsTriggerProps = {
    value: string;
    children: ReactNode;
    className?: string;
};

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const context = useTabsContext();
    const isActive = context.value === value;

    return (
        <button
            type="button"
            onClick={() => context.setValue(value)}
            className={cn(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200',
                isActive
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'bg-transparent text-emerald-500 hover:bg-white/70 hover:text-emerald-700',
                className,
            )}
        >
            {children}
        </button>
    );
}

type TabsContentProps = {
    value: string;
    children: ReactNode;
    className?: string;
};

export function TabsContent({ value, children, className }: TabsContentProps) {
    const context = useTabsContext();
    if (context.value !== value) {
        return null;
    }
    return <div className={className}>{children}</div>;
}

function useTabsContext(): TabsContextValue {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within <Tabs>');
    }
    return context;
}
