<?php

namespace App\Http\Controllers;

use App\Services\SellerDashboardService;
use Inertia\Inertia;
use Inertia\Response;

class SellerDashboardController extends Controller
{
    public function __construct(
        private SellerDashboardService $dashboardService
    ) {}

    /**
     * Display the seller dashboard.
     */
    public function index(): Response
    {
        $stats = $this->dashboardService->getDashboardStats();

        return Inertia::render('dashboardSeller', [
            'stats' => $stats,
        ]);
    }
}
