import { setLocalStorage, getLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

// Retrieves the existing cart array, checks for duplicates, and updates local storage
function addProductToCart(product) {
  const currentCart = getLocalStorage('so-cart') || [];
  const existingItem = currentCart.find(item => item.Id === product.Id);

  if (existingItem) {
    existingItem.Quantity = (existingItem.Quantity || 1) + 1;
  } else {
    product.Quantity = 1;
    currentCart.push(product);
  }

  setLocalStorage('so-cart', currentCart);
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