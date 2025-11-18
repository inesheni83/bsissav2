import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\CustomerController::index
 * @see app/Http/Controllers/Customer/CustomerController.php:21
 * @route '/admin/customers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CustomerController::index
 * @see app/Http/Controllers/Customer/CustomerController.php:21
 * @route '/admin/customers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerController::index
 * @see app/Http/Controllers/Customer/CustomerController.php:21
 * @route '/admin/customers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CustomerController::index
 * @see app/Http/Controllers/Customer/CustomerController.php:21
 * @route '/admin/customers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Customer\CustomerController::exportMethod
 * @see app/Http/Controllers/Customer/CustomerController.php:54
 * @route '/admin/customers/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/customers/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CustomerController::exportMethod
 * @see app/Http/Controllers/Customer/CustomerController.php:54
 * @route '/admin/customers/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerController::exportMethod
 * @see app/Http/Controllers/Customer/CustomerController.php:54
 * @route '/admin/customers/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CustomerController::exportMethod
 * @see app/Http/Controllers/Customer/CustomerController.php:54
 * @route '/admin/customers/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})
const CustomerController = { index, exportMethod, export: exportMethod }

export default CustomerController