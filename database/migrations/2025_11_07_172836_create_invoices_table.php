<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Seller information
            $table->string('seller_name');
            $table->text('seller_address');
            $table->string('seller_registration')->nullable();
            $table->string('seller_vat_number')->nullable();

            // Client information
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone');
            $table->text('client_address');

            // Financial information
            $table->decimal('subtotal_ht', 10, 2);
            $table->decimal('vat_rate', 5, 2)->default(19.00);
            $table->decimal('vat_amount', 10, 2);
            $table->decimal('total_ttc', 10, 2);

            // Payment information
            $table->string('payment_method')->default('cash_on_delivery');
            $table->string('payment_status')->default('pending');

            // Invoice metadata
            $table->date('invoice_date');
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('draft'); // draft, sent, paid, cancelled

            $table->timestamps();

            $table->index(['invoice_number', 'created_at']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
