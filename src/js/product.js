import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// 1. Load the global header and footer dynamically
loadHeaderFooter();

const productId = getParam('product');
const dataSource = new ProductData('tents');

// --- HERE WE CONNECT THE CLASS SO THAT THEY CAN DRAW THE PRODUCT  ---
const product = new ProductDetails(productId, dataSource);
product.init();

// Renamed parameter to 'productItem' to avoid naming conflicts
function addProductToCart(productItem) {
  // Get current cart from LocalStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem('so-cart')) || [];

  // Append the new product to the cart
  cart.push(productItem);

  // Persist the updated cart back to LocalStorage as a JSON string
  localStorage.setItem('so-cart', JSON.stringify(cart));
}

// add to cart button event handler
async function addToCartHandler(e) {
  // Renamed local variable to 'productItem' here as well
  const productItem = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(productItem);
}
