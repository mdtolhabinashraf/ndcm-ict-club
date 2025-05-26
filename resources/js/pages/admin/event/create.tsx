import UpdateEvent from '@/hooks/update-event';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { usePage } from '@inertiajs/react';

export default function CreateEvent() {
    const { flash } = usePage().props as FlashProps;
    return <UpdateEvent flash={flash} />;
}
