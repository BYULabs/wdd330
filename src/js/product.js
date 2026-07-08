import { setLocalStorage, getLocalStorage, getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');
const productId = getParam('product');

// --- TEST block ---
async function testProductFetch() {
  console.log("Extracted Product ID from URL:", productId);
  
  if (productId) {
    const product = await dataSource.findProductById(productId);
    console.log("Fetched Product Data:", product);
  } else {
    console.warn("No product ID found in the URL query string! Did you click a link with '?product=xxxx'?");
  }
}
testProductFetch();
// ------------------

// Retrieves the existing cart array, checks for duplicates, and updates local storage
function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);