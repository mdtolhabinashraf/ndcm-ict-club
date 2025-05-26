<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClubConfigController extends Controller
{

    public function update(Request $request)
    {
        $validated = $request->validate([
            'favicon' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile('favicon')) {
                        if (!$request->file('favicon')->isValid()) {
                            $fail('The favicon file is invalid.');
                        }
                    } elseif ($value !== null && !is_string($value)) {
                        $fail('The favicon must be a file upload.');
                    }
                },
                'max:2048',
            ],
            'logo' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile('logo')) {
                        if (!$request->file('logo')->isValid()) {
                            $fail('The logo file is invalid.');
                        }
                    } elseif ($value !== null && !is_string($value)) {
                        $fail('The logo must be a file upload.');
                    }
                },
                'max:2048',
            ],
            'title' => 'required|string|max:255',
            'slogan' => 'required|string',
            'history' => 'required|string',
            'contactEmail' => 'required|email',
        ]);

        $siteDetails = [];
        if (Storage::disk('public')->exists('club_details.json')) {
            $siteDetails = json_decode(Storage::disk('public')->get('club_details.json'), true) ?? [];
        }

        $oldFavicon = $siteDetails['favicon'] ?? null;
        $oldLogo = $siteDetails['logo'] ?? null;

        // Handle favicon upload and save only the path
        if ($request->hasFile('favicon')) {
            $fileName = "favicon.ico";
            $request->file('favicon')->move(public_path(), $fileName);
            $validated['favicon'] = "/" . $fileName;
            // Optionally remove old favicon if different
            if ($oldFavicon && $oldFavicon !== '/' . $fileName) {
                $oldPath = public_path(ltrim($oldFavicon, '/'));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
        } elseif (isset($validated['favicon']) && is_string($validated['favicon'])) {
            $validated['favicon'] = $validated['favicon'];
        } else {
            // If image is null and there was an old image, remove it from public folder
            if ($oldFavicon) {
                $faviconPath = public_path(ltrim($oldFavicon, '/'));
                if (file_exists($faviconPath)) {
                    @unlink($faviconPath);
                }
            }
            $validated['favicon'] = null;
        }

        // Handle logo upload and save only the path
        if ($request->hasFile('logo')) {
            $fileName = "apple-touch-icon.png";
            $request->file('logo')->move(public_path(), $fileName);
            $validated['logo'] = "/" . $fileName;
            // Optionally remove old logo if different
            if ($oldLogo && $oldLogo !== '/' . $fileName) {
                $oldPath = public_path(ltrim($oldLogo, '/'));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
        } elseif (isset($validated['logo']) && is_string($validated['logo'])) {
            $validated['logo'] = $validated['logo'];
        } else {
            // If image is null and there was an old image, remove it from public folder
            if ($oldLogo) {
                $logoPath = public_path(ltrim($oldLogo, '/'));
                if (file_exists($logoPath)) {
                    @unlink($logoPath);
                }
            }
            $validated['logo'] = null;
        }

        // Save to a file (public/club_details.json)
        Storage::disk('public')->put('club_details.json', json_encode($validated, JSON_PRETTY_PRINT));

        return redirect()->back()->with('message', 'Club details updated!');
    }
}
