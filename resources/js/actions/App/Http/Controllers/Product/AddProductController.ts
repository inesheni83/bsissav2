import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/add-product',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:36
 * @route '/add-product'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/add-product',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:36
 * @route '/add-product'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:36
 * @route '/add-product'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const AddProductController = { create, store }

export default AddProductController