import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {}; // Will hold the product object once fetched
  }

  /**
   * Initializes the product details page by fetching data,
   * rendering the HTML, and attaching the cart event listener.
   */
  async init() {
    // 1. Use the datasource to get the details for the current product.
    this.product = await this.dataSource.findProductById(this.productId);

    // 2. Render the HTML details onto the page
    this.renderProductDetails('main.product-detail');

    // 3. Add a listener to the Add to Cart button using .bind(this)
    // so 'this' inside addToCart refers to this class instance.
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  /**
   * Adds the currently viewed product to the localStorage cart.
   */
  addToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 1) + 1;
    } else {
      this.product.Quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage('so-cart', cartItems);

    updateCartCount();

    alert(`${this.product.NameWithoutBrand} added to cart!`);
  }

  /**
   * Generates the HTML structure for the product details and injects it into the DOM.
   * @param {string} selector - The CSS selector of the container element (e.g., 'main.product-detail')
   */
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    // Generate the internal HTML based on the product data structures
    element.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
