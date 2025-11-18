import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::index
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:21
 * @route '/admin/gallery-images'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/gallery-images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::index
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:21
 * @route '/admin/gallery-images'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::index
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:21
 * @route '/admin/gallery-images'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::index
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:21
 * @route '/admin/gallery-images'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::create
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:38
 * @route '/admin/gallery-images/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/gallery-images/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::create
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:38
 * @route '/admin/gallery-images/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::create
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:38
 * @route '/admin/gallery-images/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::create
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:38
 * @route '/admin/gallery-images/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::store
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:48
 * @route '/admin/gallery-images'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/gallery-images',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::store
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:48
 * @route '/admin/gallery-images'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::store
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:48
 * @route '/admin/gallery-images'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::edit
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:77
 * @route '/admin/gallery-images/{galleryImage}/edit'
 */
export const edit = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/gallery-images/{galleryImage}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::edit
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:77
 * @route '/admin/gallery-images/{galleryImage}/edit'
 */
edit.url = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { galleryImage: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { galleryImage: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    galleryImage: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        galleryImage: typeof args.galleryImage === 'object'
                ? args.galleryImage.id
                : args.galleryImage,
                }

    return edit.definition.url
            .replace('{galleryImage}', parsedArgs.galleryImage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::edit
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:77
 * @route '/admin/gallery-images/{galleryImage}/edit'
 */
edit.get = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::edit
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:77
 * @route '/admin/gallery-images/{galleryImage}/edit'
 */
edit.head = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::update
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:89
 * @route '/admin/gallery-images/{galleryImage}'
 */
export const update = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/gallery-images/{galleryImage}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::update
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:89
 * @route '/admin/gallery-images/{galleryImage}'
 */
update.url = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { galleryImage: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { galleryImage: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    galleryImage: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        galleryImage: typeof args.galleryImage === 'object'
                ? args.galleryImage.id
                : args.galleryImage,
                }

    return update.definition.url
            .replace('{galleryImage}', parsedArgs.galleryImage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::update
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:89
 * @route '/admin/gallery-images/{galleryImage}'
 */
update.put = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::destroy
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:122
 * @route '/admin/gallery-images/{galleryImage}'
 */
export const destroy = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/gallery-images/{galleryImage}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::destroy
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:122
 * @route '/admin/gallery-images/{galleryImage}'
 */
destroy.url = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { galleryImage: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { galleryImage: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    galleryImage: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        galleryImage: typeof args.galleryImage === 'object'
                ? args.galleryImage.id
                : args.galleryImage,
                }

    return destroy.definition.url
            .replace('{galleryImage}', parsedArgs.galleryImage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryImage\GalleryImageController::destroy
 * @see app/Http/Controllers/GalleryImage/GalleryImageController.php:122
 * @route '/admin/gallery-images/{galleryImage}'
 */
destroy.delete = (args: { galleryImage: number | { id: number } } | [galleryImage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const GalleryImageController = { index, create, store, edit, update, destroy }

export default GalleryImageController