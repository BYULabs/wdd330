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

    form.reportValidity();

    if (form.checkValidity()) {
      try {
        const res = await myCheckout.checkout(form);
        console.log('Order placed successfully:', res);

        // Redirect to success page
        window.location.href = './success.html';
      } catch (err) {
        console.error('Checkout failed:', err);

        if (err.name === 'servicesError' && typeof err.message === 'object') {
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