import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { FlashProps } from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem, FAQs } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function UpdateFAQs({ FAQs = [], flash }: { FAQs?: FAQs[]; flash?: FlashProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'FAQS',
            href: '/admin/faqs',
        },
    ];

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
        faqs: {
            faq: {
                question: string;
                answer: string;
            };
        }[];
    }>({
        faqs: FAQs.length
            ? FAQs
            : [
                  {
                      faq: {
                          question: '',
                          answer: '',
                      },
                  },
              ],
    });

    const faqsSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/faqs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} flash={flash}>
            <Head title={FAQs.length ? 'Edit FAQS' : 'Create FAQS'} />

            <div className="max-w-2xl space-y-6 p-4 sm:px-14 sm:py-7">
                <HeadingSmall
                    title={FAQs.length ? 'Edit' : 'Create'}
                    description={FAQs.length ? 'Edit existing FAQs here' : 'Create new FAQs here'}
                />
                <div className="flex flex-col gap-5">
                    <div>
                        <form onSubmit={faqsSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {data.faqs.map((faq, index) => (
                                    <div key={index} className="grid grid-cols-1 items-center justify-center gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`faq_question_${index}`}>FAQ {index + 1}</Label>

                                            <Input
                                                id={`faq_question_${index}`}
                                                className="w-full"
                                                value={faq.faq.question}
                                                onChange={(e) => {
                                                    const updated = [...data.faqs];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        faq: {
                                                            ...updated[index].faq,
                                                            question: e.target.value,
                                                        },
                                                    };
                                                    setData('faqs', updated);
                                                }}
                                                autoComplete="off"
                                                placeholder="FAQ Question"
                                                maxLength={255}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="flex gap-2">
                                                <Textarea
                                                    id={`faq_answer_${index}`}
                                                    value={faq.faq.answer}
                                                    onChange={(e) => {
                                                        const updated = [...data.faqs];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            faq: {
                                                                ...updated[index].faq,
                                                                answer: e.target.value,
                                                            },
                                                        };
                                                        setData('faqs', updated);
                                                    }}
                                                    autoComplete="off"
                                                    placeholder="FAQ Answer"
                                                    maxLength={1000}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const updated = [...data.faqs];
                                                            updated.splice(index, 1);
                                                            setData('faqs', updated.length ? updated : [{ faq: { question: '', answer: '' } }]);
                                                        }}
                                                        disabled={data.faqs.length === 1}
                                                    >
                                                        <Icon iconNode={Trash} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <InputError className="mt-2" message={errors.faqs} />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setData('faqs', [...data.faqs, { faq: { question: '', answer: '' } }]);
                                    }}
                                >
                                    Add more faq
                                </Button>
                            </div>
                            <div className="flex w-full items-center gap-4">
                                <Button disabled={processing}>{FAQs.length ? 'Save' : 'Create'}</Button>
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
