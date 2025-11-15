<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->category = Category::factory()->create([
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
    }

    /** @test */
    public function it_can_create_a_product()
    {
        $productData = [
            'name' => 'Test Product',
            'description' => 'This is a test product',
            'price' => 29.99,
            'category_id' => $this->category->id,
            'stock_quantity' => 10,
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ];

        $product = Product::create($productData);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Test Product', $product->name);
        $this->assertEquals(29.99, $product->price);
        $this->assertEquals($this->category->id, $product->category_id);
        $this->assertFalse($product->is_featured);
    }

    /** @test */
    public function it_generates_slug_automatically()
    {
        $product = Product::factory()->create([
            'name' => 'Test Product Name',
            'slug' => null, // Pas de slug fourni
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $this->assertNotNull($product->slug);
        $this->assertEquals('test-product-name', $product->slug);
    }

    /** @test */
    public function it_generates_unique_slugs()
    {
        $product1 = Product::factory()->create([
            'name' => 'Test Product',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $product2 = Product::factory()->create([
            'name' => 'Test Product',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $this->assertNotEquals($product1->slug, $product2->slug);
        $this->assertStringContains('test-product', $product1->slug);
        $this->assertStringContains('test-product', $product2->slug);
    }

    /** @test */
    public function it_belongs_to_category()
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $this->assertInstanceOf(Category::class, $product->category);
        $this->assertEquals($this->category->id, $product->category->id);
    }

    /** @test */
    public function it_can_check_if_in_stock()
    {
        $inStockProduct = Product::factory()->create([
            'stock_quantity' => 10,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $outOfStockProduct = Product::factory()->create([
            'stock_quantity' => 0,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $this->assertTrue($inStockProduct->isInStock());
        $this->assertFalse($outOfStockProduct->isInStock());
    }

    /** @test */
    public function it_casts_price_as_decimal()
    {
        $product = Product::factory()->create([
            'price' => 29.99,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $this->assertIsFloat($product->price);
        $this->assertEquals(29.99, $product->price);
    }

    /** @test */
    public function it_casts_is_featured_as_boolean()
    {
        $featuredProduct = Product::factory()->create([
            'is_featured' => true,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $normalProduct = Product::factory()->create([
            'is_featured' => false,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $this->assertIsBool($featuredProduct->is_featured);
        $this->assertTrue($featuredProduct->is_featured);
        $this->assertFalse($normalProduct->is_featured);
    }

    /** @test */
    public function it_can_scope_featured_products()
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

        $featuredProducts = Product::featured()->get();

        $this->assertEquals(1, $featuredProducts->count());
        $this->assertTrue($featuredProducts->first()->is_featured);
    }

    /** @test */
    public function it_can_scope_products_in_stock()
    {
        Product::factory()->create([
            'stock_quantity' => 10,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        Product::factory()->create([
            'stock_quantity' => 0,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $inStockProducts = Product::inStock()->get();

        $this->assertEquals(1, $inStockProducts->count());
        $this->assertGreaterThan(0, $inStockProducts->first()->stock_quantity);
    }

    /** @test */
    public function it_validates_price_cannot_be_negative()
    {
        $product = new Product([
            'price' => -10.00,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $product->setPriceAttribute(-10.00);

        // Le mutateur devrait convertir les valeurs négatives en positives
        $this->assertEquals(10.00, $product->price);
    }

    /** @test */
    public function it_validates_stock_quantity_cannot_be_negative()
    {
        $product = new Product([
            'stock_quantity' => -5,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $product->setStockQuantityAttribute(-5);

        // Le mutateur devrait définir une valeur par défaut de 0 pour les valeurs négatives
        $this->assertEquals(0, $product->stock_quantity);
    }
}
