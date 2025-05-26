import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ClubLayout from '@/layouts/admin/club-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, Mission } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function UpdateEvent({ missions = [], flash }: { missions?: Mission[]; flash?: FlashProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Club Mission',
            href: '/admin/club/mission',
        },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
        missions: {
            mission: string;
        }[];
    }>({
        missions: missions.length ? missions : [{ mission: '' }],
    });

    const missionsSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/club/mission');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={missions.length ? 'Edit Mission' : 'Create Mission'} />

            <ClubLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={missions.length ? 'Edit' : 'Create'}
                        description={missions.length ? 'Edit existing missions here' : 'Create new missions here'}
                    />
                    <div className="flex flex-col gap-5">
                        <div>
                            <form onSubmit={missionsSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    {data.missions.map((mission, index) => (
                                        <div key={index} className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                {/* <Label htmlFor={`mission_title_${index}`}>Title</Label> */}
                                                <div className="flex gap-2">
                                                    <Textarea
                                                        id={`mission_${index}`}
                                                        value={mission.mission}
                                                        onChange={(e) => {
                                                            const updated = [...data.missions];
                                                            updated[index] = { ...updated[index], mission: e.target.value };
                                                            setData('missions', updated);
                                                        }}
                                                        autoComplete="off"
                                                        placeholder="Mission"
                                                        maxLength={255}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const updated = [...data.missions];
                                                                updated.splice(index, 1);
                                                                setData('missions', updated.length ? updated : [{ mission: '' }]);
                                                            }}
                                                            disabled={data.missions.length === 1}
                                                        >
                                                            <Icon iconNode={Trash} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <InputError className="mt-2" message={errors.missions} />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setData('missions', [...data.missions, { mission: '' }]);
                                        }}
                                    >
                                        Add more mission
                                    </Button>
                                </div>
                                <div className="flex w-full items-center gap-4">
                                    <Button disabled={processing}>{missions.length ? 'Save' : 'Create'}</Button>
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">Saved</p>
                                    </Transition>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </ClubLayout>
        </AppLayout>
    );
}
