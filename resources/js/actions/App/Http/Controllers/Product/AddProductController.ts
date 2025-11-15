import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:23
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
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Product\AddProductController::create
 * @see app/Http/Controllers/Product/AddProductController.php:23
 * @route '/add-product'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
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
const AddProductController = { create, store }

export default AddProductController