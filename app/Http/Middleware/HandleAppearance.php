<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Default to 'light' in production, 'system' in other environments
        $defaultAppearance = app()->environment('production') ? 'light' : 'system';

        View::share('appearance', $request->cookie('appearance') ?? $defaultAppearance);

        return $next($request);
    }
}
