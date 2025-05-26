<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;

class WebLearningController extends Controller
{
    protected $jsonFile = 'web_learnings.json';

    // Helper to get all items from JSON
    protected function getAll()
    {
        // Always use the 'public' disk for consistency
        if (!Storage::disk('public')->exists($this->jsonFile)) {
            Storage::disk('public')->put($this->jsonFile, json_encode([]));
        }
        return json_decode(Storage::disk('public')->get($this->jsonFile), true);
    }

    // Helper to save all items to JSON
    protected function saveAll($items)
    {
        Storage::disk('public')->put($this->jsonFile, json_encode($items, JSON_PRETTY_PRINT));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:10000',
            'svgImage' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile('svgImage')) {
                        $file = $request->file('svgImage');
                        if (!$file->isValid()) {
                            $fail('The svg file is invalid.');
                        } elseif ($file->getClientOriginalExtension() !== 'svg' && $file->getMimeType() !== 'image/svg+xml') {
                            $fail('The file must be an SVG.');
                        }
                    } elseif ($value !== null && !is_string($value)) {
                        $fail('The svg must be a file upload.');
                    }
                },
                'max:2048',
            ],
            'url' => 'nullable|string|max:255',
        ]);

        $items = $this->getAll();

        // Handle image upload and save only the path
        if ($request->hasFile('svgImage') && !is_string($request->file('image'))) {
            $fileName = Str::slug($validated['title']) . '.' . "svg";
            $imagePath = $request->file('svgImage')->storeAs('web-learning-svg', $fileName, 'public');
            $validated['svgImage'] = "/storage/" . $imagePath;
        } elseif (isset($validated['svgImage']) && is_string($validated['svgImage'])) {
            // If image is already a path, keep it as is
            $validated['svgImage'] = $validated['svgImage'];
        } else {
            $validated['svgImage'] = null;
        }

        if (!empty($validated['id'])) {
            // Update existing
            foreach ($items as &$item) {
                if ($item['id'] == $validated['id']) {
                    // Remove old SVG if new svgImage is null and old exists
                    if (
                        array_key_exists('svgImage', $item) &&
                        !empty($item['svgImage']) &&
                        $validated['svgImage'] === null
                    ) {
                        $oldPath = ltrim($item['svgImage'], '/storage/');
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                        }
                    }
                    $item = array_merge($item, $validated);
                    $item['updated_at'] = Carbon::now()->toDateTimeString();
                    $this->saveAll($items);
                    return redirect()->back()->with('message', 'Web Learning updated successfully!');
                }
            }
            return redirect()->back()->with('error', 'Web Learning not found.');
        } else {
            // Create new
            $validated['id'] = count($items) ? max(array_column($items, 'id')) + 1 : 1;
            $validated['updated_at'] = Carbon::now()->toDateTimeString();
            $items[] = $validated;
            $this->saveAll($items);
            return redirect()->route('admin.web-learning.edit', ['id' => $validated['id']])->with('message', 'Web Learning created successfully!');
        }
    }

    public function edit($id)
    {
        $items = $this->getAll();
        foreach ($items as $item) {
            if ($item['id'] == $id) {
                return Inertia::render('admin/web-learning/edit', [
                    'webLearning' => $item,
                ]);
            }
        }

        return redirect()->route('admin.web-learning.create')->with('message', 'Web Learning not found.');
    }

    public function destroy($id)
    {
        $items = $this->getAll();
        $found = false;
        foreach ($items as $key => $item) {
            if ($item['id'] == $id) {
                unset($items[$key]);
                $found = true;
                break;
            }
        }
        if ($found) {
            $this->saveAll(array_values($items));

            return redirect()->route('admin.web-learning.create')->with('message', 'Web Learning deleted successfully.');
        }
        return redirect()->back()->with('message', 'Web Learning not found.');
    }
}
