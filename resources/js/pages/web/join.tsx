import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function join() {
    type ClubAdmission = {
        image: File | null;
        name: string;
        email: string;
        phone: string;
        collegeRoll: string;
        agree: boolean;
    };

    const { data, setData, post, processing, errors, reset } = useForm<Required<ClubAdmission>>({
        image: null,
        name: '',
        email: '',
        phone: '',
        collegeRoll: '',
        agree: false,
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleFormSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setDialogOpen(true); // Open dialog instead of submitting
    };

    // When payment is successful, submit the form
    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
        setDialogOpen(false);
        post(route('join'), {
            onFinish: () => reset('name'),
        });
    };

    return (
        <>
            <AppHeaderLayout className="gap-20 p-4 sm:p-8">
                <Head title="Join" />
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Club Admission</h2>
                            <p className="text-primary/80 text-center text-lg sm:text-xl">Join our club today!</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-5">
                        <div className="flex w-full items-center justify-center gap-5 rounded-lg border p-4 sm:w-[400px] sm:p-8">
                            <form className="flex w-full flex-col gap-6" onSubmit={handleFormSubmit}>
                                <div className="flex w-full items-center justify-center gap-2">
                                    <Label htmlFor="image" className="flex cursor-pointer flex-col items-center justify-center gap-2">
                                        <img
                                            className="h-[130px] w-[130px] rounded-full border object-center"
                                            src={data.image ? URL.createObjectURL(data.image) : '/images/user.webp'}
                                            alt="user-image"
                                        />
                                        <span className="text-primary/80 text-center text-sm">
                                            Upload your image
                                            <span className="text-red-400"> *</span>
                                        </span>
                                        <InputError message={errors.image} />
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        required
                                        tabIndex={5}
                                        accept="image/*"
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                        hidden
                                    />
                                    <InputError message={errors.image} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Name<span className="text-red-400"> *</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="John Doe"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        Email address<span className="text-red-400"> *</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">
                                        Phone<span className="text-red-400"> *</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        tabIndex={3}
                                        autoComplete="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+880 12345-67890"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="collegeRoll">
                                        College Roll Number<span className="text-red-400"> *</span>
                                    </Label>
                                    <Input
                                        id="collegeRoll"
                                        type="text"
                                        required
                                        tabIndex={4}
                                        autoComplete="college-roll"
                                        value={data.collegeRoll}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={8}
                                        minLength={7}
                                        onChange={(e) => setData('collegeRoll', e.target.value)}
                                        placeholder="1250000"
                                    />
                                    <InputError message={errors.collegeRoll} />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="agree"
                                        name="agree"
                                        checked={data.agree}
                                        required
                                        onClick={() => setData('agree', !data.agree)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="agree" className="cursor-pointer select-none">
                                        I agree to the{' '}
                                        <a href="/admission-rules" className="text-focus">
                                            terms and conditions
                                        </a>
                                    </Label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Button type="submit" disabled={processing}>
                                        Submit
                                    </Button>
                                    <Button type="button" onClick={() => reset()} variant="outline">
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="flex h-full w-full flex-col items-center justify-center gap-5 sm:w-[400px]">
                            <div className="flex w-full items-center justify-center gap-2 rounded-lg border p-4 sm:p-8">
                                <p className="text-center text-xl">Admission fee:</p>
                                <p className="text-primary/80 100 Tk. text-center text-lg sm:text-xl"> 100 Tk.</p>
                            </div>
                            <div className="flex w-full items-center justify-center gap-2 rounded-lg border p-4 sm:p-8">
                                <p className="text-center text-xl">Payment method:</p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="11.219999999999995 10.7 458.08000000000004 209.58"
                                    className="size-10"
                                >
                                    <path d="M327.99 110.75l12.99 58.4 85.01-43.04z" fill="#d12053" />
                                    <path d="M352.16 23.48L328 110.76l98.01 15.35z" fill="#e2136e" />
                                    <path d="M248.31 10.7l101.38 12.11-23.97 86.76z" fill="#d12053" />
                                    <path d="M247.52 27.76h11.29l31.67 40.5z" fill="#9e1638" />
                                    <path d="M428.69 125.55l-29.46-40.77 47.66-8.53z" fill="#d12053" />
                                    <path d="M423.77 137.5l3.04-9.07-74.39 37.74z" fill="#e2136e" />
                                    <path d="M325.91 113.05l15.52 69.77-46.06 37.46z" fill="#9e1638" />
                                    <path d="M442.25 96.97l27.05-.46-19.55-19.89z" fill="#e2136e" />
                                    <path
                                        d="M255.13 94.18v7.53c-2.76-4.35-10.52-7.22-14.8-6.62s-11 4.14-14.65 12C221.68 98.82 214 94 208.27 94h-17.78v8.84h11.58c5.12 0 10.46-.52 15.24 3.83a11.76 11.76 0 0 1 3.46 6.7c1.47 6.86-1.54 15.09-9.51 15.29a24.63 24.63 0 0 1-7.49-.87l-.61.63a66.48 66.48 0 0 1 4.91 8.17 25.21 25.21 0 0 0 12.56-6.82 24.09 24.09 0 0 0 5.05-7.12 24.26 24.26 0 0 0 4.49 7.12 22.36 22.36 0 0 0 11.32 6.82 69.8 69.8 0 0 1 4.42-8.17l-.54-.63a20.07 20.07 0 0 1-6.74.87c-8.25-.23-9.76-8.69-8.48-15.29 1.11-5.62 6.11-11.15 11-11.56 5.49-.45 12.19 4.18 13.55 9.85a41.85 41.85 0 0 1 1 9.47v51.49a35 35 0 0 1 3.94-.38 33.7 33.7 0 0 1 4 .38V94.18z"
                                        fill="#231f20"
                                    />
                                    <path
                                        d="M42.34 64.29c13.91-1.39 35.27 16.56 37 20.48l1.32-.21V74.25c-9.77-5.17-23.41-15.79-41.5-14.49-20.07 1.44-27.92 13.24-27.94 34V172.67a26.39 26.39 0 0 1 3.77-.41 36.5 36.5 0 0 1 4.27.41v-69.79h53.36v5.73c-29.29.54-42 16.87-42 30.9 0 17.1 17.66 33.17 48.68 33.17h1.37V94H20l-.1-.18a20.61 20.61 0 0 1-.61-4.66C19.18 75.87 28 65.69 42.34 64.29zM41.09 140c0-12.34 13.67-24.17 31.53-26.74v56.09C53 166 41.09 150.6 41.09 140z"
                                        fill="#e2136e"
                                    />
                                    <path
                                        d="M82.75 94v8.85h54.88v5.73c-29.29.54-42 16.87-42 30.9 0 17.1 17.67 33.17 48.67 33.17h1.36v-58.32h.85c9.85-.27 15.74 6 16.05 14.05a13.34 13.34 0 0 1-8.69 13.09l.06 1.19 7.48-.22c4.18-5.29 6.89-11.19 6.62-17.56-.46-11.11-7.88-16.4-22.37-16.2v-5.75h34.75v69.79a28.1 28.1 0 0 1 3.93-.41 34.62 34.62 0 0 1 4.1.41V94zm23.35 46c0-12.34 13.68-24.17 31.53-26.74v56.1C118 166 106.1 150.6 106.1 140z"
                                        fill="#231f20"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>
                <Dialog open={true} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogTitle>Admission Payment</DialogTitle>
                        <DialogDescription>Please review your bill and select a payment method to proceed.</DialogDescription>
                        <div>
                            <div className="flex justify-between">
                                <span>Admission Fee</span>
                                <span className="font-semibold">100 Tk.</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="payment-method">Payment Method</Label>
                            {(() => {
                                const [selectedMethod, setSelectedMethod] = useState<string>('bKash');
                                return (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="rounded-lg px-8 py-2">
                                                <span>{selectedMethod ? selectedMethod : 'Select a method'}</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="center">
                                            <DropdownMenuItem onClick={() => setSelectedMethod('bKash')}>
                                                <span>bKash</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSelectedMethod('Nagad')} disabled>
                                                <span>Nagad</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSelectedMethod('Rocket')} disabled>
                                                <span>Rocket</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            })()}
                        </div>
                        <div className="mt-4 flex gap-4">
                            <Button>Proceed to Pay</Button>

                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </AppHeaderLayout>
        </>
    );
}
