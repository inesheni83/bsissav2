<?php

namespace App\Policies;

use App\Models\Pack;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PackPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admin et vendeur peuvent voir les packs
        return $user->role === 'admin' || $user->role === 'vendeur';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Pack $pack): bool
    {
        // Admin et vendeur peuvent voir tous les packs
        return $user->role === 'admin' || $user->role === 'vendeur';
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Admin et vendeur peuvent créer des packs
        return $user->role === 'admin' || $user->role === 'vendeur';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Pack $pack): bool
    {
        // Admin peut modifier tous les packs
        if ($user->role === 'admin') {
            return true;
        }

        // Vendeur peut modifier uniquement ses propres packs
        if ($user->role === 'vendeur') {
            return $pack->created_by === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Pack $pack): bool
    {
        // Admin peut supprimer tous les packs
        if ($user->role === 'admin') {
            return true;
        }

        // Vendeur peut supprimer uniquement ses propres packs
        if ($user->role === 'vendeur') {
            return $pack->created_by === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Pack $pack): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Pack $pack): bool
    {
        return $user->role === 'admin';
    }
}
