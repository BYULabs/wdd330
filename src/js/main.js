import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { updateCartCount } from './utils.mjs';

// 1. Find the target HTML element where the products will eventually be rendered
const listElement = document.querySelector('.product-list');

// 2. Create the data source instance for 'tents'
const dataSource = new ProductData('tents');

// 3. Create the ProductList instance, passing the category, data source, and HTML container
const productList = new ProductList('tents', dataSource, listElement);

// 4. Initialize the list to fetch and render the products
productList.init();

// 5. Update the cart icon badge count on page load
updateCartCount();