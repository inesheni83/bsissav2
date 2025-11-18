import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::index
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:14
 * @route '/admin/delivery-fees'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/delivery-fees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::index
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:14
 * @route '/admin/delivery-fees'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::index
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:14
 * @route '/admin/delivery-fees'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::index
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:14
 * @route '/admin/delivery-fees'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::create
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:57
 * @route '/admin/delivery-fees/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/delivery-fees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::create
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:57
 * @route '/admin/delivery-fees/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::create
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:57
 * @route '/admin/delivery-fees/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::create
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:57
 * @route '/admin/delivery-fees/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::store
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:62
 * @route '/admin/delivery-fees'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/delivery-fees',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::store
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:62
 * @route '/admin/delivery-fees'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::store
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:62
 * @route '/admin/delivery-fees'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::edit
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:79
 * @route '/admin/delivery-fees/{deliveryFee}/edit'
 */
export const edit = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/delivery-fees/{deliveryFee}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::edit
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:79
 * @route '/admin/delivery-fees/{deliveryFee}/edit'
 */
edit.url = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deliveryFee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { deliveryFee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    deliveryFee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        deliveryFee: typeof args.deliveryFee === 'object'
                ? args.deliveryFee.id
                : args.deliveryFee,
                }

    return edit.definition.url
            .replace('{deliveryFee}', parsedArgs.deliveryFee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::edit
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:79
 * @route '/admin/delivery-fees/{deliveryFee}/edit'
 */
edit.get = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::edit
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:79
 * @route '/admin/delivery-fees/{deliveryFee}/edit'
 */
edit.head = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::update
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:93
 * @route '/admin/delivery-fees/{deliveryFee}'
 */
export const update = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/delivery-fees/{deliveryFee}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::update
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:93
 * @route '/admin/delivery-fees/{deliveryFee}'
 */
update.url = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deliveryFee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { deliveryFee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    deliveryFee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        deliveryFee: typeof args.deliveryFee === 'object'
                ? args.deliveryFee.id
                : args.deliveryFee,
                }

    return update.definition.url
            .replace('{deliveryFee}', parsedArgs.deliveryFee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::update
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:93
 * @route '/admin/delivery-fees/{deliveryFee}'
 */
update.put = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::destroy
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:110
 * @route '/admin/delivery-fees/{deliveryFee}'
 */
export const destroy = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/delivery-fees/{deliveryFee}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::destroy
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:110
 * @route '/admin/delivery-fees/{deliveryFee}'
 */
destroy.url = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { deliveryFee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { deliveryFee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    deliveryFee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        deliveryFee: typeof args.deliveryFee === 'object'
                ? args.deliveryFee.id
                : args.deliveryFee,
                }

    return destroy.definition.url
            .replace('{deliveryFee}', parsedArgs.deliveryFee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryFee\DeliveryFeeController::destroy
 * @see app/Http/Controllers/DeliveryFee/DeliveryFeeController.php:110
 * @route '/admin/delivery-fees/{deliveryFee}'
 */
destroy.delete = (args: { deliveryFee: number | { id: number } } | [deliveryFee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const DeliveryFeeController = { index, create, store, edit, update, destroy }

export default DeliveryFeeController