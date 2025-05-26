<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'media' => 'required|file|mimes:jpg,jpeg,png,gif,webp,bmp,svg,mp4,webm,ogg,mov,avi,mkv|max:204800', // 200MB
            'featured' => 'boolean',
            'webGallery' => 'boolean',
        ]);

        $file = $request->file('media');
        $uniqueName = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('gallery', $uniqueName, 'public');
        $filePath = '/storage/gallery/' . $uniqueName;

        // Save to featured_items.json if featured is true
        if ($request->boolean('featured')) {
            $featuredImages = [];
            if (Storage::disk('public')->exists('featured_items.json')) {
                $featuredImages = json_decode(Storage::disk('public')->get('featured_items.json'), true) ?: [];
            }
            if (!in_array($filePath, $featuredImages)) {
                $featuredImages[] = $filePath;
                Storage::disk('public')->put('featured_items.json', json_encode($featuredImages));
            }
        }

        // Save to gallery_items.json if webGallery is true
        if ($request->boolean('webGallery')) {
            $galleryImages = [];
            if (Storage::disk('public')->exists('gallery_items.json')) {
                $galleryImages = json_decode(Storage::disk('public')->get('gallery_items.json'), true) ?: [];
            }
            if (!in_array($filePath, $galleryImages)) {
                $galleryImages[] = $filePath;
                Storage::disk('public')->put('gallery_items.json', json_encode($galleryImages));
            }
        }

        return redirect()->back()->with('message', 'New file uploaded successfully!');
    }

    public function edit($requestFor)
    {
        if (!in_array($requestFor, ['all', 'featured', 'web-gallery'])) {
            abort(404);
        }
        // Get all files from the 'gallery' directory
        $files = Storage::disk('public')->allFiles('gallery');

        // Filter only image files (jpg, jpeg, png, gif, webp, bmp, svg)
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
        $images = array_filter($files, function ($file) use ($imageExtensions) {
            return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $imageExtensions);
        });

        // Convert storage paths to URLs
        $imageUrls = array_map(function ($path) {
            return '/storage/' . $path;
        }, $images);

        // Filter only video files (mp4, webm, ogg, mov, avi, mkv)
        $videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
        $videos = array_filter($files, function ($file) use ($videoExtensions) {
            return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $videoExtensions);
        });

        // Convert storage paths to URLs for videos
        $videoUrls = array_map(function ($path) {
            return '/storage/' . $path;
        }, $videos);

        // Merge images and videos into galleryItems
        $imageUrls = array_values($imageUrls);
        $videoUrls = array_values($videoUrls);
        $galleryItems = array_merge($imageUrls, $videoUrls);

        if (Storage::disk('public')->exists('featured_items.json')) {
            $featuredImages = json_decode(Storage::disk('public')->get('featured_items.json'), true) ?: [];
        } else {
            $featuredImages = [];
        }

        if (Storage::disk('public')->exists('gallery_items.json')) {
            $galleryImages = json_decode(Storage::disk('public')->get('gallery_items.json'), true) ?: [];
        } else {
            $galleryImages = [];
        }

        return inertia('admin/gallery', [
            'galleryItems' => $galleryItems,
            'featuredImages' => $featuredImages,
            'galleryImages' => $galleryImages,
            'featured' => $requestFor === 'featured',
            'webGallery' => $requestFor === 'web-gallery',
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'srcPath' => 'required|string',
            'featured' => 'boolean',
            'gallery' => 'boolean',
        ]);

        // Remove leading '/storage/' if present
        $srcPath = ltrim($validated['srcPath'], '/');
        if (str_starts_with($srcPath, 'storage/')) {
            $srcPath = substr($srcPath, strlen('storage/'));
        }

        $fullPath = '/storage/' . $srcPath;

        // Ensure featured_items.json exists
        if (!Storage::disk('public')->exists('featured_items.json')) {
            Storage::disk('public')->put('featured_items.json', json_encode([]));
        }
        $featuredImages = json_decode(Storage::disk('public')->get('featured_items.json'), true) ?: [];

        // Ensure gallery_items.json exists
        if (!Storage::disk('public')->exists('gallery_items.json')) {
            Storage::disk('public')->put('gallery_items.json', json_encode([]));
        }
        $galleryImages = json_decode(Storage::disk('public')->get('gallery_items.json'), true) ?: [];

        // Remove srcPath from both arrays
        $featuredImages = array_values(array_filter($featuredImages, fn($item) => $item !== $fullPath));
        $galleryImages = array_values(array_filter($galleryImages, fn($item) => $item !== $fullPath));

        // Add srcPath if needed
        if (!empty($validated['featured'])) {
            if (!in_array($fullPath, $featuredImages)) {
                $featuredImages[] = $fullPath;
            }
        }
        if (!empty($validated['gallery'])) {
            if (!in_array($fullPath, $galleryImages)) {
                $galleryImages[] = $fullPath;
            }
        }

        // Save back to storage
        Storage::disk('public')->put('featured_items.json', json_encode($featuredImages));
        Storage::disk('public')->put('gallery_items.json', json_encode($galleryImages));

        return redirect()->back()->with('message', 'Gallery file updated!');
    }

    public function destroy(Request $request)
    {
        $filePath = ltrim($request->input('filePath'), '/');
        if (str_starts_with($filePath, 'storage/')) {
            $filePath = substr($filePath, strlen('storage/'));
        }
        $fullPath = '/storage/' . $filePath;

        // Remove from featured_items.json
        if (Storage::disk('public')->exists('featured_items.json')) {
            $featuredImages = json_decode(Storage::disk('public')->get('featured_items.json'), true) ?: [];
            $featuredImages = array_values(array_filter($featuredImages, fn($item) => $item !== $fullPath));
            Storage::disk('public')->put('featured_items.json', json_encode($featuredImages));
        }

        // Remove from gallery_items.json
        if (Storage::disk('public')->exists('gallery_items.json')) {
            $galleryImages = json_decode(Storage::disk('public')->get('gallery_items.json'), true) ?: [];
            $galleryImages = array_values(array_filter($galleryImages, fn($item) => $item !== $fullPath));
            Storage::disk('public')->put('gallery_items.json', json_encode($galleryImages));
        }

        // Check if the file exists
        if (Storage::disk('public')->exists('gallery/' . basename($filePath))) {
            // Delete the file
            Storage::disk('public')->delete('gallery/' . basename($filePath));
            return redirect()->route('admin.gallery.edit', ['requestFor' => 'all'])->with('message', 'Selected file deleted successfully.');
        }

        return redirect()->back()->with('message', 'File not found.');
    }
}
