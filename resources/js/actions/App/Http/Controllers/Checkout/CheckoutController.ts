import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Checkout\CheckoutController::show
 * @see app/Http/Controllers/Checkout/CheckoutController.php:23
 * @route '/checkout'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::show
 * @see app/Http/Controllers/Checkout/CheckoutController.php:23
 * @route '/checkout'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::show
 * @see app/Http/Controllers/Checkout/CheckoutController.php:23
 * @route '/checkout'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Checkout\CheckoutController::show
 * @see app/Http/Controllers/Checkout/CheckoutController.php:23
 * @route '/checkout'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::store
 * @see app/Http/Controllers/Checkout/CheckoutController.php:66
 * @route '/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::store
 * @see app/Http/Controllers/Checkout/CheckoutController.php:66
 * @route '/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::store
 * @see app/Http/Controllers/Checkout/CheckoutController.php:66
 * @route '/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::confirmation
 * @see app/Http/Controllers/Checkout/CheckoutController.php:93
 * @route '/checkout/confirmation/{order}'
 */
export const confirmation = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(args, options),
    method: 'get',
})

confirmation.definition = {
    methods: ["get","head"],
    url: '/checkout/confirmation/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::confirmation
 * @see app/Http/Controllers/Checkout/CheckoutController.php:93
 * @route '/checkout/confirmation/{order}'
 */
confirmation.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return confirmation.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Checkout\CheckoutController::confirmation
 * @see app/Http/Controllers/Checkout/CheckoutController.php:93
 * @route '/checkout/confirmation/{order}'
 */
confirmation.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirmation.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Checkout\CheckoutController::confirmation
 * @see app/Http/Controllers/Checkout/CheckoutController.php:93
 * @route '/checkout/confirmation/{order}'
 */
confirmation.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirmation.url(args, options),
    method: 'head',
})
const CheckoutController = { show, store, confirmation }

export default CheckoutController