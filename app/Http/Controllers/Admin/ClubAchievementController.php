<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClubAchievementController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'achievements' => 'nullable|array',
            'achievements.*.achievement' => 'nullable|string',
        ]);

        // Save to a file (public/club_achievements.json)
        Storage::disk('public')->put('club_achievements.json', json_encode($validated, JSON_PRETTY_PRINT));

        return redirect()->back()->with('message', 'Club achievements updated!');
    }

    public function get()
    {
        if (Storage::disk('public')->exists('club_achievements.json')) {
            $achievements = json_decode(Storage::disk('public')->get('club_achievements.json'), true);

            if (
                isset($achievements['achievements']) &&
                is_array($achievements['achievements']) &&
                collect($achievements['achievements'])->filter(function ($achievement) {
                    return !empty($achievement['achievement']);
                })->isNotEmpty()
            ) {
                return Inertia::render('admin/club/achievement', [
                    'achievements' => $achievements['achievements'],
                ]);
            }
        }

        return Inertia::render('admin/club/achievement');
    }
}
