import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:35
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
 * @see app/Http/Controllers/Product/AddProductController.php:35
 * @route '/add-product'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:35
 * @route '/add-product'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:35
 * @route '/add-product'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Product\AddProductController::store
 * @see app/Http/Controllers/Product/AddProductController.php:35
 * @route '/add-product'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const add = {
    store: Object.assign(store, store),
}

export default add