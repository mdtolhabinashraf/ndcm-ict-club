import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import EventLayout, { SidebarEventItems } from '@/layouts/admin/event-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, Event } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

export default function UpdateEvent({ currentEvent, flash }: { currentEvent?: Partial<Event>; flash?: FlashProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: currentEvent ? 'Edit Event' : 'Create Event',
            href: currentEvent ? `/admin/event/edit/${currentEvent?.id ?? ''}` : '/admin/event/create',
        },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<Event>>({
        id: null,
        title: '',
        description: '',
        image: null,
        terms_condition: null,
        // folder_path: null,
        location: '',
        registration_fee: 0,
        registration_for: '',
        registration_start: null,
        registration_end: null,
        start: '',
        end: null,
        contact_details: [
            {
                name: '',
                title: '',
                country_code: '+880',
                phone: '',
            },
        ],
        status: 'Hidden',
        ...currentEvent,
    });

    // Add refs for both file inputs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const termsInputRef = useRef<HTMLInputElement>(null);

    const eventSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/event/update');
    };

    const navItems = [
        ...SidebarEventItems,
        currentEvent && currentEvent.title
            ? {
                  title: currentEvent.title.length > 10 ? currentEvent.title.slice(0, 10) + '...' : currentEvent.title,
                  href: `/admin/event/edit/${currentEvent.id}`,
                  icon: null,
              }
            : null,
    ].filter((item): item is NonNullable<typeof item> => item !== null);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={currentEvent ? 'Edit Event' : 'Create Event'} />

            <EventLayout sidebarNavItems={navItems} className="max-w-4xl">
                <div className="space-y-6">
                    <HeadingSmall
                        title={currentEvent ? 'Edit' : 'Create'}
                        description={currentEvent ? 'Edit existing event here' : 'Create new event here'}
                    />
                    <div className="flex flex-col gap-5">
                        <div>
                            <form onSubmit={eventSubmit} className="space-y-6">
                                <div className="flex w-full items-center justify-center gap-2">
                                    <Label htmlFor="image" className="flex w-full cursor-pointer flex-col items-start gap-2">
                                        <img
                                            className="max-h-[320px] rounded-md border"
                                            src={
                                                data.image
                                                    ? typeof data.image === 'string'
                                                        ? data.image
                                                        : URL.createObjectURL(data.image)
                                                    : '/images/save_time.webp'
                                            }
                                            alt={
                                                data.image
                                                    ? typeof data.image === 'string'
                                                        ? data.image.split('/').pop()
                                                        : data.image.name
                                                    : 'default-image'
                                            }
                                        />
                                        {data.image ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setData('image', null);
                                                    if (imageInputRef.current) {
                                                        imageInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                Remove image
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const input = imageInputRef.current;
                                                    if (input) {
                                                        input.click();
                                                    }
                                                }}
                                            >
                                                Upload image
                                            </Button>
                                        )}
                                        <span className="text-xs text-neutral-500">Max size: 2MB</span>
                                        <InputError className="mt-2" message={errors.image} />
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        tabIndex={5}
                                        accept="image/*"
                                        ref={imageInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            if (file && file.size > 2 * 1024 * 1024) {
                                                alert('Image must be less than 2MB');
                                                e.target.value = '';
                                                setData('image', null);
                                            } else {
                                                setData('image', file);
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
                                        autoComplete="title"
                                        placeholder="Title"
                                        maxLength={255}
                                    />
                                    <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        className="mt-1 block min-h-50 w-full"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        autoComplete="off"
                                        placeholder="Description"
                                        maxLength={1000}
                                    />
                                    <InputError className="mt-2" message={errors.description} />
                                </div>

                                <div className="flex w-full items-center justify-center gap-2">
                                    <Label htmlFor="terms_condition" className="flex w-full cursor-pointer flex-col items-start gap-2">
                                        <img
                                            className="max-h-[320px] rounded-md border"
                                            src={
                                                data.terms_condition
                                                    ? typeof data.terms_condition === 'string'
                                                        ? data.terms_condition
                                                        : URL.createObjectURL(data.terms_condition)
                                                    : '/images/save_time.webp'
                                            }
                                            alt={
                                                data.terms_condition
                                                    ? typeof data.terms_condition === 'string'
                                                        ? data.terms_condition.split('/').pop()
                                                        : data.terms_condition.name
                                                    : 'default-image'
                                            }
                                        />
                                        {data.terms_condition ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setData('terms_condition', null);
                                                    if (termsInputRef.current) {
                                                        termsInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                Remove image
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const input = termsInputRef.current;
                                                    if (input) {
                                                        input.click();
                                                    }
                                                }}
                                            >
                                                Upload image
                                            </Button>
                                        )}
                                        <span className="text-xs text-neutral-500">Max size: 2MB</span>
                                        <InputError className="mt-2" message={errors.terms_condition} />
                                    </Label>
                                    <Input
                                        id="terms_condition"
                                        type="file"
                                        tabIndex={5}
                                        accept="image/*"
                                        ref={termsInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            if (file && file.size > 2 * 1024 * 1024) {
                                                alert('Image must be less than 2MB');
                                                e.target.value = '';
                                                setData('terms_condition', null);
                                            } else {
                                                setData('terms_condition', file);
                                            }
                                        }}
                                        hidden
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        className="mt-1 block w-full"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Location"
                                        maxLength={255}
                                    />
                                    <InputError className="mt-2" message={errors.location} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="registration_fee">Registration Fee</Label>
                                    <Input
                                        id="registration_fee"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.registration_fee}
                                        onChange={(e) => setData('registration_fee', Math.max(0, Number(e.target.value)))}
                                        required
                                        min={0}
                                        placeholder="Registration Fee"
                                    />
                                    <InputError className="mt-2" message={errors.registration_fee} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="registration_for">Registration For</Label>
                                    <Input
                                        id="registration_for"
                                        className="mt-1 block w-full"
                                        value={data.registration_for}
                                        onChange={(e) => setData('registration_for', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Registration For"
                                        maxLength={255}
                                    />
                                    <InputError className="mt-2" message={errors.registration_for} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="registration_start">Registration Start</Label>
                                    <Input
                                        id="registration_start"
                                        type="datetime-local"
                                        className="mt-1 block w-full"
                                        value={data.registration_start ?? ''}
                                        onChange={(e) => setData('registration_start', e.target.value)}
                                        max={data.registration_end ?? undefined}
                                    />
                                    <InputError className="mt-2" message={errors.registration_start} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="registration_end">Registration End</Label>
                                    <Input
                                        id="registration_end"
                                        type="datetime-local"
                                        className="mt-1 block w-full"
                                        value={data.registration_end ?? ''}
                                        onChange={(e) => setData('registration_end', e.target.value)}
                                        min={data.registration_start ?? undefined}
                                    />
                                    <InputError className="mt-2" message={errors.registration_end} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="start">Event Start</Label>
                                    <Input
                                        id="start"
                                        type="datetime-local"
                                        className="mt-1 block w-full"
                                        value={data.start}
                                        onChange={(e) => setData('start', e.target.value)}
                                        required
                                        max={data.end ?? undefined}
                                    />
                                    <InputError className="mt-2" message={errors.start} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end">Event End</Label>
                                    <Input
                                        id="end"
                                        type="datetime-local"
                                        className="mt-1 block w-full"
                                        value={data.end ?? ''}
                                        onChange={(e) => setData('end', e.target.value)}
                                        min={data.start ?? undefined}
                                    />
                                    <InputError className="mt-2" message={errors.end} />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                                        Contact Details
                                    </p>
                                    {(Array.isArray(data.contact_details) ? data.contact_details : []).map((contact, index) => (
                                        <div key={index} className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
                                            <div>
                                                <Label htmlFor={`contact_name_${index}`}>Name</Label>
                                                <Input
                                                    id={`contact_name_${index}`}
                                                    type="text"
                                                    value={contact?.name ?? ''}
                                                    onChange={(e) => {
                                                        const updated = [...(data.contact_details ?? [])];
                                                        updated[index] = { ...updated[index], name: e.target.value };
                                                        setData('contact_details', updated);
                                                    }}
                                                    placeholder="Name"
                                                    maxLength={255}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor={`contact_title_${index}`}>Title</Label>
                                                <Input
                                                    id={`contact_title_${index}`}
                                                    type="text"
                                                    value={contact?.title ?? ''}
                                                    onChange={(e) => {
                                                        const updated = [...(data.contact_details ?? [])];
                                                        updated[index] = { ...updated[index], title: e.target.value };
                                                        setData('contact_details', updated);
                                                    }}
                                                    placeholder="Title"
                                                    maxLength={255}
                                                />
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div>
                                                    <Label htmlFor={`contact_country_code_${index}`}>Country Code</Label>
                                                    <Select
                                                        value={contact?.country_code ?? '+880'}
                                                        onValueChange={(value) => {
                                                            const updated = [...(data.contact_details ?? [])];
                                                            updated[index] = { ...updated[index], country_code: value };
                                                            setData('contact_details', updated);
                                                        }}
                                                    >
                                                        <SelectTrigger id={`contact_country_code_${index}`}>
                                                            <SelectValue placeholder="Country Code" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="+880">+880</SelectItem>
                                                            <SelectItem value="+1" disabled>
                                                                +1
                                                            </SelectItem>
                                                            <SelectItem value="+91" disabled>
                                                                +91
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor={`contact_phone_${index}`}>Phone</Label>
                                                    <Input
                                                        id={`contact_phone_${index}`}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={10}
                                                        value={contact?.phone ?? ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                            const updated = [...(data.contact_details ?? [])];
                                                            updated[index] = { ...updated[index], phone: val };
                                                            setData('contact_details', updated);
                                                        }}
                                                        placeholder="1000000000"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const updated = [...(data.contact_details ?? [])];
                                                        updated.splice(index, 1);
                                                        setData(
                                                            'contact_details',
                                                            updated.length ? updated : [{ name: '', title: '', country_code: '+880', phone: '' }],
                                                        );
                                                    }}
                                                    disabled={(data.contact_details?.length ?? 0) === 1}
                                                >
                                                    <Icon iconNode={Trash} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setData('contact_details', [
                                                ...(Array.isArray(data.contact_details) ? data.contact_details : []),
                                                { name: '', title: '', country_code: '+880', phone: '' },
                                            ]);
                                        }}
                                    >
                                        Add more contact
                                    </Button>
                                    <InputError className="mt-2" message={errors.contact_details} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value as 'Hidden' | 'Publish')}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hidden">Hidden</SelectItem>
                                            <SelectItem value="Publish">Publish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError className="mt-2" message={errors.status} />
                                </div>

                                <div className="flex w-full items-center gap-4">
                                    <Button disabled={processing}>{currentEvent ? 'Save' : 'Create'}</Button>
                                    {currentEvent && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to delete this event?')) {
                                                    await axios
                                                        .delete(`/admin/event/delete/${currentEvent.id}`)
                                                        .then(() => {
                                                            window.location.href = '/admin/event/all';
                                                        })
                                                        .catch(() => {
                                                            window.location.reload();
                                                        });
                                                }
                                            }}
                                            disabled={processing}
                                        >
                                            Delete
                                        </Button>
                                    )}
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
            </EventLayout>
        </AppLayout>
    );
}
