import { Button } from '@/components/ui/button';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Event } from '@/types';
import { Head } from '@inertiajs/react';

export default function Events({ events }: { events: Event[] }) {
    return (
        <>
            <AppHeaderLayout className="gap-20 p-4 sm:p-8">
                <Head title="Events" />
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Events</h2>
                            <p className="font-bangla text-primary/80 text-center text-lg sm:text-xl">Exciting events coming soon!</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-5">
                        {events && events.length > 0 ? (
                            events
                                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                                .map((event, idx) => (
                                    <div
                                        key={event.id}
                                        className="relative flex w-full flex-col items-center justify-between gap-2 rounded-lg border p-8 shadow-lg sm:h-full sm:min-h-[394px] sm:w-[394px]"
                                        data-aos="zoom-in-right"
                                        data-aos-delay={`${idx * 100}`}
                                    >
                                        <img
                                            src={typeof event.image === 'string' ? event.image : 'images/save_time.webp'}
                                            className="h-[170px] w-full rounded-lg object-contain"
                                            alt={event.title}
                                        />

                                        <div>
                                            <h2 className="w-full text-center text-xl font-bold">{event.title}</h2>
                                            <p className="text-primary/80 w-full text-center text-sm font-medium">
                                                {new Date(event.start).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                                {' | '}
                                                {event.location ? event.location : 'N/A'}
                                            </p>
                                        </div>
                                        <p className="text-primary/80 text-center text-sm font-medium">
                                            <span className="font-bold">
                                                {event.registration_end
                                                    ? new Date(event.registration_end) < new Date()
                                                        ? 'Registration Closed'
                                                        : 'Registration ends on ' +
                                                          new Date(event.registration_end).toLocaleDateString('en-US', {
                                                              year: 'numeric',
                                                              month: 'long',
                                                              day: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                          })
                                                    : 'N/A'}
                                            </span>
                                        </p>

                                        {event.start && new Date(event.start) < new Date() && event.end && new Date(event.end) > new Date() ? (
                                            <p className="text-primary/80 flex flex-col items-center text-center text-sm font-medium">
                                                <span className="text-focus font-bold">Event is ongoing</span>
                                                <span className="bg-focus/80 absolute top-5 right-5 h-5 w-5 animate-pulse rounded-full border-4"></span>
                                                {event.end ? (
                                                    <span>
                                                        Ends on{' '}
                                                        <span className="font-bold">
                                                            {new Date(event.end).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </span>
                                                ) : null}
                                            </p>
                                        ) : null}

                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    window.open(`/events/${event.id}`, '_self');
                                                }}
                                            >
                                                Learn more
                                            </Button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-primary/80 text-center text-lg font-medium">No events available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>
            </AppHeaderLayout>
        </>
    );
}
