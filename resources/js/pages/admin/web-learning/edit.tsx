import UpdateWebLearning, { WebLearning } from '@/hooks/update-web-learning';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { usePage } from '@inertiajs/react';

export default function EditWebLearning({ webLearning }: { webLearning?: Partial<WebLearning> }) {
    const { flash } = usePage().props as FlashProps;
    return <UpdateWebLearning currentWebLearning={webLearning} flash={flash} />;
}
