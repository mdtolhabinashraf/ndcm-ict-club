<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClubMissionController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'missions' => 'nullable|array',
            'missions.*.mission' => 'nullable|string',
        ]);

        // Save to a file (public/club_missions.json)
        Storage::disk('public')->put('club_missions.json', json_encode($validated, JSON_PRETTY_PRINT));

        return redirect()->back()->with('message', 'Club missions updated!');
    }

    public function get()
    {
        if (Storage::disk('public')->exists('club_missions.json')) {
            $missions = json_decode(Storage::disk('public')->get('club_missions.json'), true);

            if (
                isset($missions['missions']) &&
                is_array($missions['missions']) &&
                collect($missions['missions'])->filter(function ($mission) {
                    return !empty($mission['mission']);
                })->isNotEmpty()
            ) {
                return Inertia::render('admin/club/mission', [
                    'missions' => $missions['missions'],
                ]);
            }
        }

        return Inertia::render('admin/club/mission');
    }
}
