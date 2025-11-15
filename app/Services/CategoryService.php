<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    /**
     * Create a new category.
     */
    public function createCategory(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            $category = Category::create($data);

            return $category->fresh();
        });
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(Category $category, array $data): Category
    {
        return DB::transaction(function () use ($category, $data) {
            $category->update($data);

            return $category->fresh();
        });
    }

    /**
     * Delete the given category.
     */
    public function deleteCategory(Category $category): void
    {
        DB::transaction(function () use ($category) {
            $category->delete();
        });
    }

    /**
     * Get categories filtered by the provided options.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getFilteredCategories(array $filters = []): Builder
    {
        $query = Category::query()
            ->withCount('products')
            ->orderByDesc('created_at');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(fn (Builder $builder) => $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }

        return $query;
    }
}
