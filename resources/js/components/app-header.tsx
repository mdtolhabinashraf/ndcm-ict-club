import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import AppearanceToggleDropdown from './appearance-dropdown';

const mainNavItems: NavItem[] = [
    {
        title: 'Admission',
        href: '/club-admission',
    },
    {
        title: 'Gallery',
        href: '/gallery',
    },
    {
        title: 'Events',
        href: '/events',
        // icon: Calendar,
    },
    {
        title: 'Mission',
        href: '/mission',
    },
    {
        title: 'Achievement',
        href: '/achievement',
    },
    {
        title: 'Web Learning',
        href: '/web-learning',
    },
];

const activeItemStyles = '';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const page = usePage<SharedData>();
    return (
        <div className="bg-background/50 sticky top-0 z-50 h-full w-full backdrop-blur-xl">
            <div className="border-sidebar-border/80 flex flex-col items-center justify-center border-b">
                <div className="flex w-full max-w-7xl items-center justify-between px-8 py-1 lg:py-2">
                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="size-10 fill-current" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between pb-4">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div>
                                            {auth.user ? (
                                                <Button
                                                    variant="focus"
                                                    onClick={() => {
                                                        window.open('/admin/dashboard', '_self');
                                                    }}
                                                    size="icon"
                                                    className="h-9 w-full rounded-full px-14"
                                                >
                                                    Dashboard
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="focus"
                                                    onClick={() => {
                                                        window.open('/login', '_self');
                                                    }}
                                                    size="icon"
                                                    className="h-9 w-full rounded-full px-10"
                                                >
                                                    Login
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" prefetch className="flex items-center space-x-2">
                        <div className="flex aspect-square items-center justify-center rounded-md">
                            <AppLogoIcon className="size-10 fill-current md:size-12" />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden items-center space-x-6 md:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url.startsWith(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <div className="hidden lg:flex">
                                {auth.user ? (
                                    <Button
                                        variant="focus"
                                        onClick={() => {
                                            window.open('/admin/dashboard', '_self');
                                        }}
                                        size="icon"
                                        className="h-9 rounded-full px-14"
                                    >
                                        Dashboard
                                    </Button>
                                ) : (
                                    <Button
                                        variant="focus"
                                        onClick={() => {
                                            window.open('/login', '_self');
                                        }}
                                        size="icon"
                                        className="h-9 rounded-full px-10"
                                    >
                                        Login
                                    </Button>
                                )}
                            </div>
                        </div>

                        <AppearanceToggleDropdown />
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </div>
    );
}
