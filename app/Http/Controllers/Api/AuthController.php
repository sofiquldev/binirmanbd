<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is suspended
        if ($user->isSuspended()) {
            return response()->json([
                'error' => 'Account suspended',
                'reason' => $user->getSuspensionReason(),
            ], 423);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles'),
            'token' => $token,
            'abilities' => $user->tyroRoleSlugs(),
            'privileges' => $user->tyroPrivilegeSlugs(),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'abilities' => $user->tyroRoleSlugs(),
            'privileges' => $user->tyroPrivilegeSlugs(),
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        // Load roles, the linked candidate (if any), and all assigned candidates
        $user = $request->user()->load([
            'roles',
            'candidate', // user belongsTo Candidate via candidate_id (backward compatibility)
            'candidates', // many-to-many relationship
        ]);
        
        return response()->json([
            'user' => $user,
            'abilities' => $user->tyroRoleSlugs(),
            'privileges' => $user->tyroPrivilegeSlugs(),
        ]);
    }
}
