import UpdateEvent from '@/hooks/update-event';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { Event } from '@/types';
import { usePage } from '@inertiajs/react';

export default function EditEvent({ currentEvent }: { currentEvent?: Partial<Event> }) {
    const { flash } = usePage().props as FlashProps;
    return <UpdateEvent currentEvent={currentEvent} flash={flash} />;
}
