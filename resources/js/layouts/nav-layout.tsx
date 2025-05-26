import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

export default function NavLayout({
    heading = null,
    children,
    sidebarNavItems,
    className,
}: {
    heading?: React.ReactNode;
    children: React.ReactNode;
    sidebarNavItems: NavItem[];
    className?: string;
}) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            {heading}

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl border-b pb-8 lg:w-48 lg:border-r lg:border-b-0 lg:pr-4 lg:pb-0">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                {/* <Separator className="my-6 lg:hidden" /> */}

                <section className={cn('max-w-2xl flex-1', className)}>{children}</section>
            </div>
        </div>
    );
}
