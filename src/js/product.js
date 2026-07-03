import { setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(cart) {
  setLocalStorage('so-cart', cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  // This creates a cart array in local storage if it doesn't exist, or retrieves the existing cart array if it does exist.
  let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  const product = await dataSource.findProductById(e.target.dataset.id);

  // adds the product to the cart array
  cart.push(product);

  //saves it to the local storage
  addProductToCart(cart);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
