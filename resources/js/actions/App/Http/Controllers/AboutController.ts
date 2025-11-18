import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:16
 * @route '/about'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:16
 * @route '/about'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:16
 * @route '/about'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AboutController::index
 * @see app/Http/Controllers/AboutController.php:16
 * @route '/about'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const AboutController = { index }

export default AboutController