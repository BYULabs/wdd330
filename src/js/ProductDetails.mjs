import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';

export default class ProductDetails {
  // 1. Accept category in the constructor
  constructor(productId, dataSource, category) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.category = category; // <--- Save category reference
    this.product = {}; 
  }

  async init() {
    // 2. Pass category to findProductById so the API can resolve the path
    this.product = await this.dataSource.findProductById(this.productId, this.category);

    this.renderProductDetails('main.product-detail');

    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    let cartItems = getLocalStorage('so-cart');

    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

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

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    // 3. Safe image path fallback logic
    const imageUrl = this.product.Image || 
                     (this.product.Images && this.product.Images.PrimaryLarge) || 
                     '';

    element.innerHTML = `
      <h3>${this.product.Brand ? this.product.Brand.Name : ''}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${imageUrl}"
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors && this.product.Colors[0] ? this.product.Colors[0].ColorName : ''}</p>
      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}