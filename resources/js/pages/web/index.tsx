import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from '@/components/ui/generate-effect';
import Stack from '@/components/ui/stack';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Event } from '@/types';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type siteConfig = {
    title: string;
    slogan: string;
    history: string;
    contactEmail: string;
};

type Moderator = {
    image: string;
    name: string;
    title: string;
    subTitle: string;
    description: string;
    contactEmail: string | null;
};

type ModeratorsData = {
    [key: string]: Moderator;
};

const defaultModerators: ModeratorsData = {
    Moderator: {
        image: 'images/user.webp',
        name: 'Unknown',
        title: 'Moderator',
        subTitle: '...',
        description: '',
        contactEmail: null,
    },
    'Co Moderator': {
        image: 'images/user.webp',
        name: 'Unknown',
        title: 'Co Moderator',
        subTitle: '...',
        description: '',
        contactEmail: null,
    },
};

export default function home({ siteDetails, events }: { siteDetails: siteConfig; events: Event[] }) {
    const [featuredItems, setFeaturedItems] = useState<{ id: number; img: string }[] | null>(null);
    const [moderators, setModerators] = useState<ModeratorsData>(defaultModerators);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('axios').then(({ default: axios }) => {
            axios
                .get('/storage/club_moderators.json', { headers: { 'Cache-Control': 'no-store' } })
                .then((res) => setModerators(res.data))
                .catch(() => setModerators(defaultModerators));
        });
    }, []);

    useEffect(() => {
        import('axios').then(({ default: axios }) => {
            axios
                .get('/storage/featured_items.json', { headers: { 'Cache-Control': 'no-store' } })
                .then((res) => {
                    const itemsArray = res.data;
                    const itemsObject = Array.isArray(itemsArray)
                        ? itemsArray.map((img: string, idx: number) => ({
                              id: idx,
                              img,
                          }))
                        : [];
                    const loadedItems: { id: number; img: string }[] = [];
                    let firstLoaded = false;
                    let processed = 0;

                    itemsObject.forEach((item, idx) => {
                        const image = new window.Image();
                        image.src = item.img;
                        image.onload = () => {
                            loadedItems.push(item);
                            if (!firstLoaded) {
                                setFeaturedItems([item]);
                                setLoading(false);
                                firstLoaded = true;
                            } else {
                                setFeaturedItems((prev) => (prev ? [...prev, item] : [item]));
                            }
                            processed++;
                            if (processed === itemsObject.length && loadedItems.length === 0) {
                                setFeaturedItems(null);
                                setLoading(false);
                            }
                        };
                        image.onerror = () => {
                            processed++;
                            if (processed === itemsObject.length && loadedItems.length === 0) {
                                setFeaturedItems(null);
                                setLoading(false);
                            }
                        };
                    });

                    // If there are no items at all
                    if (itemsObject.length === 0) {
                        setFeaturedItems(null);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setFeaturedItems(null);
                    setLoading(false);
                    console.error('Error fetching json');
                });
        });
    }, []);

    const clubTitle = siteDetails.title;
    const clubSlogan = siteDetails.slogan;
    const clubHistory = siteDetails.history;

    return (
        <>
            <AppHeaderLayout className="gap-20 p-4 sm:p-8" loading={loading}>
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="flex flex-col items-center justify-between gap-5 lg:grid-cols-2 lg:flex-row">
                        {featuredItems ? (
                            <div
                                className="mb-5 lg:order-1 lg:mb-0"
                                data-aos={typeof window !== 'undefined' && window.innerWidth < 1300 ? 'zoom-in' : 'zoom-in-left'}
                            >
                                <Stack
                                    sensitivity={180}
                                    sendToBackOnClick={false}
                                    autoSendToBack={true}
                                    autoSendInterval={5000}
                                    width="w-[310px] sm:w-[420px] lg:w-[500px]"
                                    height="h-[215px] sm:h-[300px] lg:h-[350px]"
                                    cardsData={featuredItems}
                                />
                            </div>
                        ) : null}
                        <div className="flex w-full flex-col items-center justify-center gap-5 lg:items-start">
                            <div className="flex flex-col items-center justify-center gap-2 lg:items-start">
                                <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl" data-aos="fade-right" data-aos-delay="50">
                                    {clubTitle}
                                </h1>
                                <p className="font-bangla text-focus text-xl font-medium md:text-2xl" data-aos="fade-right" data-aos-delay="50">
                                    {clubSlogan}
                                </p>
                            </div>

                            <div data-aos="fade-right" data-aos-delay="50">
                                <TextGenerateEffect
                                    filter={false}
                                    words={clubHistory}
                                    delay={0.015}
                                    className="font-bangla text-primary/80 text-justify text-sm sm:text-base"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="focus"
                                    onClick={() => {
                                        window.open('/club-admission', '_self');
                                    }}
                                    className="text-md h-11 px-6"
                                    data-aos="fade-right"
                                    data-aos-delay="50"
                                >
                                    Admission
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        window.open('#contact-us', '_self');
                                    }}
                                    className="text-md h-11 px-6"
                                    data-aos="fade-right"
                                    data-aos-delay="50"
                                >
                                    Contact us
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Upcoming Events</h2>
                            <p className="font-bangla text-primary/80 text-center text-lg sm:text-xl">Exciting events coming soon!</p>
                            <div className="flex w-full justify-center sm:justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        window.open('/events', '_self');
                                    }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    View all events
                                    <Icon iconNode={ArrowRight} className="size-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-center gap-5">
                        {events && events.length > 0 ? (
                            events
                                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // Sort events by start time
                                .filter((event) => new Date(event.start) > new Date()) // Filter events that haven't started yet
                                .slice(0, 3) // Limit to 3 events
                                .map((event, idx) => (
                                    <div
                                        key={event.id}
                                        className="flex w-full flex-col items-center justify-between gap-2 rounded-lg border p-8 shadow-lg sm:h-[394px] sm:w-[394px]"
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
                                            Registration ends on{' '}
                                            <span className="font-bold">
                                                {event.registration_end
                                                    ? new Date(event.registration_end).toLocaleDateString('en-US', {
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : 'N/A'}
                                            </span>
                                        </p>
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
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Meet the Moderators</h2>
                            <p className="font-bangla text-primary/80 text-center text-lg sm:text-xl">Guiding Every Event Moment</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
                        {Object.values(moderators).map((mod, idx) => (
                            <div
                                key={mod.title}
                                className="flex flex-col items-center justify-between gap-2 rounded-lg border p-8 shadow-lg"
                                data-aos={
                                    typeof window !== 'undefined' && window.innerWidth < 500
                                        ? 'zoom-in'
                                        : idx === 0
                                          ? 'zoom-in-right'
                                          : 'zoom-in-left'
                                }
                            >
                                <img
                                    src={mod.image ?? 'images/user.webp'}
                                    className="h-[200px] w-[200px] rounded-full border object-center sm:h-[230px] sm:w-[230px]"
                                    alt={mod.name}
                                />
                                <div>
                                    <h2 className="w-full text-center text-xl font-bold">{mod.name}</h2>
                                    <p className="text-primary/80 w-full text-center text-base font-semibold">{mod.title}</p>
                                    <p className="text-primary/60 w-full text-center text-sm font-medium">{mod.subTitle}</p>
                                    <p className="text-primary/60 w-full text-center text-sm font-medium">{mod.description}</p>
                                    {mod.contactEmail && (
                                        <p className="text-primary/60 w-full text-center text-sm font-medium">
                                            <a href={`mailto:${mod.contactEmail}`}>{mod.contactEmail}</a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </AppHeaderLayout>
        </>
    );
}
