import { Button } from '@/components/ui/button';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Mission } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function mission() {
    const [missions, setMissions] = useState<Mission[] | null>(null);

    useEffect(() => {
        import('axios').then(({ default: axios }) => {
            axios
                .get('/storage/club_missions.json', { headers: { 'Cache-Control': 'no-store' } })
                .then((res) => setMissions(res.data.missions))
                .catch(() => console.error('Error fetching json'))
                .finally(() => setLoading(false));
        });
    }, []);

    const [loading, setLoading] = useState(true);
    if (loading) {
        return null;
    }
    return (
        <>
            <AppHeaderLayout className="gap-20 p-4 sm:p-8">
                <Head title="Mission" />
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="flex w-full flex-col items-center justify-between gap-5 lg:grid-cols-2 lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-center gap-5 lg:items-start">
                            <div className="flex flex-col items-center justify-center gap-2 lg:items-start">
                                <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Mission Vision</h2>
                            </div>

                            <ul className="font-bangla text-primary/80 list-decimal space-y-2 pl-5 text-justify text-sm sm:text-base">
                                {Array.isArray(missions) && missions.length > 0
                                    ? missions.map((mission, idx) => (
                                          <li key={'mission-' + idx} data-aos="fade-right" data-aos-delay={idx ? idx * 50 : undefined}>
                                              {mission.mission}
                                          </li>
                                      ))
                                    : null}
                            </ul>
                            <div hidden className="flex gap-2">
                                <Button
                                    variant="focus"
                                    onClick={() => {
                                        window.open('/join', '_self');
                                    }}
                                    className="text-md h-11 px-6"
                                >
                                    Join
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        window.open('#contact-us', '_self');
                                    }}
                                    className="text-md h-11 px-6"
                                >
                                    Contact us
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </AppHeaderLayout>
        </>
    );
}
