<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FAQsController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'faqs' => 'nullable|array',
            'faqs.*.faq.question' => 'nullable|string|max:255',
            'faqs.*.faq.answer' => 'nullable|string|max:1000',
        ]);

        // Save to a file (public/faqs.json)
        Storage::disk('public')->put('faqs.json', json_encode($validated, JSON_PRETTY_PRINT));

        return redirect()->back()->with('message', 'FAQs updated!');
    }
}
