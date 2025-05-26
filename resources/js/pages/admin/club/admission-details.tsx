import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ClubLayout from '@/layouts/admin/club-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { type AdmissionDetails, BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function AdmissionDetails({ admissionDetails = undefined, flash }: { admissionDetails?: AdmissionDetails; flash?: FlashProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Club Admission Details',
            href: '/admin/club/admission-details',
        },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<AdmissionDetails>>({
        admission_rules: [
            {
                admission_rule: '',
            },
        ],
        admission_fee: 0,
        ...admissionDetails,
    });

    const admissionDetailsSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/club/admission-details');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={admissionDetails ? 'Edit admission details' : 'Create admission details'} />

            <ClubLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={admissionDetails ? 'Edit' : 'Create'}
                        description={admissionDetails ? 'Edit existing admission details here' : 'Create new admission details here'}
                    />
                    <div className="flex flex-col gap-5">
                        <div>
                            <form onSubmit={admissionDetailsSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="admission_fee">Admission Fee</Label>

                                        <Input
                                            id="admission_fee"
                                            className="mt-1 block w-full"
                                            value={data.admission_fee}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numeric values (including empty string)
                                                if (/^\d*$/.test(value)) {
                                                    setData('admission_fee', value === '' ? 0 : Number(value));
                                                }
                                            }}
                                            autoComplete="off"
                                            placeholder="Admission Fee"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                        />

                                        <InputError className="mt-2" message={errors.admission_fee} />
                                    </div>

                                    <p className="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                                        Admission Rules
                                    </p>

                                    {data.admission_rules.map((admission_rule, index) => (
                                        <div key={index} className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <div className="flex gap-2">
                                                    <Textarea
                                                        id={`admission_rule_${index}`}
                                                        value={admission_rule.admission_rule}
                                                        onChange={(e) => {
                                                            const updated = [...data.admission_rules];
                                                            updated[index] = { ...updated[index], admission_rule: e.target.value };
                                                            setData('admission_rules', updated);
                                                        }}
                                                        autoComplete="off"
                                                        placeholder="Admission rule"
                                                        maxLength={255}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const updated = [...data.admission_rules];
                                                                updated.splice(index, 1);
                                                                setData('admission_rules', updated.length ? updated : [{ admission_rule: '' }]);
                                                            }}
                                                            disabled={data.admission_rules.length === 1}
                                                        >
                                                            <Icon iconNode={Trash} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <InputError className="mt-2" message={errors.admission_rules} />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setData('admission_rules', [...data.admission_rules, { admission_rule: '' }]);
                                        }}
                                    >
                                        Add more admission rule
                                    </Button>
                                </div>
                                <div className="flex w-full items-center gap-4">
                                    <Button disabled={processing}>{admissionDetails ? 'Save' : 'Create'}</Button>
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
