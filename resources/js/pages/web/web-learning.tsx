import { Button } from '@/components/ui/button';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { WebLearning } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function webLearning() {
    const [webLearnings, setWebLearnings] = useState<WebLearning[] | null>(null);

    useEffect(() => {
        import('axios').then(({ default: axios }) => {
            axios
                .get('/storage/web_learnings.json', { headers: { 'Cache-Control': 'no-store' } })
                .then((res) => setWebLearnings(res.data))
                .catch(() => console.error('Error fetching json'))
                .finally(() => setLoading(false));
        });
    }, []);

    const [loading, setLoading] = useState(true);
    if (loading) {
        return null;
    }

    return (
        <>
            <AppHeaderLayout className="gap-10 p-4 sm:p-8">
                <Head title="Web Learning" />
                {/* <section className="flex flex-col items-center justify-center gap-10">
                    <div className="flex w-full flex-col items-center justify-between gap-5 lg:grid-cols-2 lg:flex-row">
                        <div className="mb-5 px-2 lg:order-1 lg:mb-0">
                            <img src="/images/code_collab.webp" alt="website_idea" width={500} />
                        </div>
                        <div className="flex w-full flex-col items-center justify-center gap-5 lg:items-start">
                            <div className="flex flex-col items-center justify-center gap-2 lg:items-start">
                                <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Web Learning</h2>
                            </div>

                            <div className="space-y-2">
                                <p className="font-bangla text-primary/80 text-justify text-sm sm:text-base">
                                    ওয়েব লার্নিং পেজে আপনি ওয়েব ডেভেলপমেন্টের বিভিন্ন গুরুত্বপূর্ণ বিষয় সম্পর্কে সংক্ষিপ্ত ধারণা পাবেন। এখানে আমরা
                                    নিচের টুল ও টেকনোলজিগুলোর মৌলিক ধারণা জানবো:
                                </p>
                                <ul className="list-disc pl-6">
                                    {webLearning.map(({ id, title }) => (
                                        <li key={id}>
                                            <a className="text-focus text-sm font-medium" href={`#${id}`}>
                                                {title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <p className="font-bangla text-primary/80 text-justify text-sm sm:text-base">
                                    এই পেজে কিভাবে ডেভেলপমেন্ট করতে হয় তা শেখানো হবে না, বরং প্রতিটি টুল ও টেকনোলজির মৌলিক ধারণা তুলে ধরা হবে, যাতে
                                    আপনি ওয়েব ডেভেলপমেন্টের জগৎ সম্পর্কে প্রাথমিক ধারণা নিতে পারেন।
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="focus"
                                    onClick={() => {
                                        window.open('/join', '_self');
                                    }}
                                    className="text-md h-11 px-6"
                                >
                                    Join
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        window.open('#contact-us', '_self');
                                    }}
                                    className="text-md h-11 px-6"
                                >
                                    Contact us
                                </Button>
                            </div>
                        </div>
                    </div>
                </section> */}
                {webLearnings &&
                    webLearnings.length > 0 &&
                    webLearnings.map(({ id, svgImage, url, title, description }, idx) => (
                        <section key={id} id={idx.toString()} className="flex flex-col items-start gap-5">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    window.open(url, '_blank');
                                }}
                                className="flex gap-2 py-8"
                                data-aos="fade-right"
                            >
                                {typeof svgImage === 'string' && svgImage ? <img width={36} height={36} src={svgImage} alt={title} /> : null}
                                <h2 className="text-2xl font-semibold md:text-4xl xl:text-3xl">{title}</h2>
                            </Button>
                            <p className="font-bangla text-primary/80 text-justify text-sm sm:text-base" data-aos="zoom-in" data-aos-delay="50">
                                {description}{' '}
                                <a href={url} className="text-focus font-medium" target="_blank" rel="noopener noreferrer">
                                    Learn more.
                                </a>
                            </p>
                        </section>
                    ))}
            </AppHeaderLayout>
        </>
    );
}
