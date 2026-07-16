import ProductData from './ProductData.mjs';
import ProductList, { productListCardTemplate } from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs'; // Added getParam utility

loadHeaderFooter();

// 1. Get the dynamic category from the URL parameter (defaults to 'tents' if not found)
const category = getParam('category') || 'tents';

const listElement = document.querySelector('#product-grid');
const dataSource = new ProductData();

// 2. Pass the dynamic category variable to ProductList
const productList = new ProductList(category, dataSource, listElement, productListCardTemplate);

productList.init();