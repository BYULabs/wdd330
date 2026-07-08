import { setLocalStorage, getLocalStorage, getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';

// Grab the product ID from the URL
const productId = getParam('product');

console.log(productId); // Outputs: "880RR" (based on your example link)

const dataSource = new ProductData('tents');

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