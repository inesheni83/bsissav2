import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import add26698a from './add'
/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})

add.definition = {
    methods: ["get","head"],
    url: '/add-product',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:24
 * @route '/add-product'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})
const product = {
    add: Object.assign(add, add26698a),
}

export default product