import { type NavItem } from '@/types';
import NavLayout from './../nav-layout';

export const SidebarEventItems: NavItem[] = [
    {
        title: 'Create',
        href: '/admin/event/create',
        icon: null,
    },
    {
        title: 'All',
        href: '/admin/event/all',
        icon: null,
    },
];

export default function EventLayout({
    heading = null,
    children,
    sidebarNavItems = SidebarEventItems,
    className,
}: {
    heading?: React.ReactNode;
    children: React.ReactNode;
    sidebarNavItems?: NavItem[];
    className?: string;
}) {
    return (
        <NavLayout heading={heading} sidebarNavItems={sidebarNavItems} className={className}>
            {children}
        </NavLayout>
    );
}
