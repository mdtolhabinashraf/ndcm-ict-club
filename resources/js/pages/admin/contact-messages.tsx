import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, ContactForm } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contact Messages',
        href: '/admin/contact-messages',
    },
];

export default function contactMessages({ contactMessages }: { contactMessages?: ContactForm[] }) {
    const { flash } = usePage().props as FlashProps;
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<ContactForm | null>(null);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleView = (msg: ContactForm) => {
        setSelected(msg);
        setOpen(true);
    };

    const handleLoadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setLoading(false);
        }, 500); // Simulate loading
    };

    const visibleMessages = (contactMessages ?? [])
        .slice()
        .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        .slice(0, visibleCount);

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Contact Messages" />
            {/* Dialog for viewing message */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-full rounded-2xl border p-8 text-xs shadow-2xl sm:max-w-3xl md:text-sm">
                    <DialogHeader className="mb-4 border-b pb-3">
                        <DialogTitle className="text-focus flex items-center gap-2 text-lg font-semibold">
                            <Icon iconNode={MessageCircle} />
                            Contact Message Details
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Here are the details of the contact message you selected.
                        </DialogDescription>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="flex w-full items-center gap-2">
                                <span className="w-28 font-medium">Name:</span>
                                <span>{selected.name}</span>
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <span className="w-28 font-medium">Email:</span>
                                <span>{selected.email}</span>
                            </div>
                            <div className="flex w-full items-start gap-2">
                                <span className="w-28 font-medium">Message:</span>
                                <span>{selected.message}</span>
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <span className="w-28 font-medium">Submitted At:</span>
                                <span>{new Date(selected.created_at ?? 0).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="mt-6 flex justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="rounded-full px-6 py-2">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="space-y-6 p-4 sm:px-14 sm:py-7">
                <HeadingSmall title="Messages" description="All contact messages are here" />
                <div className="flex flex-col gap-5">
                    <div>
                        <div className="overflow-hidden rounded-lg border shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="border-b">
                                        <tr className="text-left text-[11px] font-medium tracking-wider uppercase md:text-xs">
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Message
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Submitted At
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleMessages.map((contactMessage) => (
                                            <tr
                                                key={contactMessage.id}
                                                className="cursor-pointer border-b text-[12px] whitespace-nowrap md:text-sm"
                                                onClick={() => handleView(contactMessage)}
                                            >
                                                <td className="px-6 py-4">
                                                    {(contactMessage?.name?.length ?? 0) > 22
                                                        ? `${contactMessage.name?.slice(0, 22) ?? ''}...`
                                                        : (contactMessage.name ?? '')}
                                                </td>
                                                <td className="px-6 py-4">{contactMessage.email}</td>
                                                <td className="px-6 py-4 hover:underline">
                                                    {contactMessage.message.length > 22
                                                        ? `${contactMessage.message.slice(0, 22)}...`
                                                        : contactMessage.message}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(contactMessage.created_at ?? 0).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="flex gap-2 px-6 py-4">
                                                    <Button type="button" variant="secondary" onClick={() => handleView(contactMessage)}>
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {visibleCount < (contactMessages?.length ?? 0) && (
                            <div className="my-4 flex justify-center">
                                <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                                    {loading ? 'Loading...' : 'Load More'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
