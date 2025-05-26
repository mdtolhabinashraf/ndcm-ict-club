<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:1000',
        ]);

        $contactMessage = new ContactMessage();

        // Fill and save event
        $contactMessage->fill($validated);
        $contactMessage->save();

        return redirect()->back()->with('message', 'Message submitted successfully.');
    }


    public function show()
    {
        $contactMessages = ContactMessage::all();

        return inertia('admin/contact-messages', [
            'contactMessages' => $contactMessages,
        ]);
    }
}
