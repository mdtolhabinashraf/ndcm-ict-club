<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitorsController extends Controller
{
    public function show()
    {
        $visitors = DB::table('sessions')->get();
        $currentUserIp = request()->ip();
        $currentUserAgent = request()->userAgent();

        return inertia('admin/visitors', [
            'visitors' => $visitors,
            'currentUserIp' => $currentUserIp,
            'currentUserAgent' => $currentUserAgent,
        ]);
    }
}
