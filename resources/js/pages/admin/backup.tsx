import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Backup',
        href: '/admin/backup',
    },
];

export default function Backup({
    lastBackup = undefined,
    lastLoad = undefined,
    flash,
}: {
    lastBackup?: string;
    lastLoad?: string;
    flash?: FlashProps;
}) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleBackup = async () => {
        if (!confirm('Are you sure you want to backup?')) return;
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            const response = await axios.post('/admin/backup');
            if (response.data?.success) {
                setSuccessMessage(response.data.success);
                window.location.reload();
            } else if (response.data?.error) {
                setErrorMessage(response.data.error);
            } else {
                window.location.reload();
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Error during backup.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = async () => {
        if (!confirm('Are you sure you want to load current backup?')) return;
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            const response = await axios.post('/admin/backup/load');
            if (response.data?.success) {
                setSuccessMessage(response.data.success);
                window.location.reload();
            } else if (response.data?.error) {
                setErrorMessage(response.data.error);
            } else {
                window.location.reload();
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Error loading backup.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete current backup?')) return;
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        try {
            const response = await axios.post('/admin/backup/delete');
            if (response.data?.success) {
                setSuccessMessage(response.data.success);
                window.location.reload();
            } else if (response.data?.error) {
                setErrorMessage(response.data.error);
            } else {
                window.location.reload();
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Error deleting backup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title="Backup" />

            <div className="max-w-2xl space-y-6 p-4 sm:px-14 sm:py-7">
                <HeadingSmall title="Backup" description="Create a backup of your club data. This will also include events." />
                <div className="flex flex-col gap-2">
                    {lastBackup ? (
                        <p className="text-primary/80 text-sm font-medium">
                            Last backup on{' '}
                            <span
                                className={lastBackup && Date.now() - new Date(lastBackup).getTime() < 10000 ? 'text-focus font-bold' : 'font-bold'}
                            >
                                {lastBackup}
                            </span>
                        </p>
                    ) : (
                        <p className="text-primary/80 text-sm">No backup available.</p>
                    )}
                    {lastLoad ? (
                        <p className="text-primary/80 text-sm font-medium">
                            Last restored on{' '}
                            <span className={lastLoad && Date.now() - new Date(lastLoad).getTime() < 10000 ? 'text-focus font-bold' : 'font-bold'}>
                                {lastLoad}
                            </span>
                        </p>
                    ) : lastBackup ? (
                        <p className="text-primary/80 text-sm">No backup restored yet</p>
                    ) : null}
                    <div className="mt-4 mb-2 flex flex-col gap-2">
                        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="focus" type="button" onClick={handleBackup} disabled={loading}>
                            {loading ? 'Processing...' : 'Backup'}
                        </Button>
                        <Button type="button" onClick={handleLoad} disabled={loading || !lastBackup}>
                            {loading ? 'Processing...' : 'Restore'}
                        </Button>
                        <Button variant="destructive" type="button" onClick={handleDelete} disabled={loading || !lastBackup}>
                            {loading ? 'Processing...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
