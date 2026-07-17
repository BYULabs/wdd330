import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// 1. Load global layouts dynamically
loadHeaderFooter();

// 2. Extract both ID and Category from URL search query parameters
const productId = getParam('product');
const category = getParam('category'); // <--- Extract category from the URL!

// 3. Instantiate the API data source
const dataSource = new ProductData();

// 4. Pass the category into ProductDetails alongside the ID
const product = new ProductDetails(productId, dataSource, category);
product.init();
