import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Product\ProductListController::index
 * @see app/Http/Controllers/Product/ProductListController.php:23
 * @route '/products'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Product\ProductListController::index
 * @see app/Http/Controllers/Product/ProductListController.php:23
 * @route '/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\ProductListController::index
 * @see app/Http/Controllers/Product/ProductListController.php:23
 * @route '/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Product\ProductListController::index
 * @see app/Http/Controllers/Product/ProductListController.php:23
 * @route '/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const ProductListController = { index }

export default ProductListController