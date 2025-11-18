import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Invoice\InvoiceController::index
 * @see app/Http/Controllers/Invoice/InvoiceController.php:25
 * @route '/admin/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::index
 * @see app/Http/Controllers/Invoice/InvoiceController.php:25
 * @route '/admin/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::index
 * @see app/Http/Controllers/Invoice/InvoiceController.php:25
 * @route '/admin/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Invoice\InvoiceController::index
 * @see app/Http/Controllers/Invoice/InvoiceController.php:25
 * @route '/admin/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::download
 * @see app/Http/Controllers/Invoice/InvoiceController.php:57
 * @route '/admin/invoices/{invoice}/download'
 */
export const download = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/admin/invoices/{invoice}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::download
 * @see app/Http/Controllers/Invoice/InvoiceController.php:57
 * @route '/admin/invoices/{invoice}/download'
 */
download.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { invoice: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.id
                : args.invoice,
                }

    return download.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::download
 * @see app/Http/Controllers/Invoice/InvoiceController.php:57
 * @route '/admin/invoices/{invoice}/download'
 */
download.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Invoice\InvoiceController::download
 * @see app/Http/Controllers/Invoice/InvoiceController.php:57
 * @route '/admin/invoices/{invoice}/download'
 */
download.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::create
 * @see app/Http/Controllers/Invoice/InvoiceController.php:75
 * @route '/admin/orders/{order}/create-invoice'
 */
export const create = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/create-invoice',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::create
 * @see app/Http/Controllers/Invoice/InvoiceController.php:75
 * @route '/admin/orders/{order}/create-invoice'
 */
create.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return create.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::create
 * @see app/Http/Controllers/Invoice/InvoiceController.php:75
 * @route '/admin/orders/{order}/create-invoice'
 */
create.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::updateStatus
 * @see app/Http/Controllers/Invoice/InvoiceController.php:87
 * @route '/admin/invoices/{invoice}/status'
 */
export const updateStatus = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/admin/invoices/{invoice}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::updateStatus
 * @see app/Http/Controllers/Invoice/InvoiceController.php:87
 * @route '/admin/invoices/{invoice}/status'
 */
updateStatus.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { invoice: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.id
                : args.invoice,
                }

    return updateStatus.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::updateStatus
 * @see app/Http/Controllers/Invoice/InvoiceController.php:87
 * @route '/admin/invoices/{invoice}/status'
 */
updateStatus.patch = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::updatePaymentStatus
 * @see app/Http/Controllers/Invoice/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/payment-status'
 */
export const updatePaymentStatus = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePaymentStatus.url(args, options),
    method: 'patch',
})

updatePaymentStatus.definition = {
    methods: ["patch"],
    url: '/admin/invoices/{invoice}/payment-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::updatePaymentStatus
 * @see app/Http/Controllers/Invoice/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/payment-status'
 */
updatePaymentStatus.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { invoice: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.id
                : args.invoice,
                }

    return updatePaymentStatus.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Invoice\InvoiceController::updatePaymentStatus
 * @see app/Http/Controllers/Invoice/InvoiceController.php:128
 * @route '/admin/invoices/{invoice}/payment-status'
 */
updatePaymentStatus.patch = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePaymentStatus.url(args, options),
    method: 'patch',
})
const invoices = {
    index: Object.assign(index, index),
download: Object.assign(download, download),
create: Object.assign(create, create),
updateStatus: Object.assign(updateStatus, updateStatus),
updatePaymentStatus: Object.assign(updatePaymentStatus, updatePaymentStatus),
}

export default invoices