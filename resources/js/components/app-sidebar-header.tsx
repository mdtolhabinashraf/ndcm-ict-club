import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const getFormattedDateTime = () => {
        const now = new Date();
        const day = now.toLocaleDateString([], { weekday: 'short' }); // e.g., Mon
        const date = now.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }); // e.g., May 18, 2025
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return { day, date, time };
    };

    const [dateTime, setDateTime] = useState(getFormattedDateTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(getFormattedDateTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                    <span className="hidden sm:inline">
                        {dateTime.day}, {dateTime.date}{' '}
                    </span>
                    {dateTime.time}
                </span>
                <Button
                    variant="focus"
                    onClick={() => {
                        window.open('/', '_blank');
                    }}
                    size="icon"
                    className="h-9 w-full rounded-lg px-8"
                >
                    Site
                </Button>
            </div>
        </header>
    );
}
