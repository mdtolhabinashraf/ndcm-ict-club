<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'flash' => function () {
                return [
                    'message' => session('message'),
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },

            'events' => function () {
                $events = \App\Models\Event::where('status', '!=', 'Hidden')->get();

                // Decode contact_details for each event if present
                foreach ($events as $event) {
                    if ($event->contact_details) {
                        $event->contact_details = json_decode($event->contact_details, true);
                    }
                }

                return $events;
            },

            'siteDetails' => function () {
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists('club_details.json')) {
                    $existingSiteDetails = json_decode(\Illuminate\Support\Facades\Storage::disk('public')->get('club_details.json'), true);
                }

                return [
                    'favicon' => '/favicon.ico',
                    'logo' => '/apple-touch-icon.png',
                    'title' => 'Notre Dame ICT Club',
                    'slogan' => 'আইসিটিতে দক্ষ হও, নিজেকে বদলে নাও',
                    'history' => '২০১৮ সালের ৩১ জানুয়ারি নটর ডেম কলেজ ময়মনসিংহের আইসিটি বিভাগে শহরের অন্যান্য কলেজের শিক্ষার্থীদের নিয়ে আইসিটি অলিম্পিয়াড অনুষ্ঠিত হয়। কলেজের শিক্ষার্থীদের ঈর্ষনীয় সাফল্যে অনুপ্রাণিত হয়ে আইসিটি বিভাগের শিক্ষকবৃন্দ তথ্য প্রযুক্তি অনুরাগী তৎকালীন অধ্যক্ষ ফাদার ড.জর্জ কমল রোজারিও সিএসসি,মহোদয়ের নিকট আইসিটি ক্লাব গঠনের প্রস্তাব করেন। অধ্যক্ষ ফাদার ২০১৮ সালের ১ ফেব্রয়ারি তারিখে অনুষ্ঠিত নটরডেম বিজ্ঞান ও সাংস্কৃতিক প্রতিযোগিতা অনুষ্ঠানে নটর ডেম আইসিটি ক্লাব গঠনের ঘোষণা দেন। তৎকালীন ক্লাব কো- অর্ডিনেটর ফাদার প্লাসিড পি.রোজারিও সিএসসি আইসিটি বিভাগের শিক্ষকবৃন্দের ক্লাব মডারেটরের দায়িত্ব প্রদান করেন এবং ১৪ই ফেব্রয়ারি ২০১৮ খ্রিস্টাব্দ হতে আইসিটি ক্লাবের সদস্য সংগ্রহ শুরু হয়।',
                    'contactEmail' => '',
                    ...$existingSiteDetails
                ];
            },

            'FAQs' => function () {
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists('faqs.json')) {
                    $faqs = json_decode(\Illuminate\Support\Facades\Storage::disk('public')->get('faqs.json'), true);

                    if (
                        isset($faqs['faqs']) &&
                        is_array($faqs['faqs']) &&
                        collect($faqs['faqs'])->filter(function ($faqs) {
                            return !empty($faqs['faq']);
                        })->isNotEmpty()
                    ) {
                        return $faqs['faqs'];
                    }
                }

                return [];
            },
        ]);
    }
}
