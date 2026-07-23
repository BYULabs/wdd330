import ShoppingCart from './ShoppingCart.mjs';
import { loadHeaderFooter } from './utils.mjs';

// 1. Asynchronously load shared header/footer components
loadHeaderFooter();

// 2. Instantiate and run the shopping cart class module
const cart = new ShoppingCart('so-cart', '#cart-items');
cart.init();