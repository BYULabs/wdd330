import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load shared header/footer layout dynamically
loadHeaderFooter();

// Instantiate CheckoutProcess targeting cart key and summary container
const myCheckout = new CheckoutProcess('so-cart', '#order-summary');
myCheckout.init();

// Listen for zip code input changes to trigger tax and shipping calculations
const zipInput = document.getElementById('zip');

if (zipInput) {
  zipInput.addEventListener('blur', () => {
    if (zipInput.value.trim() !== '') {
      myCheckout.calculateOrderTotals();
    }
  });
}

// Handle Form Submission
const form = document.getElementById('checkout-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      alert('Order submitted successfully!');
    }
  });
}