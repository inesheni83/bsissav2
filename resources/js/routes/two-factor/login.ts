import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'

/**
 * Two-Factor Challenge Login route
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: '/two-factor-challenge' + queryParams(options),
    method: 'post',
})

export default {
    store,
}
