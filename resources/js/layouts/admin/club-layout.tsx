import { type NavItem } from '@/types';
import NavLayout from './../nav-layout';

export const SidebarClubItems: NavItem[] = [
    {
        title: 'Details',
        href: '/admin/club/details',
        icon: null,
    },
    {
        title: 'Moderators',
        href: '/admin/club/moderators',
        icon: null,
    },
    {
        title: 'Admission details',
        href: '/admin/club/admission-details',
        icon: null,
    },
    {
        title: 'Mission',
        href: '/admin/club/mission',
        icon: null,
    },
    {
        title: 'Achievement',
        href: '/admin/club/achievement',
        icon: null,
    },
];

export default function ClubLayout({
    heading = null,
    children,
    sidebarNavItems = SidebarClubItems,
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
