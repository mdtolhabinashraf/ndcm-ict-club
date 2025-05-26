import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SiteDetails } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import ClubLayout from '@/layouts/admin/club-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Club Details',
        href: '/admin/club/details',
    },
];
export default function ClubDetails({ siteDetails }: { siteDetails?: SiteDetails }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<SiteDetails>>({
        favicon: null,
        logo: null,
        title: '',
        slogan: '',
        history: '',
        contactEmail: '',
        ...siteDetails,
    });

    const clubDetailsSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/club/details');
    };

    const faviconInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Club Details" />

            <ClubLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Details" description="Manage club's details here" />
                    <div className="flex flex-col gap-5">
                        <div>
                            <form onSubmit={clubDetailsSubmit} className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="favicon" className="flex cursor-pointer flex-col items-start gap-2">
                                        <span>Favicon</span>
                                        <img
                                            className="w-[52px] rounded-full border"
                                            src={
                                                data.favicon
                                                    ? typeof data.favicon === 'string'
                                                        ? data.favicon
                                                        : URL.createObjectURL(data.favicon)
                                                    : '/global.svg'
                                            }
                                            alt={
                                                data.favicon
                                                    ? typeof data.favicon === 'string'
                                                        ? data.favicon.split('/').pop()
                                                        : data.favicon.name
                                                    : '/global.svg'
                                            }
                                        />
                                        {data.favicon ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setData('favicon', null);
                                                    if (faviconInputRef.current) {
                                                        faviconInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                Remove favicon
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const input = faviconInputRef.current;
                                                    if (input) {
                                                        input.click();
                                                    }
                                                }}
                                            >
                                                Upload favicon
                                            </Button>
                                        )}
                                        <span className="text-xs text-neutral-500">Max size: 2MB</span>
                                        <InputError className="mt-2" message={errors.favicon} />
                                    </Label>
                                    <Input
                                        id="favicon"
                                        type="file"
                                        tabIndex={5}
                                        accept="image/x-icon"
                                        ref={faviconInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            if (file && file.size > 2 * 1024 * 1024) {
                                                alert('favicon must be less than 2MB');
                                                e.target.value = '';
                                                setData('favicon', null);
                                            } else {
                                                setData('favicon', file);
                                            }
                                        }}
                                        hidden
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label htmlFor="logo" className="flex cursor-pointer flex-col items-start gap-2">
                                        <span>Logo</span>
                                        <img
                                            className="w-[72px] rounded-md border"
                                            src={
                                                data.logo
                                                    ? typeof data.logo === 'string'
                                                        ? data.logo
                                                        : URL.createObjectURL(data.logo)
                                                    : '/global.svg'
                                            }
                                            alt={
                                                data.logo
                                                    ? typeof data.logo === 'string'
                                                        ? data.logo.split('/').pop()
                                                        : data.logo.name
                                                    : '/global.svg'
                                            }
                                        />
                                        {data.logo ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setData('logo', null);
                                                    if (logoInputRef.current) {
                                                        logoInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                Remove logo
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const input = logoInputRef.current;
                                                    if (input) {
                                                        input.click();
                                                    }
                                                }}
                                            >
                                                Upload image
                                            </Button>
                                        )}
                                        <span className="text-xs text-neutral-500">Max size: 2MB</span>
                                        <InputError className="mt-2" message={errors.logo} />
                                    </Label>
                                    <Input
                                        id="logo"
                                        type="file"
                                        tabIndex={5}
                                        accept="image/png"
                                        ref={logoInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            if (file && file.size > 2 * 1024 * 1024) {
                                                alert('Image must be less than 2MB');
                                                e.target.value = '';
                                                setData('logo', null);
                                            } else {
                                                setData('logo', file);
                                            }
                                        }}
                                        hidden
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>

                                    <Input
                                        id="title"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Title"
                                    />

                                    <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slogan">Slogan</Label>

                                    <Input
                                        id="slogan"
                                        className="mt-1 block w-full"
                                        value={data.slogan}
                                        onChange={(e) => setData('slogan', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Slogan"
                                    />

                                    <InputError className="mt-2" message={errors.slogan} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="history">History</Label>

                                    <Textarea
                                        id="history"
                                        className="mt-1 block min-h-50 w-full"
                                        value={data.history}
                                        onChange={(e) => setData('history', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="History"
                                    />

                                    <InputError className="mt-2" message={errors.history} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contactEmail">Contact email</Label>

                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        className="mt-1 block w-full sm:w-100"
                                        value={data.contactEmail}
                                        onChange={(e) => setData('contactEmail', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Contact email"
                                    />

                                    <InputError className="mt-2" message={errors.contactEmail} />
                                </div>

                                <div className="flex w-full items-center gap-4">
                                    <Button disabled={processing}>Save</Button>
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
