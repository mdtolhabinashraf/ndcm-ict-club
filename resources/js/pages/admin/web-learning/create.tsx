import UpdateWebLearning from '@/hooks/update-web-learning';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { usePage } from '@inertiajs/react';

export default function CreateWebLearning() {
    const { flash } = usePage().props as FlashProps;
    return <UpdateWebLearning flash={flash} />;
}
