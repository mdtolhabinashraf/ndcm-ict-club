import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import EventLayout from '@/layouts/admin/event-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, Event } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Club Events',
        href: '/admin/event/all',
    },
];

export default function Events({ events }: { events: Event[] }) {
    const { flash } = usePage().props as FlashProps;
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleLoadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setLoading(false);
        }, 500);
    };

    const visibleEvents = events.slice(0, visibleCount);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Club Events" />

            <EventLayout className="max-w-full">
                <div className="space-y-6">
                    <HeadingSmall title="Events" description="All events in the club" />
                    <div className="flex flex-col gap-5">
                        <div>
                            <div className="overflow-hidden rounded-lg border shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="border-b">
                                            <tr className="text-left text-[11px] font-medium tracking-wider uppercase md:text-xs">
                                                <th scope="col" className="px-6 py-3">
                                                    Title
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Registration fee
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Registration end
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Start
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Location
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleEvents.map((event) => (
                                                <tr key={event.id} className="border-b text-[12px] whitespace-nowrap md:text-sm">
                                                    <td className="px-6 py-4">
                                                        {event.title.length > 22 ? `${event.title.slice(0, 20)}...` : event.title}
                                                    </td>
                                                    <td className="px-6 py-4">{event.registration_fee === 0 ? 'Free' : event.registration_fee}</td>
                                                    <td className="px-6 py-4">{event.registration_end}</td>
                                                    <td className="px-6 py-4">{event.start}</td>
                                                    <td className="px-6 py-4">
                                                        {event.location.length > 20 ? `${event.location.slice(0, 20)}...` : event.location}
                                                    </td>
                                                    <td className="px-6 py-4">{event.status}</td>
                                                    <td className="flex gap-2 px-6 py-4">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                window.location.href = `/admin/event/edit/${event.id}`;
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={async () => {
                                                                if (confirm('Are you sure you want to delete this event?')) {
                                                                    await axios
                                                                        .delete(`/admin/event/delete/${event.id}`)
                                                                        .then(() => {
                                                                            window.location.href = '/admin/event/all';
                                                                        })
                                                                        .catch(() => {
                                                                            window.location.reload();
                                                                        });
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {visibleCount < events.length && (
                                <div className="my-4 flex justify-center">
                                    <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                                        {loading ? 'Loading...' : 'Load More'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </EventLayout>
        </AppLayout>
    );
}
