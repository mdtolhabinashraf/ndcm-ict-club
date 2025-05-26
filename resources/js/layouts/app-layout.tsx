import AppLayoutTemplate, { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    flash?: FlashProps;
}

export default ({ children, breadcrumbs, flash, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} flash={flash} {...props}>
        {children}
    </AppLayoutTemplate>
);
