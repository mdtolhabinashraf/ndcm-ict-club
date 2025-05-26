import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactForm, FAQs } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { Copyright, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function AppFooter() {
    const { siteDetails, FAQs } = usePage().props as { siteDetails?: { contactEmail?: string }; FAQs?: FAQs[] };

    const { data, setData, post, processing, errors, recentlySuccessful, reset } = useForm<Required<ContactForm>>({
        id: null,
        name: '',
        email: '',
        message: '',
        created_at: null,
    });

    const contactFormSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/contact-message/submit', {
            onSuccess: () => reset(),
        });
    };

    return (
        <footer className="flex flex-col items-center justify-center">
            <section id="faqs" className="flex w-full max-w-7xl flex-col items-center justify-center gap-3 p-4 sm:p-8">
                <div className="w-full">
                    <div className="flex flex-col items-start justify-center gap-2">
                        <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">FAQs</h2>
                    </div>
                </div>
                <div className="w-full">
                    {FAQs && FAQs.length > 0 ? (
                        FAQs.map((faqItem, idx) => (
                            <div key={idx} className={idx === 0 ? 'py-5' : 'border-t py-5'}>
                                <h2
                                    className="w-full text-xl font-semibold"
                                    data-aos="fade-right"
                                    data-aos-duration="400"
                                    data-aos-delay={100 + idx * 50}
                                >
                                    {faqItem.faq.question}
                                </h2>
                                <p className="text-primary/80 w-full text-sm font-medium">{faqItem.faq.answer}</p>
                            </div>
                        ))
                    ) : (
                        <div className="py-5">
                            <p className="text-primary/80 w-full text-sm font-medium">No FAQs available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
            <section id="contact-us" className="flex w-full max-w-7xl flex-col justify-center gap-10 p-4 sm:p-8 md:flex-row">
                <div className="flex h-full min-w-[300px] flex-col items-start justify-center gap-8">
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold md:text-4xl xl:text-3xl">Contact us</h2>
                        <p className="font-bangla text-primary/80 text-lg sm:text-xl">For any inquiries</p>
                    </div>
                    <div>
                        <div className="text-primary/80 flex flex-col gap-2 text-sm sm:text-base">
                            <a href="https://ndcm.edu.bd" className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                                <img src="/images/ndcm_logo.webp" alt="ndcm_logo" className="size-5" />
                                <span>Notre Dame College, Mymensingh</span>
                            </a>

                            <a
                                href={`mailto:${siteDetails?.contactEmail}`}
                                className="flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="size-5" viewBox="0 0 48 48">
                                    <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path>
                                    <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path>
                                    <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon>
                                    <path
                                        fill="#c62828"
                                        d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
                                    ></path>
                                    <path
                                        fill="#fbc02d"
                                        d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
                                    ></path>
                                </svg>
                                <span>{siteDetails?.contactEmail}</span>
                            </a>

                            <a
                                href="https://www.facebook.com/ndcictclub"
                                className="flex items-center gap-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-focus size-5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                </svg>
                                <span>Notre Dame ICT Club</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <form className="flex flex-col gap-6" onSubmit={contactFormSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="name">Full name</Label>
                                </div>
                                <Input
                                    id="name"
                                    type="name"
                                    tabIndex={2}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
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
                                <div className="flex items-center">
                                    <Label htmlFor="message">Message</Label>
                                </div>
                                <Textarea
                                    id="message"
                                    required
                                    tabIndex={2}
                                    autoComplete="off"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Write your message here..."
                                />
                                <InputError message={errors.message} />
                            </div>
                            <div className="flex w-full items-center gap-4">
                                <Button type="submit" className="w-full" variant="outline" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Submit
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Submitted</p>
                                </Transition>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section className="flex w-full items-center justify-center gap-1 border-t py-5 text-[10px] font-medium sm:text-sm">
                Copyright <Icon iconNode={Copyright} className="size-4" />
                <a className="text-focus" href="https://mdtolhabinashraf.me" target="_blank" rel="noopener noreferrer">
                    Md. Tolha Bin Ashraf
                </a>
                | {new Date().getFullYear()} All Rights Reserved.
            </section>
        </footer>
    );
}
