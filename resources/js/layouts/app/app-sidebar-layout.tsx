import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState, type PropsWithChildren } from 'react';

export interface FlashProps {
    message?: string;
    [key: string]: any;
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    flash,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; flash?: FlashProps }>) {
    const [showMessage, setShowMessage] = useState(!!flash?.message);

    useEffect(() => {
        if (flash?.message) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.message]);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {showMessage && flash?.message && (
                    <div className="bg-focus/15 flex w-full items-center justify-center px-4 py-1 sm:px-8">
                        <p className="text-focus text-sm">{flash.message}</p>
                    </div>
                )}

                {children}
            </AppContent>
        </AppShell>
    );
}
