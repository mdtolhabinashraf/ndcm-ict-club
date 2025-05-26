import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClubLayout from '@/layouts/admin/club-layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef } from 'react';

type TModerator = {
    image?: File | string | null;
    name: string;
    title: string;
    subTitle: string;
    description?: string;
    contactEmail?: string;
};

const DEFAULT_MODERATORS: Record<string, TModerator> = {
    Moderator: {
        image: '',
        name: '',
        title: 'Moderator',
        subTitle: '',
        description: '',
        contactEmail: '',
    },
    'Co Moderator': {
        image: '',
        name: '',
        title: 'Co Moderator',
        subTitle: '',
        description: '',
        contactEmail: '',
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Club Moderators',
        href: '/admin/club/moderators',
    },
];

export default function Moderators({ moderators }: { moderators?: Record<string, TModerator> }) {
    const safeModerators = {
        ...DEFAULT_MODERATORS,
        ...moderators,
    };

    // Create a useForm instance for each moderator
    const formsArray = Object.entries(safeModerators).map(([_, moderator]) => useForm({ ...moderator }));

    // Create refs for each file input
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle form changes for each moderator
    const handleChange = (index: number, field: keyof TModerator, value: string | File) => {
        formsArray[index].setData(field, value);
    };

    // New function to handle image removal
    const handleRemoveImage = (idx: number) => {
        handleChange(idx, 'image', '');
        // Reset file input value
        if (fileInputRefs.current[idx]) {
            fileInputRefs.current[idx]!.value = '';
        }
    };

    const handleSubmit = (idx: number, e: React.FormEvent) => {
        e.preventDefault();
        const form = formsArray[idx];

        form.post('/admin/club/moderators');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Club Moderators" />
            <ClubLayout className="max-w-5xl">
                <div className="space-y-6">
                    <HeadingSmall title="Moderators" description="Manage the list of club moderators" />
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col items-start justify-center gap-8 2xl:flex-row">
                            {formsArray.map((form, idx) => (
                                <form
                                    key={idx}
                                    onSubmit={(e) => handleSubmit(idx, e)}
                                    className="w-full max-w-lg space-y-6 rounded-lg border p-4 sm:p-8"
                                >
                                    <div className="grid gap-2">
                                        <HeadingSmall title={form.data.title} description={`Edit club ${form.data.title.toLowerCase()} details`} />
                                        <div className="flex w-full items-center justify-center gap-2">
                                            <Label
                                                htmlFor={`image-${idx}`}
                                                className="flex cursor-pointer flex-col items-center justify-center gap-2"
                                            >
                                                <img
                                                    className="h-[130px] w-[130px] rounded-full border object-cover"
                                                    src={
                                                        form.data.image
                                                            ? typeof form.data.image === 'string'
                                                                ? form.data.image
                                                                : URL.createObjectURL(form.data.image)
                                                            : '/images/user.webp'
                                                    }
                                                    alt={
                                                        form.data.image
                                                            ? typeof form.data.image === 'string'
                                                                ? form.data.image.split('/').pop()
                                                                : form.data.image.name
                                                            : 'user.webp'
                                                    }
                                                />
                                                {form.data.image ? (
                                                    <Button type="button" variant="outline" onClick={() => handleRemoveImage(idx)}>
                                                        Remove image
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const input = fileInputRefs.current[idx];
                                                            if (input) {
                                                                input.click();
                                                            }
                                                        }}
                                                    >
                                                        Upload image
                                                    </Button>
                                                )}
                                                <span className="text-xs text-neutral-500">Max size: 2MB</span>
                                                <InputError className="mt-2" message={form.errors.image} />
                                            </Label>
                                            <Input
                                                id={`image-${idx}`}
                                                type="file"
                                                tabIndex={5}
                                                accept="image/*"
                                                ref={(el) => {
                                                    fileInputRefs.current[idx] = el;
                                                }}
                                                onChange={(e) => {
                                                    const file = e.target.files ? e.target.files[0] : '';
                                                    if (file && file.size > 2 * 1024 * 1024) {
                                                        handleChange(idx, 'image', '');
                                                        form.setError('image', 'Image must be less than 2MB');
                                                        // Reset file input value if too large
                                                        if (fileInputRefs.current[idx]) {
                                                            fileInputRefs.current[idx]!.value = '';
                                                        }
                                                    } else {
                                                        handleChange(idx, 'image', file);
                                                        form.setError('image', '');
                                                    }
                                                }}
                                                hidden
                                            />
                                        </div>
                                        <Label htmlFor={`name-${idx}`}>Name</Label>
                                        <Input
                                            id={`name-${idx}`}
                                            className="mt-1 block w-full"
                                            value={form.data.name || ''}
                                            onChange={(e) => handleChange(idx, 'name', e.target.value)}
                                            required
                                            autoComplete="off"
                                            placeholder="Name"
                                        />
                                        <InputError className="mt-2" message={form.errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`title-${idx}`}>Title</Label>
                                        <Input
                                            id={`title-${idx}`}
                                            className="mt-1 block w-full"
                                            value={form.data.title || ''}
                                            onChange={(e) => handleChange(idx, 'title', e.target.value)}
                                            required
                                            autoComplete="off"
                                            placeholder="Title"
                                        />
                                        <InputError className="mt-2" message={form.errors.title} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`sub-title-${idx}`}>Sub Title</Label>
                                        <Input
                                            id={`sub-title-${idx}`}
                                            className="mt-1 block w-full"
                                            value={form.data.subTitle || ''}
                                            onChange={(e) => handleChange(idx, 'subTitle', e.target.value)}
                                            required
                                            autoComplete="off"
                                            placeholder="Sub Title"
                                        />
                                        <InputError className="mt-2" message={form.errors.subTitle} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`description-${idx}`}>Description</Label>
                                        <Input
                                            id={`description-${idx}`}
                                            className="mt-1 block w-full"
                                            value={form.data.description || ''}
                                            onChange={(e) => handleChange(idx, 'description', e.target.value)}
                                            autoComplete="off"
                                            placeholder="Description"
                                        />
                                        <InputError className="mt-2" message={form.errors.description} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`contact-email-${idx}`}>Contact email</Label>
                                        <Input
                                            id={`contact-email-${idx}`}
                                            type="email"
                                            className="mt-1 block w-full sm:w-100"
                                            value={form.data.contactEmail || ''}
                                            onChange={(e) => handleChange(idx, 'contactEmail', e.target.value)}
                                            autoComplete="off"
                                            placeholder="Contact email"
                                        />
                                        <InputError className="mt-2" message={form.errors.contactEmail} />
                                    </div>
                                    <div className="flex w-full items-center gap-4">
                                        <Button type="submit">Save</Button>
                                        <Transition
                                            show={form.recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </form>
                            ))}
                        </div>
                    </div>
                </div>
            </ClubLayout>
        </AppLayout>
    );
}
