import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
const site = {
    update: Object.assign(update, update),
deleteLogo: Object.assign(deleteLogo, deleteLogo),
}

export default site