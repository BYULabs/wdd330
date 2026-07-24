import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';
import ExternalServices from './ExternalServices.mjs';

loadHeaderFooter();

const services = new ExternalServices();
const myCheckout = new CheckoutProcess('so-cart', '#order-summary', services);
myCheckout.init();

const form = document.getElementById('checkout-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Trigger standard browser validation popups if invalid
    form.reportValidity();

    if (form.checkValidity()) {
      try {
        const res = await myCheckout.checkout(form);
        console.log('Server response:', res);
        
        alert(`Order placed successfully! Order ID: ${res.orderId || 'Confirmed'}`);
        window.location.href = '../index.html';
      } catch (err) {
        console.error('Checkout failed:', err);

        // Extract detailed error messages from the custom error object thrown by convertToJson
        if (err.name === 'servicesError' && typeof err.message === 'object') {
          // Convert error object properties into a readable string list
          const errorDetails = Object.values(err.message).join('\n');
          alert(`Checkout failed:\n${errorDetails}`);
        } else if (typeof err.message === 'string') {
          alert(`Checkout failed: ${err.message}`);
        } else {
          alert('There was an issue processing your order. Please check your information and try again.');
        }
      }
    }
  });
}