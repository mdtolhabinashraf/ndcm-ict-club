<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClubAdmissionDetailsController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'admission_rules' => 'nullable|array',
            'admission_rules.*.admission_rule' => 'nullable|string',
            'admission_fee' => 'nullable|numeric',
        ]);

        // Save to a file (public/club_admission_details.json)
        Storage::disk('public')->put('club_admission_details.json', json_encode($validated, JSON_PRETTY_PRINT));

        return redirect()->back()->with('message', 'Club admission details updated!');
    }

    public function get()
    {
        $admission_details = [];
        if (Storage::disk('public')->exists('club_admission_details.json')) {
            $admission_details = json_decode(Storage::disk('public')->get('club_admission_details.json'), true);

            if (
                isset($admission_details['admission_rules']) &&
                is_array($admission_details['admission_rules']) &&
                collect($admission_details['admission_rules'])->filter(function ($admission_rule) {
                    return !empty($admission_rule['admission_rule']);
                })->isEmpty()
            ) {
                $admission_details['admission_rules'] = [];
            }
            return Inertia::render('admin/club/admission-details', [
                'admissionDetails' => [
                    'admission_rules' => $admission_details['admission_rules'] ?? [],
                    'admission_fee' => $admission_details['admission_fee'] ?? null,
                ],
            ]);
        }

        return Inertia::render('admin/club/admission-details');
    }
}
