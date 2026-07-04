import { setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  // Get current cart fron LocalStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  
  // Append the new product to the cart
  cart.push(product);
  
  // Persist the updated cart back to LocalStorage as a JSON string
  localStorage.setItem('so-cart', JSON.stringify(cart));
};

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
