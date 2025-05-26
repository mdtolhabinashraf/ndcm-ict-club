import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, Database, Edit, Globe, HelpCircle, Image, MessageCircle, UserPlus } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/admin/dashboard',
    //     icon: LayoutGrid,
    // },
    {
        title: 'Club Details',
        href: '/admin/club',
        icon: Edit,
    },
    {
        title: 'Contact Messages',
        href: '/admin/contact-messages',
        icon: MessageCircle,
    },
    {
        title: 'Gallery',
        href: '/admin/gallery',
        icon: Image,
    },
    {
        title: 'Events',
        href: '/admin/event',
        icon: Calendar,
    },
    {
        title: 'Web Learning',
        href: '/admin/web-learning',
        icon: Globe,
    },
    {
        title: 'FAQs',
        href: '/admin/faqs',
        icon: HelpCircle,
    },
    {
        title: 'Visitors',
        href: '/admin/visitors',
        icon: UserPlus,
    },
    {
        title: 'Backup',
        href: '/admin/backup',
        icon: Database,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Admin Registration',
        href: '/register',
        icon: UserPlus,
    },
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
