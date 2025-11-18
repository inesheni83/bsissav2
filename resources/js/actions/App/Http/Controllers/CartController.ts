import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:21
 * @route '/cart'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:21
 * @route '/cart'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:21
 * @route '/cart'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:21
 * @route '/cart'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CartController::store
 * @see app/Http/Controllers/CartController.php:61
 * @route '/cart/items'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/cart/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartController::store
 * @see app/Http/Controllers/CartController.php:61
 * @route '/cart/items'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::store
 * @see app/Http/Controllers/CartController.php:61
 * @route '/cart/items'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CartController::update
 * @see app/Http/Controllers/CartController.php:72
 * @route '/cart/items/{cartItem}'
 */
export const update = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/cart/items/{cartItem}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\CartController::update
 * @see app/Http/Controllers/CartController.php:72
 * @route '/cart/items/{cartItem}'
 */
update.url = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cartItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cartItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cartItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cartItem: typeof args.cartItem === 'object'
                ? args.cartItem.id
                : args.cartItem,
                }

    return update.definition.url
            .replace('{cartItem}', parsedArgs.cartItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::update
 * @see app/Http/Controllers/CartController.php:72
 * @route '/cart/items/{cartItem}'
 */
update.patch = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CartController::destroy
 * @see app/Http/Controllers/CartController.php:84
 * @route '/cart/items/{cartItem}'
 */
export const destroy = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/cart/items/{cartItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CartController::destroy
 * @see app/Http/Controllers/CartController.php:84
 * @route '/cart/items/{cartItem}'
 */
destroy.url = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cartItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cartItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cartItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cartItem: typeof args.cartItem === 'object'
                ? args.cartItem.id
                : args.cartItem,
                }

    return destroy.definition.url
            .replace('{cartItem}', parsedArgs.cartItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::destroy
 * @see app/Http/Controllers/CartController.php:84
 * @route '/cart/items/{cartItem}'
 */
destroy.delete = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CartController::clear
 * @see app/Http/Controllers/CartController.php:97
 * @route '/cart'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/cart',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CartController::clear
 * @see app/Http/Controllers/CartController.php:97
 * @route '/cart'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::clear
 * @see app/Http/Controllers/CartController.php:97
 * @route '/cart'
 */
clear.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})
const CartController = { index, store, update, destroy, clear }

export default CartController