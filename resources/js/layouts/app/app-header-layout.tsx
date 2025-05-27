import { AppContent } from '@/components/app-content';
import AppFooter from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AppHeaderMessage } from '@/components/app-header-message';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({
    children,
    className,
    breadcrumbs,
    loading,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; className?: string; loading?: boolean }>) {
    const { events } = usePage().props;
    const upcomingEvent = (Array.isArray(events) ? events : []).find((event) => new Date(event.end).getTime() > Date.now());
    return (
        <AppShell>
            {upcomingEvent && (
                <AppHeaderMessage
                    message={'Upcomming ' + upcomingEvent.title}
                    startAt={new Date(upcomingEvent.start)}
                    endAt={new Date(upcomingEvent.end)}
                    title={upcomingEvent.title}
                />
            )}
            <AppHeader breadcrumbs={breadcrumbs} />
            {loading ? null : (
                <>
                    <AppContent className={className}>{children}</AppContent>
                    <AppFooter />
                </>
            )}
        </AppShell>
    );
}
