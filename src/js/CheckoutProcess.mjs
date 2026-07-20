import { getLocalStorage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.calculateOrderTotals(); // Call on load to display initial estimates
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
    // Calculate total count of physical items
    const totalItems = this.list.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );

    if (totalItems > 0) {
      // Shipping rule: $10 for the first item + $2 for each additional item
      this.shipping = 10 + (totalItems - 1) * 2;
      // Tax rule: 6% of subtotal
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
    const shippingEl = document.querySelector(
      `${this.outputSelector} #summary-shipping`
    );
    const taxEl = document.querySelector(
      `${this.outputSelector} #summary-tax`
    );
    const totalEl = document.querySelector(
      `${this.outputSelector} #summary-total`
    );

    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}