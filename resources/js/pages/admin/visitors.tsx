import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, type Visitor } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UAParser } from 'ua-parser-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'visitors',
        href: '/admin/visitors',
    },
];

export default function Visitor({ visitors, currentUserIp }: { visitors?: Visitor[]; currentUserIp?: string }) {
    const { flash, auth } = usePage().props as FlashProps & { auth?: { user?: { id?: number } } };
    const currentUserId = auth?.user?.id;

    // Group visitors by IP and count visits
    const ipVisitMap = (visitors ?? []).reduce<Record<string, { count: number; visitor: Visitor }>>((acc, visitor) => {
        const ip = visitor.ip_address ?? 'N/A';
        if (!acc[ip]) {
            acc[ip] = { count: 1, visitor };
        } else {
            acc[ip].count += 1;
            // Optionally, keep the most recent visitor info
            if ((visitor.last_activity ?? 0) > (acc[ip].visitor.last_activity ?? 0)) {
                acc[ip].visitor = visitor;
            }
        }
        return acc;
    }, {});

    const groupedVisitors = Object.values(ipVisitMap).sort((a, b) => (b.visitor.last_activity ?? 0) - (a.visitor.last_activity ?? 0));

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Visitors" />
            <div className="space-y-6 p-4 sm:px-14 sm:py-7">
                <HeadingSmall title="Visitors" description="All website visitors are listed here" />
                <div className="flex flex-col gap-5">
                    <div>
                        <div className="overflow-hidden rounded-lg border shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="border-b">
                                        <tr className="text-left text-[11px] font-medium tracking-wider uppercase md:text-xs">
                                            <th scope="col" className="px-6 py-3">
                                                User ID
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                IP Address
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                User Agent
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Last Activity
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedVisitors.map(({ visitor, count }) => (
                                            <tr key={visitor.ip_address} className="border-b text-[12px] whitespace-nowrap md:text-sm">
                                                <td className="px-6 py-4">
                                                    {visitor.user_id ?? 'N/A'}
                                                    {visitor.ip_address && visitor.ip_address === currentUserIp && (
                                                        <span className="text-focus ml-2 text-xs font-bold">(current)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {visitor.ip_address ?? 'N/A'}
                                                    {count > 1 && <span className="text-muted-foreground ml-2 text-xs">({count} visits)</span>}
                                                </td>
                                                <td className="max-w-xs truncate px-6 py-4" title={visitor.user_agent ?? ''}>
                                                    {visitor.user_agent
                                                        ? (() => {
                                                              try {
                                                                  const parser = new UAParser(visitor.user_agent);
                                                                  const device = parser.getDevice() || {};
                                                                  const os = parser.getOS() || {};
                                                                  const browser = parser.getBrowser() || {};
                                                                  // Prefer device model, else show OS name and browser as fallback
                                                                  if (device.model) {
                                                                      return `${device.vendor ? device.vendor + ' ' : ''}${device.model} (${os.name ?? 'Unknown OS'}, ${browser.name ?? 'Unknown Browser'}${browser.version ? ' ' + browser.version : ''})`;
                                                                  } else if (os.name || browser.name) {
                                                                      return `${os.name ?? 'Unknown OS'}, ${browser.name ?? 'Unknown Browser'}${browser.version ? ' ' + browser.version : ''}`;
                                                                  }
                                                                  return 'Unknown Device';
                                                              } catch (e) {
                                                                  return 'Invalid User Agent';
                                                              }
                                                          })()
                                                        : 'N/A'}
                                                </td>
                                                <td
                                                    className={
                                                        visitor.last_activity && Date.now() - new Date(visitor.last_activity * 1000).getTime() < 10000
                                                            ? 'text-focus px-6 py-4'
                                                            : 'px-6 py-4'
                                                    }
                                                >
                                                    {visitor.last_activity ? new Date(visitor.last_activity * 1000).toLocaleString('en-US') : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
