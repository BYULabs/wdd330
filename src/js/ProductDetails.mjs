import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  // Initializes the details page by fetching data and setting up listeners
  async init() {
    // 1. Use the data source to find the specific product details
    this.product = await this.dataSource.findProductById(this.productId);
    
    // 2. Render the details to the HTML page
    this.renderProductDetails('main');

    // 3. Listen for the click on the Add to Cart button
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  // Adds the current product to local storage cart
  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product); // Adds the current product object to the array
    setLocalStorage('so-cart', cartItems);
  }

  // Generates and inserts the HTML template dynamically
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    
    // Check if element and product exist before modifying innerHTML
    if (element && this.product) {
      element.innerHTML = this.productDetailsTemplate(this.product);
    }
  }

  // HTML Template helper method
  productDetailsTemplate(product) {
    return `<section class="product-detail">
      <h3>${product.Brand.Name}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${product.Image}"
        alt="${product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product__color">${product.Colors[0].ColorName}</p>
      <p class="product__description">
        ${product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    </section>`;
  }
}