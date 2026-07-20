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

    if (form.checkValidity()) {
      try {
        const res = await myCheckout.checkout(form);
        console.log('Server response:', res);
        alert(`Order placed successfully! Order ID: ${res.orderId || 'Confirmed'}`);
        window.location.href = '../index.html';
      } catch (err) {
        console.error('Checkout failed:', err);
        alert('There was an issue processing your order. Please try again.');
      }
    }
  });
}