<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use HasinHayder\Tyro\Concerns\HasTyroRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasTyroRoles;

    // Tyro role slugs (these will be seeded by Tyro)
    public const ROLE_SUPER_ADMIN      = 'super-admin';
    public const ROLE_CANDIDATE_ADMIN  = 'candidate-admin';
    public const ROLE_TEAM_MEMBER      = 'team-member';
    public const ROLE_VOLUNTEER        = 'volunteer';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Single candidate relationship (backward compatibility)
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Many-to-many relationship with candidates
     */
    public function candidates()
    {
        return $this->belongsToMany(Candidate::class, 'candidate_user')
            ->withTimestamps();
    }
}
