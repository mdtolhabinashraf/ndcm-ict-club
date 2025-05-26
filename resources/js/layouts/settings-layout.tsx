import Heading from '@/components/heading';
import { type NavItem } from '@/types';
import NavLayout from './nav-layout';

const NavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/admin/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/admin/settings/password',
        icon: null,
    },
    {
        title: 'Appearance',
        href: '/admin/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({
    heading = <Heading title="Settings" description="Manage your profile and account settings" />,
    children,
    sidebarNavItems = NavItems,
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
