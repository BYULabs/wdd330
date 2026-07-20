import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

// Converts form data into a simple JavaScript object using input name attributes
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// Packages cart items into the required schema for the server
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: parseFloat(item.FinalPrice),
    quantity: item.Quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector, services) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.services = services; // Instance of ExternalServices
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.calculateOrderTotals();
  }

  calculateItemSummary() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #summary-subtotal`
    );

    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (parseFloat(item.FinalPrice) || 0) * (item.Quantity || 1),
      0
    );

    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotals() {
    const totalItems = this.list.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );

    if (totalItems > 0) {
      this.shipping = 10 + (totalItems - 1) * 2;
      this.tax = this.itemTotal * 0.06;
      this.orderTotal = this.itemTotal + this.shipping + this.tax;
    } else {
      this.shipping = 0;
      this.tax = 0;
      this.orderTotal = 0;
    }

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shippingEl = document.querySelector(`${this.outputSelector} #summary-shipping`);
    const taxEl = document.querySelector(`${this.outputSelector} #summary-tax`);
    const totalEl = document.querySelector(`${this.outputSelector} #summary-total`);

    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  // Prepares the order data object and submits it via ExternalServices
  async checkout(form) {
    const orderObject = formDataToJSON(form);

    // Populate remaining details matching the expected server structure
    orderObject.orderDate = new Date().toISOString();
    orderObject.orderTotal = this.orderTotal.toFixed(2);
    orderObject.shipping = this.shipping;
    orderObject.tax = this.tax.toFixed(2);
    orderObject.items = packageItems(this.list);

    try {
      const response = await this.services.checkout(orderObject);
      if (response) {
        setLocalStorage(this.key, []);
        updateCartCount();
        return response;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    }
  }
}