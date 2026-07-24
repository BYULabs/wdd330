import { loadHeaderFooter, alertMessage } from './utils.mjs';
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

    form.reportValidity();

    if (form.checkValidity()) {
      try {
        const res = await myCheckout.checkout(form);
        console.log('Order placed successfully:', res);
        window.location.href = './success.html';
      } catch (err) {
        console.error('Checkout failed:', err);

        // Clear existing alerts before displaying new ones
        const existingAlerts = document.querySelector('.alert-list');
        if (existingAlerts) {
          existingAlerts.remove();
        }

        // Pass server validation errors (or generic string error) to alertMessage
        if (err.name === 'servicesError' && typeof err.message === 'object') {
          alertMessage(err.message, true);
        } else if (typeof err.message === 'string') {
          alertMessage(err.message, true);
        } else {
          alertMessage('There was an issue processing your order. Please try again.', true);
        }
      }
    }
  });
}