<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\OrderPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', Auth::id())
            ->with('deliveryFee')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(fn (Order $order) => OrderPresenter::summary($order));

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'statusMeta' => Order::STATUS_META,
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorizeOrder($order);

        $order->load('deliveryFee');

        return Inertia::render('orders/show', [
            'order' => OrderPresenter::detail($order),
            'statusMeta' => Order::STATUS_META,
        ]);
    }

    private function authorizeOrder(Order $order): void
    {
        $userId = Auth::id();

        abort_unless($order->user_id && $order->user_id === $userId, 403);
    }
}
