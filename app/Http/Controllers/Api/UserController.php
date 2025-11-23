<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with(['roles', 'candidate']);

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $role = $request->get('role');
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('slug', $role);
            });
        }

        // Filter by candidate
        if ($request->has('candidate_id')) {
            $query->where('candidate_id', $request->get('candidate_id'));
        }

        $users = $query->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'candidate_id' => 'nullable|exists:candidates,id',
            'roles' => 'required|array|min:1',
            'roles.*' => 'required|string|exists:roles,slug',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'candidate_id' => $validated['candidate_id'] ?? null,
        ]);

        // Assign roles
        foreach ($validated['roles'] as $roleSlug) {
            $role = \HasinHayder\Tyro\Models\Role::where('slug', $roleSlug)->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }
        }

        return response()->json($user->load('roles', 'candidate'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(['roles', 'candidate'])->findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'candidate_id' => 'nullable|exists:candidates,id',
            'roles' => 'sometimes|array|min:1',
            'roles.*' => 'required|string|exists:roles,slug',
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Update roles if provided
        if (isset($validated['roles'])) {
            $roleIds = [];
            foreach ($validated['roles'] as $roleSlug) {
                $role = \HasinHayder\Tyro\Models\Role::where('slug', $roleSlug)->first();
                if ($role) {
                    $roleIds[] = $role->id;
                }
            }
            $user->roles()->sync($roleIds);
        }

        return response()->json($user->load('roles', 'candidate'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting the last super-admin
        if ($user->hasRole(User::ROLE_SUPER_ADMIN)) {
            $superAdminCount = User::whereHas('roles', function ($q) {
                $q->where('slug', User::ROLE_SUPER_ADMIN);
            })->count();

            if ($superAdminCount <= 1) {
                return response()->json([
                    'error' => 'Cannot delete the last super admin user.'
                ], 422);
            }
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
