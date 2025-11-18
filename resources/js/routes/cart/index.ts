import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import items from './items'
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
const cart = {
    index: Object.assign(index, index),
items: Object.assign(items, items),
clear: Object.assign(clear, clear),
}

export default cart