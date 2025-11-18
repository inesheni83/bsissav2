import ProductViewController from './ProductViewController'
import AddProductController from './AddProductController'
import ProductListController from './ProductListController'
import ProductController from './ProductController'
const Product = {
    ProductViewController: Object.assign(ProductViewController, ProductViewController),
AddProductController: Object.assign(AddProductController, AddProductController),
ProductListController: Object.assign(ProductListController, ProductListController),
ProductController: Object.assign(ProductController, ProductController),
}

export default Product