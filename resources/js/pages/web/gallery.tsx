import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function gallery() {
    const [showDocVideo, setShowDocVideo] = useState(false);

    const [galleryItems, setGalleryItems] = useState<string[] | null>(null);

    useEffect(() => {
        import('axios').then(({ default: axios }) => {
            axios
                .get('/storage/gallery_items.json', { headers: { 'Cache-Control': 'no-store' } })
                .then((res) => setGalleryItems(res.data))
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
            <AppHeaderLayout className="gap-20 p-4 sm:p-8">
                <Head title="Gallery" />
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Documentary of NDCM</h2>
                            <p className="font-bangla text-primary/80 text-center text-lg sm:text-xl">Created by Notre Dame ICT Club</p>
                        </div>
                    </div>
                    <div
                        className="relative mx-auto h-[197px] w-[350px] overflow-hidden rounded-lg sm:h-[290px] sm:w-[500px] lg:h-[337px] lg:w-[600px]"
                        data-aos="zoom-in"
                        data-aos-delay="100"
                    >
                        {!showDocVideo && (
                            <div
                                className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/60"
                                onClick={() => setShowDocVideo(true)}
                            >
                                <img src="images/documentry_thumbnail.webp" alt="YouTube Cover" className="h-full w-full object-cover opacity-80" />
                                <span className="absolute text-4xl text-white">
                                    <svg className="size-15" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                                        <path
                                            fill="#FF3D00"
                                            d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"
                                        ></path>
                                        <path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                    </svg>
                                </span>
                            </div>
                        )}
                        {showDocVideo && (
                            <iframe
                                className="h-[197px] w-[350px] rounded-lg sm:h-[290px] sm:w-[500px] lg:h-[337px] lg:w-[600px]"
                                src="https://www.youtube.com/embed/f-0cr85GMUo?si=zYmDNiHn4tzUctEC&autoplay=1"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </section>
                <section className="flex flex-col items-center justify-center gap-10">
                    <div className="w-full">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-center text-2xl font-semibold md:text-4xl xl:text-3xl">Gallery</h2>
                            <p className="font-bangla text-primary/80 text-center text-lg sm:text-xl">Memories in Photos</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-5">
                        {galleryItems && galleryItems.length > 0 ? (
                            <div className="columns-1 gap-7 md:columns-2 xl:columns-3">
                                {galleryItems.map((src, idx) => (
                                    <div className="mb-8 break-inside-avoid" key={idx} data-aos="zoom-in" data-aos-delay={`${idx * 100}`}>
                                        {src.endsWith('.mp4') ? (
                                            <video
                                                className="h-auto max-w-full rounded-lg"
                                                src={src}
                                                controls
                                                preload="metadata"
                                                poster={src.replace('.mp4', '.webp')}
                                            />
                                        ) : (
                                            <img className="h-auto max-w-full rounded-lg" src={src} alt="Gallery image" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">No Gallery Items Found</p>
                        )}
                    </div>
                </section>
            </AppHeaderLayout>
        </>
    );
}
