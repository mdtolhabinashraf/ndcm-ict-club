import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { type Event } from '@/types';
import { Head } from '@inertiajs/react';

export default function Event({ existingEvent }: { existingEvent: Event }) {
    if (!existingEvent) {
        return (
            <AppHeaderLayout className="gap-20 p-4 sm:p-8">
                <Head title="Event" />
                <section className="flex flex-col items-center justify-center gap-10">
                    <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Event not found</h2>
                </section>
            </AppHeaderLayout>
        );
    }
    return (
        <>
            <AppHeaderLayout className="gap-20 p-4 sm:p-8">
                <Head title={existingEvent.title} />
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">{existingEvent.title}</h2>
                            <p className="font-bangla text-primary/70 text-center text-lg font-medium sm:text-xl">
                                {new Date(existingEvent.start).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                {' | '}
                                {existingEvent.location ? existingEvent.location : 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div className="text-primary/70 flex w-full flex-col items-start gap-8 text-sm font-medium sm:text-base">
                        <img
                            src={existingEvent.image && typeof existingEvent.image === 'string' ? existingEvent.image : '/images/save_time.webp'}
                            className="h-[170px] w-full rounded-lg object-contain"
                            alt={existingEvent.title}
                        />

                        <p className="text-justify">
                            {existingEvent.description ? existingEvent.description : 'No description available for this event.'}
                        </p>
                        <ul className="flex list-disc flex-col gap-1 pl-5 text-justify">
                            <li>
                                Registration starts on{' '}
                                <span className="font-bold">
                                    {existingEvent.registration_start
                                        ? new Date(existingEvent.registration_start).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'N/A'}
                                </span>
                            </li>
                            <li>
                                Registration ends on{' '}
                                <span className="font-bold">
                                    {existingEvent.registration_end
                                        ? new Date(existingEvent.registration_end).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'N/A'}
                                </span>
                            </li>
                            <li>
                                <span>Can register </span>
                                <span className="font-bold">
                                    {!existingEvent.registration_for ||
                                    existingEvent.registration_for === 'Everyone' ||
                                    existingEvent.registration_for === 'Anyone' ||
                                    existingEvent.registration_for === 'All'
                                        ? 'anyone'
                                        : 'only ' + existingEvent.registration_for}
                                </span>
                            </li>
                            <li>
                                <span>Registration </span>
                                <span className="font-bold">
                                    {!existingEvent.registration_fee || existingEvent.registration_fee <= 0
                                        ? 'Free'
                                        : 'fee ' + existingEvent.registration_fee + ' Tk'}
                                </span>
                            </li>
                            <li>
                                <span>Event starts on </span>
                                <span className="font-bold">
                                    {existingEvent.start
                                        ? new Date(existingEvent.start).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : '_'}
                                </span>
                            </li>
                            <li>
                                <span>Location </span>
                                <span className="font-bold">{existingEvent.location ?? '_'}</span>
                            </li>
                            <li>
                                <span>Event ends on </span>
                                <span className="font-bold">
                                    {existingEvent.end
                                        ? new Date(existingEvent.end).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : '_'}
                                </span>
                            </li>
                        </ul>

                        {existingEvent.terms_condition ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Trems & Conditions</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Terms & Conditions</DialogTitle>
                                        <DialogDescription>
                                            Please read the terms and conditions carefully before registering for the event.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <img
                                        src={
                                            existingEvent.terms_condition && typeof existingEvent.terms_condition === 'string'
                                                ? existingEvent.terms_condition
                                                : ''
                                        }
                                        alt="Terms & Conditions"
                                        className="max-h-[80vh] w-full rounded border object-contain"
                                    />
                                </DialogContent>
                            </Dialog>
                        ) : null}

                        <div className="bg-primary/5 rounded-lg p-4 shadow-sm">
                            <h3 className="text-primary mb-3 text-lg font-semibold">Contact Details</h3>
                            {existingEvent.contact_details && existingEvent.contact_details.length > 0 ? (
                                <ul className="flex flex-wrap gap-3 space-y-4">
                                    {existingEvent.contact_details.map((contact, idx) => (
                                        <li
                                            key={'contact-' + idx}
                                            className="bg-background/80 flex h-30 w-full flex-col gap-1 rounded-md border p-3 shadow-sm sm:w-80"
                                        >
                                            <span className="text-primary text-base font-semibold">{contact.name}</span>
                                            <span className="text-primary/70 text-sm">{contact.title}</span>
                                            <a
                                                href={`tel:${contact.country_code}${contact.phone}`}
                                                className="text-focus mt-2 inline-block text-sm hover:underline"
                                            >
                                                <span className="font-medium">Phone:</span>{' '}
                                                <span className="font-bold">
                                                    {contact.country_code} {contact.phone}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-primary/70 text-sm">No contact details available for this event.</p>
                            )}
                        </div>
                    </div>
                </section>
            </AppHeaderLayout>
        </>
    );
}
