import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SellerDashboardController::index
 * @see app/Http/Controllers/SellerDashboardController.php:18
 * @route '/dashboardSeller'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboardSeller',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SellerDashboardController::index
 * @see app/Http/Controllers/SellerDashboardController.php:18
 * @route '/dashboardSeller'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerDashboardController::index
 * @see app/Http/Controllers/SellerDashboardController.php:18
 * @route '/dashboardSeller'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SellerDashboardController::index
 * @see app/Http/Controllers/SellerDashboardController.php:18
 * @route '/dashboardSeller'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const SellerDashboardController = { index }

export default SellerDashboardController