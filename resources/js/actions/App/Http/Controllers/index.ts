import Auth from './Auth'
import HomeController from './HomeController'
import AboutController from './AboutController'
import Product from './Product'
import CartController from './CartController'
import Checkout from './Checkout'
import Order from './Order'
import SellerDashboardController from './SellerDashboardController'
import Invoice from './Invoice'
import DeliveryFee from './DeliveryFee'
import GalleryImage from './GalleryImage'
import Customer from './Customer'
import Settings from './Settings'
import Category from './Category'
import Pack from './Pack'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
HomeController: Object.assign(HomeController, HomeController),
AboutController: Object.assign(AboutController, AboutController),
Product: Object.assign(Product, Product),
CartController: Object.assign(CartController, CartController),
Checkout: Object.assign(Checkout, Checkout),
Order: Object.assign(Order, Order),
SellerDashboardController: Object.assign(SellerDashboardController, SellerDashboardController),
Invoice: Object.assign(Invoice, Invoice),
DeliveryFee: Object.assign(DeliveryFee, DeliveryFee),
GalleryImage: Object.assign(GalleryImage, GalleryImage),
Customer: Object.assign(Customer, Customer),
Settings: Object.assign(Settings, Settings),
Category: Object.assign(Category, Category),
Pack: Object.assign(Pack, Pack),
}

export default Controllers