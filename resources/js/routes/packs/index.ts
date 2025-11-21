import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Pack\PackController::index
 * @see app/Http/Controllers/Pack/PackController.php:24
 * @route '/admin/packs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/packs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pack\PackController::index
 * @see app/Http/Controllers/Pack/PackController.php:24
 * @route '/admin/packs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::index
 * @see app/Http/Controllers/Pack/PackController.php:24
 * @route '/admin/packs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pack\PackController::index
 * @see app/Http/Controllers/Pack/PackController.php:24
 * @route '/admin/packs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Pack\PackController::create
 * @see app/Http/Controllers/Pack/PackController.php:41
 * @route '/admin/packs/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/packs/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pack\PackController::create
 * @see app/Http/Controllers/Pack/PackController.php:41
 * @route '/admin/packs/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::create
 * @see app/Http/Controllers/Pack/PackController.php:41
 * @route '/admin/packs/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pack\PackController::create
 * @see app/Http/Controllers/Pack/PackController.php:41
 * @route '/admin/packs/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Pack\PackController::store
 * @see app/Http/Controllers/Pack/PackController.php:64
 * @route '/admin/packs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/packs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Pack\PackController::store
 * @see app/Http/Controllers/Pack/PackController.php:64
 * @route '/admin/packs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::store
 * @see app/Http/Controllers/Pack/PackController.php:64
 * @route '/admin/packs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Pack\PackController::show
 * @see app/Http/Controllers/Pack/PackController.php:115
 * @route '/admin/packs/{pack}'
 */
export const show = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/packs/{pack}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pack\PackController::show
 * @see app/Http/Controllers/Pack/PackController.php:115
 * @route '/admin/packs/{pack}'
 */
show.url = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pack: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pack: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pack: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pack: typeof args.pack === 'object'
                ? args.pack.id
                : args.pack,
                }

    return show.definition.url
            .replace('{pack}', parsedArgs.pack.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::show
 * @see app/Http/Controllers/Pack/PackController.php:115
 * @route '/admin/packs/{pack}'
 */
show.get = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pack\PackController::show
 * @see app/Http/Controllers/Pack/PackController.php:115
 * @route '/admin/packs/{pack}'
 */
show.head = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Pack\PackController::edit
 * @see app/Http/Controllers/Pack/PackController.php:129
 * @route '/admin/packs/{pack}/edit'
 */
export const edit = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/packs/{pack}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Pack\PackController::edit
 * @see app/Http/Controllers/Pack/PackController.php:129
 * @route '/admin/packs/{pack}/edit'
 */
edit.url = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pack: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pack: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pack: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pack: typeof args.pack === 'object'
                ? args.pack.id
                : args.pack,
                }

    return edit.definition.url
            .replace('{pack}', parsedArgs.pack.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::edit
 * @see app/Http/Controllers/Pack/PackController.php:129
 * @route '/admin/packs/{pack}/edit'
 */
edit.get = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Pack\PackController::edit
 * @see app/Http/Controllers/Pack/PackController.php:129
 * @route '/admin/packs/{pack}/edit'
 */
edit.head = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Pack\PackController::update
 * @see app/Http/Controllers/Pack/PackController.php:155
 * @route '/admin/packs/{pack}'
 */
export const update = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/packs/{pack}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Pack\PackController::update
 * @see app/Http/Controllers/Pack/PackController.php:155
 * @route '/admin/packs/{pack}'
 */
update.url = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pack: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pack: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pack: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pack: typeof args.pack === 'object'
                ? args.pack.id
                : args.pack,
                }

    return update.definition.url
            .replace('{pack}', parsedArgs.pack.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::update
 * @see app/Http/Controllers/Pack/PackController.php:155
 * @route '/admin/packs/{pack}'
 */
update.put = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Pack\PackController::duplicate
 * @see app/Http/Controllers/Pack/PackController.php:224
 * @route '/admin/packs/{pack}/duplicate'
 */
export const duplicate = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
})

duplicate.definition = {
    methods: ["post"],
    url: '/admin/packs/{pack}/duplicate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Pack\PackController::duplicate
 * @see app/Http/Controllers/Pack/PackController.php:224
 * @route '/admin/packs/{pack}/duplicate'
 */
duplicate.url = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pack: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pack: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pack: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pack: typeof args.pack === 'object'
                ? args.pack.id
                : args.pack,
                }

    return duplicate.definition.url
            .replace('{pack}', parsedArgs.pack.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::duplicate
 * @see app/Http/Controllers/Pack/PackController.php:224
 * @route '/admin/packs/{pack}/duplicate'
 */
duplicate.post = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Pack\PackController::destroy
 * @see app/Http/Controllers/Pack/PackController.php:205
 * @route '/admin/packs/{pack}'
 */
export const destroy = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/packs/{pack}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Pack\PackController::destroy
 * @see app/Http/Controllers/Pack/PackController.php:205
 * @route '/admin/packs/{pack}'
 */
destroy.url = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pack: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { pack: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    pack: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pack: typeof args.pack === 'object'
                ? args.pack.id
                : args.pack,
                }

    return destroy.definition.url
            .replace('{pack}', parsedArgs.pack.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Pack\PackController::destroy
 * @see app/Http/Controllers/Pack/PackController.php:205
 * @route '/admin/packs/{pack}'
 */
destroy.delete = (args: { pack: number | { id: number } } | [pack: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const packs = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
duplicate: Object.assign(duplicate, duplicate),
destroy: Object.assign(destroy, destroy),
}

export default packs