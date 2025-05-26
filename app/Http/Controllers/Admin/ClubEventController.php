<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class ClubEventController extends Controller
{

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|exists:events,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
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
            'terms_condition' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->hasFile('terms_condition')) {
                        if (!$request->file('terms_condition')->isValid()) {
                            $fail('The terms_condition file is invalid.');
                        }
                    } elseif ($value !== null && !is_string($value)) {
                        $fail('The terms_condition must be a file upload.');
                    }
                },
                'max:2048',
            ],
            'folder_path' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'registration_fee' => 'required|numeric|min:0',
            'registration_for' => 'required|string|max:255',
            'registration_start' => 'nullable|date',
            'registration_end' => 'nullable|date|after_or_equal:registration_start',
            'start' => 'required|date',
            'end' => 'nullable|date|after_or_equal:start',
            'contact_details' => 'nullable|array',
            'status' => 'required|in:Hidden,Publish',
        ]);

        // If id is present, update; else, create
        if (!empty($validated['id'])) {
            $event = Event::findOrFail($validated['id']);
        } else {
            $event = new Event();
        }

        // Folder path for files
        if (!empty($event->folder_path)) {
            $folderPath = $event->folder_path;
        } else {
            $folderPath = 'events/' . Str::slug($validated['title']) . '-' . Str::random(10) . '-' . now()->format('YmdHis');
        }
        $validated['folder_path'] = $folderPath;

        // Handle image upload and save only the path
        if ($request->hasFile('image') && !is_string($request->file('image'))) {
            $fileName = 'image.webp';
            $imagePath = $request->file('image')->storeAs($folderPath, $fileName, 'public');
            $validated['image'] = "/storage/" . $imagePath;
        } elseif (isset($validated['image']) && is_string($validated['image'])) {
            $validated['image'] = $validated['image'];
        } else {
            // Remove old image from storage if exists
            if (!empty($event->image)) {
                $oldImagePath = storage_path('app/public' . $event->image);
                if (File::exists($oldImagePath)) {
                    File::delete($oldImagePath);
                }
            }
            $validated['image'] = null;
        }

        // Handle terms_condition upload and save only the path
        if ($request->hasFile('terms_condition') && !is_string($request->file('terms_condition'))) {
            $fileName = 'terms_conditions.webp';
            $termsPath = $request->file('terms_condition')->storeAs($folderPath, $fileName, 'public');
            $validated['terms_condition'] = "/storage/" . $termsPath;
        } elseif (isset($validated['terms_condition']) && is_string($validated['terms_condition'])) {
            $validated['terms_condition'] = $validated['terms_condition'];
        } else {
            // Remove old terms_condition from storage if exists
            if (!empty($event->terms_condition)) {
                $oldTermsPath = storage_path('app/public' . $event->terms_condition);
                if (File::exists($oldTermsPath)) {
                    File::delete($oldTermsPath);
                }
            }
            $validated['terms_condition'] = null;
        }

        // Convert contact_details to JSON if present
        if (isset($validated['contact_details'])) {
            // Filter out contacts missing name or phone
            $contacts = array_filter(
                $validated['contact_details'],
                function ($contact) {
                    return !empty($contact['name']) || !empty($contact['phone']);
                }
            );
            $validated['contact_details'] = json_encode(array_values($contacts));
        }

        // Fill and save event
        $event->fill($validated);
        $event->save();

        return redirect()->back()->with('message', $event->wasRecentlyCreated ? 'Event created successfully.' : 'Event updated successfully.');
    }

    public function edit($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return redirect()->route('admin.event.all')->with('message', 'Event not found.');
        }

        // Decode contact_details JSON if present
        if ($event->contact_details) {
            $event->contact_details = json_decode($event->contact_details, true);
        }

        return inertia('admin/event/edit', [
            'currentEvent' => $event,
        ]);
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        // Assuming the event has a 'folder_path' attribute that stores the folder path
        $folderPath = $event->folder_path; // e.g., "events/rty-20250510064207"

        if ($folderPath) {
            $fullPath = storage_path('app/public/' . $folderPath);
            if (File::exists($fullPath)) {
                File::deleteDirectory($fullPath);
            }
        }

        $event->delete();

        return redirect()->route('admin.event.all')->with('message', 'Event deleted successfully.');
    }

    public function show()
    {
        $events = Event::all();

        // Decode contact_details for each event if present
        foreach ($events as $event) {
            if ($event->contact_details) {
                $event->contact_details = json_decode($event->contact_details, true);
            }
        }

        return inertia('admin/event/all', [
            'events' => $events,
        ]);
    }

    public function find($id)
    {
        $event = Event::where('id', $id)->where('status', '!=', 'Hidden')->first();

        if (!$event) {
            return redirect()->route('events')->with('message', 'Event not found.');
        }


        if ($event->contact_details) {
            $event->contact_details = json_decode($event->contact_details, true);
        }


        return inertia('web/event', [
            'existingEvent' => $event,
        ]);
    }
}
