import { type NavItem } from '@/types';
import NavLayout from './../nav-layout';

export const SidebarGalleryItems: NavItem[] = [
    {
        title: 'All',
        href: '/admin/gallery/all',
        icon: null,
    },
    {
        title: 'Featured',
        href: '/admin/gallery/featured',
        icon: null,
    },
    {
        title: 'Web Gallery',
        href: '/admin/gallery/web-gallery',
        icon: null,
    },
];

export default function GalleryLayout({
    heading = null,
    children,
    sidebarNavItems = SidebarGalleryItems,
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
