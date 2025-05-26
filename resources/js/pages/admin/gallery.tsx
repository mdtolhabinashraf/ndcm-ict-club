import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import GalleryLayout from '@/layouts/admin/gallery-layout';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Input, Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gallery',
        href: '/admin/gallery',
    },
];

export default function UpdateGallery({
    galleryItems,
    featuredImages,
    galleryImages,
    featured,
    webGallery,
    flash,
}: {
    galleryItems?: string[];
    featuredImages?: string[];
    galleryImages?: string[];
    featured?: boolean;
    webGallery?: boolean;
    flash?: FlashProps;
}) {
    // State for dialog
    const [open, setOpen] = useState(false);
    const [selectedSrc, setSelectedSrc] = useState<string | null>(null);

    // Ensure galleryItems is always an array
    let items = Array.isArray(galleryItems) ? galleryItems : [];
    let title = 'Gallery';

    if (featured === true) {
        items = Array.isArray(featuredImages) ? featuredImages : [];
        title = 'Featured';
    }

    if (webGallery === true) {
        items = Array.isArray(galleryImages) ? galleryImages : [];
        title = 'Web Gallery';
    }

    const handleOpen = (src: string) => {
        setSelectedSrc(src);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedSrc(null);
    };

    const { data, setData, post, processing, recentlySuccessful } = useForm<{ srcPath: string; featured: boolean; gallery: boolean }>({
        srcPath: selectedSrc ?? '',
        featured: selectedSrc ? (featuredImages ?? []).includes(selectedSrc) : false,
        gallery: selectedSrc ? (galleryImages ?? []).includes(selectedSrc) : false,
    });

    // Add this effect to update form data when selectedSrc changes
    useEffect(() => {
        setData({
            srcPath: selectedSrc ?? '',
            featured: selectedSrc ? (featuredImages ?? []).includes(selectedSrc) : false,
            gallery: selectedSrc ? (galleryImages ?? []).includes(selectedSrc) : false,
        });
    }, [selectedSrc, featuredImages, galleryImages, setData]);

    const imageUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/gallery/update');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={title} />
            <GalleryLayout className="max-w-full">
                <div className="space-y-6">
                    <div className="flex w-full justify-between">
                        <HeadingSmall title={title + ' Items'} description={'All items in the ' + title.toLowerCase()} />
                        <div className="flex items-center justify-center gap-2">
                            <Label htmlFor="media" className="flex w-full cursor-pointer flex-col items-start gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={async () => {
                                        const input = document.getElementById('media') as HTMLInputElement;
                                        if (input) {
                                            input.click();
                                        }
                                    }}
                                    disabled={processing}
                                >
                                    Upload new
                                </Button>
                            </Label>
                            <Input
                                id="media"
                                type="file"
                                tabIndex={5}
                                accept="image/*"
                                multiple
                                hidden
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;
                                    for (let i = 0; i < files.length; i++) {
                                        const file = files[i];
                                        const formData = new FormData();
                                        formData.append('media', file);
                                        formData.append('featured', featured ? '1' : '0');
                                        formData.append('webGallery', webGallery ? '1' : '0');
                                        try {
                                            await axios.post('/admin/gallery/upload', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            });
                                        } catch (err) {
                                            alert('Upload failed for ' + file.name);
                                        }
                                    }
                                    window.location.reload();
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            <div className="columns-1 gap-12 md:columns-2 xl:columns-3">
                                {items.length === 0 ? (
                                    <div className="text-center">No {title.toLowerCase()} items found.</div>
                                ) : (
                                    items.map((src: string, idx: number) => (
                                        <div
                                            className="mb-8 w-76 cursor-pointer break-inside-avoid rounded-lg border-2 shadow-lg"
                                            key={idx}
                                            onClick={() => handleOpen(src)}
                                        >
                                            {src.endsWith('.mp4') ? (
                                                <video
                                                    className="w-full rounded-lg"
                                                    src={src}
                                                    controls
                                                    preload="metadata"
                                                    poster={src.replace('.mp4', '.webp')}
                                                />
                                            ) : (
                                                <img className="w-full rounded-lg" src={src} alt={title.toLowerCase() + 'image'} />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </GalleryLayout>
            {/* Dialog for image details */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex max-w-2xl flex-col items-start justify-center gap-4 p-6 sm:p-12">
                    <DialogTitle>Gallery File Details</DialogTitle>
                    <DialogClose onClick={handleClose} />
                    <div className="w-42">
                        {selectedSrc &&
                            (selectedSrc.endsWith('.mp4') ? (
                                <video
                                    className="w-full rounded-lg"
                                    src={selectedSrc}
                                    controls
                                    autoPlay
                                    preload="metadata"
                                    poster={selectedSrc.replace('.mp4', '.webp')}
                                />
                            ) : (
                                <img className="w-full rounded-lg" src={selectedSrc} alt="Gallery image" />
                            ))}
                    </div>
                    <div className="w-full">
                        <p className="text-sm">
                            <strong>File Path:</strong> {selectedSrc}
                        </p>
                    </div>
                    <form onSubmit={imageUpdate}>
                        {/* Checkboxes */}
                        <div className="flex w-full flex-col gap-3">
                            <label className="flex items-center gap-2">
                                <Checkbox id="featured" checked={data.featured} onCheckedChange={(checked) => setData('featured', !!checked)} />
                                <span>Add to featured</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox id="gallery" checked={data.gallery} onCheckedChange={(checked) => setData('gallery', !!checked)} />
                                <span>Add to gallery</span>
                            </label>
                        </div>
                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={async () => {
                                    if (selectedSrc && confirm('Are you sure you want to delete this ' + title.toLowerCase() + 'item?')) {
                                        await axios
                                            .delete('/admin/gallery/delete', { data: { filePath: selectedSrc } })
                                            .then(() => {
                                                window.location.href = '/admin/gallery/all';
                                            })
                                            .catch((err) => {
                                                window.location.reload();
                                            });
                                    }
                                }}
                                disabled={processing}
                            >
                                Delete
                            </Button>
                            <Button type="submit" variant="default" disabled={processing}>
                                Save
                            </Button>
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
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
