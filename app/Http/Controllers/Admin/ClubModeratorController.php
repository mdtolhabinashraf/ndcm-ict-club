<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ClubModeratorController extends Controller
{

    public function update(Request $request)
    {
        $validated = $request->validate([
            'image' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile('image')) {
                        if (!$request->file('image')->isValid()) {
                            $fail('The image file is invalid.');
                        }
                    } elseif ($value !== null && !is_string($value)) {
                        $fail('The image must be a file upload.');
                    }
                },
                'max:2048',
            ],
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'subTitle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contactEmail' => 'nullable|string',
        ]);

        // Load existing moderators
        $moderators = [];
        if (Storage::disk('public')->exists('club_moderators.json')) {
            $moderators = json_decode(Storage::disk('public')->get('club_moderators.json'), true) ?? [];
        }

        $oldImage = $moderators[$validated['title']]['image'] ?? null;

        // Handle image upload and save only the path
        if ($request->hasFile('image') && !is_string($request->file('image'))) {
            $fileName = Str::slug($validated['title']) . '.' . "webp";
            $imagePath = $request->file('image')->storeAs('moderators', $fileName, 'public');
            $validated['image'] = "/storage/" . $imagePath;
        } elseif (isset($validated['image']) && is_string($validated['image'])) {
            $validated['image'] = $validated['image'];
        } else {
            // If image is null and there was an old image, remove it from storage
            if ($oldImage) {
                $imagePath = ltrim($oldImage, '/storage/');
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
            $validated['image'] = null;
        }

        // Save by title
        $moderators[$validated['title']] = $validated;

        Storage::disk('public')->put('club_moderators.json', json_encode($moderators, JSON_PRETTY_PRINT));

        return redirect()->back()->with('message', 'Club moderators updated!');
    }

    public function edit()
    {
        if (Storage::disk('public')->exists('club_moderators.json')) {
            $moderators = json_decode(Storage::disk('public')->get('club_moderators.json'), true) ?? [];
        } else {
            $moderators = [
                'Moderator' => [
                    'image' =>  null,
                    'name' =>  '',
                    'title' => 'Moderator',
                    'subTitle' => '',
                    'description' => '',
                    'contactEmail' => '',
                ],
                'Co Moderator' => [
                    'image' =>  null,
                    'name' =>  '',
                    'title' => 'Co Moderator',
                    'subTitle' => '',
                    'description' => '',
                    'contactEmail' => '',
                ],
            ];
        }

        return Inertia::render('admin/club/moderators', [
            'moderators' => $moderators,
        ]);
    }
}
