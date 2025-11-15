import Auth from './Auth'
import Product from './Product'
import Settings from './Settings'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
Product: Object.assign(Product, Product),
Settings: Object.assign(Settings, Settings),
}

export default Controllers