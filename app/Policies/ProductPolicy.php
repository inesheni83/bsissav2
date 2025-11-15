<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Tout le monde peut voir les produits
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Product $product): bool
    {
        return true; // Tout le monde peut voir un produit spécifique
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Seuls les utilisateurs authentifiés peuvent créer des produits
        return $user !== null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Product $product): bool
    {
        // L'utilisateur peut modifier son propre produit ou si c'est un admin
        return $user->id === $product->created_by || $this->isAdmin($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Product $product): bool
    {
        // L'utilisateur peut supprimer son propre produit ou si c'est un admin
        return $user->id === $product->created_by || $this->isAdmin($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Product $product): bool
    {
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Product $product): bool
    {
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can toggle featured status.
     */
    public function toggleFeatured(User $user, Product $product): bool
    {
        // Tout utilisateur authentifié peut gérer le statut featured
        // (cohérent avec la politique create qui permet à tous de créer des produits)
        return $user !== null;
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     */
    private function isAdmin(User $user): bool
    {
        // Vérifier si l'utilisateur a le rôle d'administrateur
        return $user->role === 'admin';
    }
}
