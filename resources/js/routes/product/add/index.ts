import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
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
const add = {
    store: Object.assign(store, store),
}

export default add