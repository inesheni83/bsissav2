import orders from './orders'
import invoices from './invoices'
import deliveryFees from './delivery-fees'
import customers from './customers'
import settings from './settings'
const admin = {
    orders: Object.assign(orders, orders),
invoices: Object.assign(invoices, invoices),
deliveryFees: Object.assign(deliveryFees, deliveryFees),
customers: Object.assign(customers, customers),
settings: Object.assign(settings, settings),
}

export default admin