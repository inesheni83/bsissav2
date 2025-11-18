import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import siteF82d3c from './site'
/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::site
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
export const site = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: site.url(options),
    method: 'get',
})

site.definition = {
    methods: ["get","head"],
    url: '/admin/settings/site',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::site
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
site.url = (options?: RouteQueryOptions) => {
    return site.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::site
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
site.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: site.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\SiteSettingsController::site
 * @see app/Http/Controllers/Settings/SiteSettingsController.php:21
 * @route '/admin/settings/site'
 */
site.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: site.url(options),
    method: 'head',
})
const settings = {
    site: Object.assign(site, siteF82d3c),
}

export default settings