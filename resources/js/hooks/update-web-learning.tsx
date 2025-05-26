import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import WebLearningLayout from '@/layouts/admin/web-learning-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, WebLearning } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useRef } from 'react';

export default function UpdateWebLearning({ currentWebLearning, flash }: { currentWebLearning?: Partial<WebLearning>; flash?: FlashProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: currentWebLearning ? 'Edit Web Learning' : 'Create Web Learning',
            href: currentWebLearning ? `/admin/web-learning/edit/${currentWebLearning?.id ?? ''}` : '/admin/web-learning/create',
        },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<WebLearning>>({
        id: null,
        title: '',
        svgImage: '',
        description: '',
        url: '',
        updated_at: '',
        ...currentWebLearning,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const configSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/web-learning/update');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={currentWebLearning ? 'Edit Web Learning' : 'Create Web Learning'} />

            <WebLearningLayout className="max-w-4xl">
                <div className="space-y-6">
                    <HeadingSmall
                        title={currentWebLearning ? 'Edit' : 'Create'}
                        description={currentWebLearning ? 'Edit existing web learning here' : 'Create new web learning here'}
                    />
                    <div className="flex flex-col gap-5">
                        <div>
                            <form onSubmit={configSubmit} className="space-y-6">
                                <div className="flex w-full items-center justify-center gap-2">
                                    <Label htmlFor="svgImage" className="flex w-full cursor-pointer flex-col items-start gap-2">
                                        <img
                                            className="max-h-[96px] rounded-md border p-2"
                                            src={
                                                data.svgImage
                                                    ? typeof data.svgImage === 'string'
                                                        ? data.svgImage
                                                        : URL.createObjectURL(data.svgImage)
                                                    : '/global.svg'
                                            }
                                            alt={
                                                data.svgImage
                                                    ? typeof data.svgImage === 'string'
                                                        ? data.svgImage.split('/').pop()
                                                        : data.svgImage.name
                                                    : '/global.svg'
                                            }
                                        />
                                        {data.svgImage ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setData('svgImage', null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                            >
                                                Remove svg
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const input = fileInputRef.current;
                                                    if (input) {
                                                        input.click();
                                                    }
                                                }}
                                            >
                                                Upload svg
                                            </Button>
                                        )}
                                        <span className="text-xs text-neutral-500">Max size: 2MB</span>
                                        <InputError className="mt-2" message={errors.svgImage} />
                                    </Label>
                                    <Input
                                        id="svgImage"
                                        type="file"
                                        tabIndex={5}
                                        accept="image/svg+xml"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            if (file && file.size > 2 * 1024 * 1024) {
                                                alert('SVG must be less than 2MB');
                                                e.target.value = '';
                                                setData('svgImage', null);
                                            } else {
                                                setData('svgImage', file);
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
                                        value={data.title ?? ''}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Title"
                                        maxLength={255}
                                    />
                                    <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="url">URL</Label>
                                    <Input
                                        id="url"
                                        className="mt-1 block w-full"
                                        value={data.url ?? ''}
                                        onChange={(e) => setData('url', e.target.value)}
                                        autoComplete="off"
                                        placeholder="URL"
                                        maxLength={255}
                                    />
                                    <InputError className="mt-2" message={errors.url} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        className="mt-1 block min-h-80 w-full"
                                        value={data.description ?? ''}
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                        autoComplete="off"
                                        placeholder="Description"
                                        maxLength={10000}
                                    />
                                    <InputError className="mt-2" message={errors.description} />
                                </div>

                                <div className="flex w-full items-center gap-4">
                                    <Button disabled={processing}>{currentWebLearning ? 'Save' : 'Create'}</Button>
                                    {currentWebLearning && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={async () => {
                                                if (confirm('Are you sure you want to delete this?')) {
                                                    await axios
                                                        .delete(`/admin/web-learning/delete/${currentWebLearning.id}`)
                                                        .then(() => {
                                                            window.location.href = '/admin/web-learning/create';
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
            </WebLearningLayout>
        </AppLayout>
    );
}
