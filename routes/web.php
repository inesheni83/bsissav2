<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Product\AddProductController;
use App\Http\Controllers\Product\ProductListController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Order\AdminOrderController;
use App\Http\Controllers\Product\ProductViewController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\DeliveryFee\DeliveryFeeController;
use App\Http\Controllers\GalleryImage\GalleryImageController;
use App\Http\Controllers\SellerDashboardController;
use App\Http\Controllers\Settings\SiteSettingsController;
use App\Http\Controllers\Customer\CustomerController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');

// Public product detail route (accessible to all)
Route::get('/products/{product}', [ProductViewController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/items', [CartController::class, 'store'])->name('cart.items.store');
Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])->name('cart.items.update');
Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.items.destroy');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/confirmation/{order}', [CheckoutController::class, 'confirmation'])->name('checkout.confirmation');

// Customer routes (authenticated users)
Route::middleware(['auth', 'verified'])->group(function () {
    // Customer orders routes
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

// Admin and Vendeur routes
Route::middleware(['auth', 'verified', 'admin.vendeur'])->group(function () {
    Route::get('dashboardSeller', [SellerDashboardController::class, 'index'])->name('dashboardSeller');

    Route::get('/add-product', [AddProductController::class, 'create'])->name('product.add');
    Route::post('/add-product', [AddProductController::class, 'store'])->name('product.add.store');

    // Admin orders management routes
    Route::get('/admin/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/admin/orders/{order}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
    Route::patch('/admin/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
    Route::get('/admin/orders/{order}/invoice', [AdminOrderController::class, 'generateInvoice'])->name('admin.orders.generateInvoice');

    // Admin invoices management routes
    Route::get('/admin/invoices', [InvoiceController::class, 'index'])->name('admin.invoices.index');
    Route::get('/admin/invoices/{invoice}/download', [InvoiceController::class, 'download'])->name('admin.invoices.download');
    Route::post('/admin/orders/{order}/create-invoice', [InvoiceController::class, 'createFromOrder'])->name('admin.invoices.create');
    Route::patch('/admin/invoices/{invoice}/status', [InvoiceController::class, 'updateStatus'])->name('admin.invoices.updateStatus');
    Route::patch('/admin/invoices/{invoice}/payment-status', [InvoiceController::class, 'updatePaymentStatus'])->name('admin.invoices.updatePaymentStatus');

    // Admin delivery fees management routes
    Route::get('/admin/delivery-fees', [DeliveryFeeController::class, 'index'])->name('admin.delivery-fees.index');
    Route::get('/admin/delivery-fees/create', [DeliveryFeeController::class, 'create'])->name('admin.delivery-fees.create');
    Route::post('/admin/delivery-fees', [DeliveryFeeController::class, 'store'])->name('admin.delivery-fees.store');
    Route::get('/admin/delivery-fees/{deliveryFee}/edit', [DeliveryFeeController::class, 'edit'])->name('admin.delivery-fees.edit');
    Route::put('/admin/delivery-fees/{deliveryFee}', [DeliveryFeeController::class, 'update'])->name('admin.delivery-fees.update');
    Route::delete('/admin/delivery-fees/{deliveryFee}', [DeliveryFeeController::class, 'destroy'])->name('admin.delivery-fees.destroy');

    // Admin gallery images management routes
    Route::get('/admin/gallery-images', [GalleryImageController::class, 'index'])->name('gallery-images.index');
    Route::get('/admin/gallery-images/create', [GalleryImageController::class, 'create'])->name('gallery-images.create');
    Route::post('/admin/gallery-images', [GalleryImageController::class, 'store'])->name('gallery-images.store');
    Route::get('/admin/gallery-images/{galleryImage}/edit', [GalleryImageController::class, 'edit'])->name('gallery-images.edit');
    Route::put('/admin/gallery-images/{galleryImage}', [GalleryImageController::class, 'update'])->name('gallery-images.update');
    Route::delete('/admin/gallery-images/{galleryImage}', [GalleryImageController::class, 'destroy'])->name('gallery-images.destroy');

    // Admin customers management routes
    Route::get('/admin/customers', [CustomerController::class, 'index'])->name('admin.customers.index');
    Route::get('/admin/customers/export', [CustomerController::class, 'export'])->name('admin.customers.export');

    // Admin site settings routes
    Route::get('/admin/settings/site', [SiteSettingsController::class, 'index'])->name('admin.settings.site');
    Route::post('/admin/settings/site', [SiteSettingsController::class, 'update'])->name('admin.settings.site.update');
    Route::delete('/admin/settings/site/logo', [SiteSettingsController::class, 'deleteLogo'])->name('admin.settings.site.deleteLogo');

    Route::resource('categories', CategoryController::class)->except(['show']);

    // Product management routes
    Route::get('/products', [ProductListController::class, 'index'])->name('products.index');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::patch('/products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
