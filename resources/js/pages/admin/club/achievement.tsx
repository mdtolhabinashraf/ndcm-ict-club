import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ClubLayout from '@/layouts/admin/club-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { Achievement, BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function UpdateEvent({ achievements = [], flash }: { achievements?: Achievement[]; flash?: FlashProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Club Achievement',
            href: '/admin/club/achievement',
        },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{ achievements: { achievement: string }[] }>({
        achievements: achievements.length ? achievements.map((a) => ({ achievement: a.achievement })) : [{ achievement: '' }],
    });

    const achievementsSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/club/achievement');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={achievements.length ? 'Edit achievement' : 'Create achievement'} />

            <ClubLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={achievements.length ? 'Edit' : 'Create'}
                        description={achievements.length ? 'Edit existing achievements here' : 'Create new achievements here'}
                    />
                    <div className="flex flex-col gap-5">
                        <div>
                            <form onSubmit={achievementsSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    {data.achievements.map((achievement, index) => (
                                        <div key={index} className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                {/* <Label htmlFor={`achievement_title_${index}`}>Title</Label> */}
                                                <div className="flex gap-2">
                                                    <Textarea
                                                        id={`achievement_${index}`}
                                                        value={achievement.achievement}
                                                        onChange={(e) => {
                                                            const updated = [...data.achievements];
                                                            updated[index] = { ...updated[index], achievement: e.target.value };
                                                            setData('achievements', updated);
                                                        }}
                                                        autoComplete="off"
                                                        placeholder="Achievement"
                                                        maxLength={255}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const updated = [...data.achievements];
                                                                updated.splice(index, 1);
                                                                setData('achievements', updated.length ? updated : [{ achievement: '' }]);
                                                            }}
                                                            disabled={data.achievements.length === 1}
                                                        >
                                                            <Icon iconNode={Trash} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <InputError className="mt-2" message={errors.achievements} />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setData('achievements', [...data.achievements, { achievement: '' }]);
                                        }}
                                    >
                                        Add more achievement
                                    </Button>
                                </div>
                                <div className="flex w-full items-center gap-4">
                                    <Button disabled={processing}>{achievements.length ? 'Save' : 'Create'}</Button>
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
