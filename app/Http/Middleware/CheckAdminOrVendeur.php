<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminOrVendeur
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // Check if user has admin or vendeur role
        $user = auth()->user();
        if (!in_array($user->role, ['admin', 'vendeur'])) {
            abort(403, 'Accès non autorisé. Cette page est réservée aux administrateurs et vendeurs.');
        }

        return $next($request);
    }
}
