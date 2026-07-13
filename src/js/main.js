import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// 1. Asynchronously load the global header and footer partials
loadHeaderFooter();

// 2. Find the target HTML element where the products will eventually be rendered
const listElement = document.querySelector('.product-list');

// 3. Create the data source instance for 'tents'
const dataSource = new ProductData('tents');

// 4. Create the ProductList instance, passing the category, data source, and HTML container
const productList = new ProductList('tents', dataSource, listElement);

// 5. Initialize the list to fetch and render the products
productList.init();
