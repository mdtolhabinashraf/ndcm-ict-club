import { WebLearning, type NavItem } from '@/types';
import { useEffect, useState } from 'react';
import NavLayout from './../nav-layout';

export const SidebarWebLearningItems: NavItem[] = [
    {
        title: 'Create',
        href: '/admin/web-learning/create',
        icon: null,
    },
];

export default function WebLearningLayout({
    heading = null,
    children,
    sidebarNavItems = SidebarWebLearningItems,
    className,
}: {
    heading?: React.ReactNode;
    children: React.ReactNode;
    sidebarNavItems?: NavItem[];
    className?: string;
}) {
    const [webLearnings, setWebLearnings] = useState<WebLearning[] | null>(null);

    useEffect(() => {
        // Fetch web learnings every time the component mounts (i.e., on every reload) using axios
        import('axios').then(({ default: axios }) => {
            axios
                .get('/storage/web_learnings.json', { headers: { 'Cache-Control': 'no-store' } })
                .then((res) => setWebLearnings(res.data))
                .catch(() => console.error('Error fetching json'))
                .finally(() => setLoading(false));
        });
    }, []);

    const [loading, setLoading] = useState(true);
    if (loading) {
        return null;
    }

    const navItems = [
        ...sidebarNavItems,
        ...(webLearnings && webLearnings.length > 0
            ? webLearnings
                  .slice()
                  .sort((a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime())
                  .map((item) => ({
                      title: item.title.length > 10 ? item.title.slice(0, 10) + '...' : item.title,
                      href: `/admin/web-learning/edit/${item.id}`,
                      icon: null,
                  }))
            : []),
    ];

    return (
        <NavLayout heading={heading} sidebarNavItems={navItems} className={className}>
            {children}
        </NavLayout>
    );
}
