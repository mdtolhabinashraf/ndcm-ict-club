<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Event;
use Carbon\Carbon;

class BackupController extends Controller
{
    public function backup(Request $request)
    {
        $finalBackupPath = storage_path('backups/backup');

        try {
            // 1. Clean previous backup if exists
            if (File::exists($finalBackupPath)) {
                File::deleteDirectory($finalBackupPath);
            }
            File::makeDirectory($finalBackupPath, 0755, true);

            // 2. Save backup data directly to backup directory
            $backupMeta = [
                'last_backup' => Carbon::now()->setTimezone('Asia/Dhaka')->toDateTimeString(),
            ];
            File::put($finalBackupPath . '/backup.json', json_encode($backupMeta, JSON_PRETTY_PRINT));

            $events = Event::all();
            File::put($finalBackupPath . '/events.json', $events->toJson(JSON_PRETTY_PRINT));

            File::copyDirectory(storage_path('app'), $finalBackupPath . '/storage_app');
            File::copyDirectory(public_path(), $finalBackupPath . '/public');

            // 3. Also update backup.json in storage/app if needed
            Storage::disk('local')->put('backup.json', json_encode($backupMeta, JSON_PRETTY_PRINT));

            return response()->json([
                'success' => 'Backed up successfully.'
            ]);
        } catch (\Exception $e) {
            // Clean up backup directory if exists
            if (File::exists($finalBackupPath)) {
                File::deleteDirectory($finalBackupPath);
            }

            return response()->json([
                'error' => 'Backup failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function load()
    {
        $backupPath = storage_path('backups/backup');
        $appPath = storage_path('app');
        $publicPath = public_path();

        // Check if backup files exist
        if (
            !File::exists($backupPath . '/events.json') ||
            !File::exists($backupPath . '/storage_app') ||
            !File::exists($backupPath . '/public')
        ) {
            return response()->json([
                'error' => 'Backup files not found to restore.'
            ], 404);
        }

        $backupMetaPath = $backupPath . '/backup.json';
        $timestamp = now()->format('Ymd_His');
        $tempBackupDir = storage_path("backups/temp_restore_backup_{$timestamp}");

        try {
            // Backup current app and public folders
            File::makeDirectory($tempBackupDir, 0755, true);
            if (File::exists($appPath)) {
                File::copyDirectory($appPath, $tempBackupDir . '/app');
            }
            if (File::exists($publicPath)) {
                File::copyDirectory($publicPath, $tempBackupDir . '/public');
            }

            // Restore app folder from backup
            File::deleteDirectory($appPath);
            File::copyDirectory($backupPath . '/storage_app', $appPath);

            // Move only favicon and apple-touch-icon from backup/public to public
            $icons = [
                'favicon.ico',
                'apple-touch-icon.png',
            ];
            foreach ($icons as $icon) {
                $src = $backupPath . '/public/' . $icon;
                $dest = $publicPath . '/' . $icon;
                if (File::exists($src)) {
                    File::copy($src, $dest);
                }
            }

            // Restore database data
            $eventsJson = File::get($backupPath . '/events.json');

            $events = json_decode($eventsJson, true);

            Event::truncate();

            Event::insert($events);

            // Set last_load in backup.json (both in backup dir and storage/app)
            $backupMetaPath = $backupPath . '/backup.json';
            $backupMeta = [];
            if (File::exists($backupMetaPath)) {
                $backupMeta = json_decode(File::get($backupMetaPath), true) ?? [];
            }
            $backupMeta['last_load'] = Carbon::now()->setTimezone('Asia/Dhaka')->toDateTimeString();
            File::put($backupMetaPath, json_encode($backupMeta, JSON_PRETTY_PRINT));
            Storage::disk('local')->put('backup.json', json_encode($backupMeta, JSON_PRETTY_PRINT));

            // Clean up temp backup after successful restore
            File::deleteDirectory($tempBackupDir);

            return response()->json([
                'success' => 'Backup data restored successfully.'
            ]);
        } catch (\Exception $e) {
            // If error, restore old app and public folders
            if (File::exists($tempBackupDir . '/app')) {
                File::deleteDirectory($appPath);
                File::copyDirectory($tempBackupDir . '/app', $appPath);
            }
            if (File::exists($tempBackupDir . '/public')) {
                File::deleteDirectory($publicPath);
                File::copyDirectory($tempBackupDir . '/public', $publicPath);
            }
            // Clean up temp backup
            File::deleteDirectory($tempBackupDir);

            return response()->json([
                'error' => 'Restore failed. Old state restored. Reason: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy()
    {
        $backupPath = storage_path('backups/backup');

        if (File::exists($backupPath)) {
            File::deleteDirectory($backupPath);
            return response()->json([
                'success' => 'Backup deleted successfully.'
            ]);
        }

        return response()->json([
            'error' => 'Backup files not found to delete.'
        ], 404);
    }

    public function get()
    {
        $backupPath = storage_path('backups/backup');

        if (
            !File::exists($backupPath . '/events.json') ||
            !File::exists($backupPath . '/storage_app') ||
            !File::exists($backupPath . '/public')
        ) {
            return inertia('admin/backup');
        }

        if (Storage::disk('local')->exists('backup.json')) {
            $json = Storage::disk('local')->get('backup.json');
            $data = json_decode($json, true);
            return inertia('admin/backup', [
                'lastBackup' => $data['last_backup'] ?? null,
                'lastLoad' => $data['last_load'] ?? null,
            ]);
        }

        return inertia('admin/backup');
    }
}
