<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    /**
     * List districts (optionally paginated).
     */
    public function index(Request $request)
    {
        $query = District::query()->orderBy('name_bn')->orderBy('name');

        if ($request->has('division')) {
            $query->where('division', $request->division)
                  ->orWhere('division_bn', $request->division);
        }

        // If per_page given, return paginated; otherwise return all
        if ($request->has('per_page')) {
            $perPage = (int) $request->get('per_page', 50);
            return response()->json($query->paginate($perPage));
        }

        return response()->json($query->get());
    }
}


