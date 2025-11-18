import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::index
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/settings/site',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::index
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::index
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::index
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::update
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:45
 * @route '/admin/settings/site'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/settings/site',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::update
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:45
 * @route '/admin/settings/site'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::update
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:45
 * @route '/admin/settings/site'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::deleteLogo
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:70
 * @route '/admin/settings/site/logo'
 */
export const deleteLogo = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteLogo.url(options),
    method: 'delete',
})

deleteLogo.definition = {
    methods: ["delete"],
    url: '/admin/settings/site/logo',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::deleteLogo
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:70
 * @route '/admin/settings/site/logo'
 */
deleteLogo.url = (options?: RouteQueryOptions) => {
    return deleteLogo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::deleteLogo
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:70
 * @route '/admin/settings/site/logo'
 */
deleteLogo.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteLogo.url(options),
    method: 'delete',
})
const SiteSettingsController = { index, update, deleteLogo }

export default SiteSettingsController