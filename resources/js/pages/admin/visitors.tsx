import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, type Visitor } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'visitors',
        href: '/admin/visitors',
    },
];

type IpGeo = {
    city?: string;
    country?: string;
    zip?: string;
};

export default function Visitor({
    visitors,
    currentUserIp,
    currentUserAgent,
}: {
    visitors?: Visitor[];
    currentUserIp?: string;
    currentUserAgent?: string;
}) {
    const { flash, auth } = usePage().props as FlashProps & { auth?: { user?: { id?: number } } };
    // State to store geolocation info for each IP
    const [ipGeoMap, setIpGeoMap] = useState<Record<string, IpGeo>>({});

    // Group visitors by IP, user_id, and user_agent and count visits
    const ipUserAgentVisitMap = (visitors ?? []).reduce<Record<string, { count: number; visitor: Visitor }>>((acc, visitor) => {
        const ip = visitor.ip_address ?? 'N/A';
        const userId = visitor.user_id ?? null;
        const userAgent = visitor.user_agent ?? 'N/A';
        const key = `${ip}_${userId}_${userAgent}`;
        if (!acc[key]) {
            acc[key] = { count: 1, visitor };
        } else {
            acc[key].count += 1;
            // Optionally, keep the most recent visitor info
            if ((visitor.last_activity ?? 0) > (acc[key].visitor.last_activity ?? 0)) {
                acc[key].visitor = visitor;
            }
        }
        return acc;
    }, {});

    const groupedVisitors = Object.values(ipUserAgentVisitMap).sort((a, b) => {
        const aCountry = ipGeoMap[a.visitor.ip_address ?? '']?.country;
        const bCountry = ipGeoMap[b.visitor.ip_address ?? '']?.country;

        // Put BD at the top
        if (aCountry === 'BD' && bCountry !== 'BD') return -1;
        if (aCountry !== 'BD' && bCountry === 'BD') return 1;

        // Otherwise, sort by last_activity (within BD or within non-BD)
        return (b.visitor.last_activity ?? 0) - (a.visitor.last_activity ?? 0);
    });

    useEffect(() => {
        const uniqueIps = Array.from(new Set((visitors ?? []).map((v) => v.ip_address).filter(Boolean)));
        uniqueIps.forEach((ip) => {
            if (!ipGeoMap[ip!]) {
                fetch(`https://ipinfo.io/${ip}/json?token=64b2f1af02ef50`)
                    .then((res) => res.json())
                    .then((data) => {
                        setIpGeoMap((prev) => ({
                            ...prev,
                            [ip!]: {
                                city: data.city,
                                country: data.country,
                                zip: data.postal,
                            },
                        }));
                    })
                    .catch(() => {
                        setIpGeoMap((prev) => ({
                            ...prev,
                            [ip!]: { city: '', country: '', zip: '' },
                        }));
                    });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visitors]);

    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setLoading(false);
        }, 500); // Simulate loading, adjust as needed
    };

    const visibleVisitors = groupedVisitors.slice(0, visibleCount);

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
                                                Location
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
                                        {visibleVisitors.map(({ visitor, count }) => (
                                            <tr
                                                key={`${visitor.ip_address ?? 'N/A'}_${visitor.user_id ?? 'N/A'}_${visitor.user_agent ?? 'N/A'}`}
                                                className="border-b text-[12px] whitespace-nowrap md:text-sm"
                                            >
                                                <td className="px-6 py-4">
                                                    {visitor.user_id ?? 'N/A'}
                                                    {visitor.ip_address &&
                                                        visitor.ip_address === currentUserIp &&
                                                        visitor.user_agent === currentUserAgent && (
                                                            <span className="text-focus ml-2 text-xs font-bold">(current)</span>
                                                        )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {visitor.ip_address ?? 'N/A'}
                                                    {count > 1 && <span className="text-muted-foreground ml-2 text-xs">({count} visits)</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {visitor.ip_address && ipGeoMap[visitor.ip_address]
                                                        ? ipGeoMap[visitor.ip_address].city &&
                                                          ipGeoMap[visitor.ip_address].zip &&
                                                          ipGeoMap[visitor.ip_address].country
                                                            ? `${ipGeoMap[visitor.ip_address].city}-${ipGeoMap[visitor.ip_address].zip}, ${ipGeoMap[visitor.ip_address].country}`
                                                            : ipGeoMap[visitor.ip_address].city && ipGeoMap[visitor.ip_address].country
                                                              ? `${ipGeoMap[visitor.ip_address].city}, ${ipGeoMap[visitor.ip_address].country}`
                                                              : ipGeoMap[visitor.ip_address].country || 'N/A'
                                                        : 'Loading...'}
                                                </td>
                                                <td className="max-w-xs cursor-default truncate px-6 py-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span>
                                                                {visitor.user_agent
                                                                    ? (() => {
                                                                          try {
                                                                              const parser = new UAParser(visitor.user_agent);
                                                                              const device = parser.getDevice() || {};
                                                                              const os = parser.getOS() || {};
                                                                              const browser = parser.getBrowser() || {};
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
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{visitor.user_agent ?? 'N/A'}</TooltipContent>
                                                    </Tooltip>
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
                    {visibleCount < groupedVisitors.length && (
                        <div className="my-4 flex justify-center">
                            <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                                {loading ? 'Loading...' : 'Load More'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
