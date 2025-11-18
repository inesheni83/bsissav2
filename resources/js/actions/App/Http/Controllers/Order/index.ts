import OrderController from './OrderController'
import AdminOrderController from './AdminOrderController'
const Order = {
    OrderController: Object.assign(OrderController, OrderController),
AdminOrderController: Object.assign(AdminOrderController, AdminOrderController),
}

export default Order