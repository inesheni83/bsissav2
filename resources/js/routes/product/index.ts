import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import add26698a from './add'
/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:23
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
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
add.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: add.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
add.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: add.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: add.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
        addForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Product\AddProductController::add
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
        addForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: add.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    add.form = addForm
const product = {
    add: Object.assign(add, add26698a),
}

export default product