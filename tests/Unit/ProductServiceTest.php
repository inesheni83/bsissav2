<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductServiceTest extends TestCase
{
    use RefreshDatabase;

    private ProductService $productService;
    private User $user;
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->productService = new ProductService();
        $this->user = User::factory()->create();
        $this->category = Category::factory()->create([
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Storage::fake('public');
    }

    /** @test */
    public function it_can_create_product_with_image()
    {
        $image = UploadedFile::fake()->image('product.jpg');

        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 29.99,
            'category_id' => $this->category->id,
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ];

        $product = $this->productService->createProduct($productData, $image);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Test Product', $product->name);
        Storage::disk('public')->assertExists($product->image);
    }

    /** @test */
    public function it_can_create_product_without_image()
    {
        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 29.99,
            'category_id' => $this->category->id,
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ];

        $product = $this->productService->createProduct($productData);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Test Product', $product->name);
        $this->assertNull($product->image);
    }

    /** @test */
    public function it_can_update_product_with_image()
    {
        $product = Product::factory()->create([
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $image = UploadedFile::fake()->image('new-product.jpg');

        $updateData = [
            'name' => 'Updated Product',
            'price' => 39.99,
            'updated_by' => $this->user->id,
        ];

        $updatedProduct = $this->productService->updateProduct($product, $updateData, $image);

        $this->assertEquals('Updated Product', $updatedProduct->name);
        $this->assertEquals(39.99, $updatedProduct->price);
        Storage::disk('public')->assertExists($updatedProduct->image);
    }

    /** @test */
    public function it_deletes_old_image_when_updating_with_new_image()
    {
        $product = Product::factory()->create([
            'image' => 'products/old-image.jpg',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Créer le fichier factice
        Storage::disk('public')->put('products/old-image.jpg', 'fake content');

        $image = UploadedFile::fake()->image('new-product.jpg');

        $updateData = [
            'name' => 'Updated Product',
            'updated_by' => $this->user->id,
        ];

        $this->productService->updateProduct($product, $updateData, $image);

        // L'ancienne image devrait être supprimée
        Storage::disk('public')->assertMissing('products/old-image.jpg');
        // La nouvelle image devrait exister
        Storage::disk('public')->assertExists($product->fresh()->image);
    }

    /** @test */
    public function it_can_delete_product_and_its_image()
    {
        $product = Product::factory()->create([
            'image' => 'products/product-to-delete.jpg',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Créer le fichier factice
        Storage::disk('public')->put('products/product-to-delete.jpg', 'fake content');

        $result = $this->productService->deleteProduct($product);

        $this->assertTrue($result);
        $this->assertModelMissing($product);
        Storage::disk('public')->assertMissing('products/product-to-delete.jpg');
    }

    /** @test */
    public function it_can_toggle_featured_status()
    {
        $product = Product::factory()->create([
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $updatedProduct = $this->productService->toggleFeatured($product);

        $this->assertTrue($updatedProduct->is_featured);
        $this->assertEquals($this->user->id, $updatedProduct->updated_by);
    }

    /** @test */
    public function it_can_filter_products_by_search()
    {
        Product::factory()->create([
            'name' => 'Bsissa Premium',
            'description' => 'Traditional Tunisian product',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Product::factory()->create([
            'name' => 'Other Product',
            'description' => 'Different product',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $query = $this->productService->getFilteredProducts(['search' => 'Bsissa']);

        $this->assertEquals(1, $query->count());
        $this->assertEquals('Bsissa Premium', $query->first()->name);
    }

    /** @test */
    public function it_can_filter_products_by_category()
    {
        $otherCategory = Category::factory()->create([
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Product::factory()->create([
            'category_id' => $this->category->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Product::factory()->create([
            'category_id' => $otherCategory->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $query = $this->productService->getFilteredProducts(['category_id' => $this->category->id]);

        $this->assertEquals(1, $query->count());
        $this->assertEquals($this->category->id, $query->first()->category_id);
    }

    /** @test */
    public function it_can_filter_featured_products()
    {
        Product::factory()->create([
            'is_featured' => true,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Product::factory()->create([
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $query = $this->productService->getFilteredProducts(['featured' => true]);

        $this->assertEquals(1, $query->count());
        $this->assertTrue($query->first()->is_featured);
    }

    /** @test */
    public function it_can_get_product_statistics()
    {
        Product::factory()->create([
            'is_featured' => true,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Product::factory()->create([
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $stats = $this->productService->getProductStats();

        $this->assertEquals(2, $stats['total_products']);
        $this->assertEquals(1, $stats['featured_products']);
        $this->assertEquals(1, $stats['in_stock_products']);
        $this->assertEquals(1, $stats['out_of_stock_products']);
    }
}
