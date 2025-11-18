import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\TwoFactorAuthenticationController::show
 * @see [unknown]:0
 * @route '/settings/two-factor'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/two-factor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\TwoFactorAuthenticationController::show
 * @see [unknown]:0
 * @route '/settings/two-factor'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\TwoFactorAuthenticationController::show
 * @see [unknown]:0
 * @route '/settings/two-factor'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\TwoFactorAuthenticationController::show
 * @see [unknown]:0
 * @route '/settings/two-factor'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
 * QR Code route
 */
export const qrCode = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: '/user/two-factor-qr-code' + queryParams(options),
    method: 'get',
})

/**
 * Recovery Codes route
 */
export const recoveryCodes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: '/user/two-factor-recovery-codes' + queryParams(options),
    method: 'get',
})

/**
 * Secret Key route
 */
export const secretKey = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: '/user/two-factor-secret-key' + queryParams(options),
    method: 'get',
})

/**
 * Regenerate Recovery Codes route
 */
export const regenerateRecoveryCodes = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: '/user/two-factor-recovery-codes' + queryParams(options),
    method: 'post',
})

/**
 * Confirm Two-Factor Authentication route
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: '/user/confirmed-two-factor-authentication' + queryParams(options),
    method: 'post',
})

/**
 * Enable Two-Factor Authentication route
 */
export const enable = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: '/user/two-factor-authentication' + queryParams(options),
    method: 'post',
})

/**
 * Disable Two-Factor Authentication route
 */
export const disable = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: '/user/two-factor-authentication' + queryParams(options),
    method: 'delete',
})

const twoFactor = {
    show: Object.assign(show, show),
    qrCode,
    recoveryCodes,
    secretKey,
    regenerateRecoveryCodes,
    confirm,
    enable,
    disable,
}

export default twoFactor