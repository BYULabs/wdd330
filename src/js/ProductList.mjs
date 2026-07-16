import { renderListWithTemplate } from './utils.mjs';

// ─── 1. HOME/MAIN PAGE TEMPLATE (Simple Carousel Cards) ───
export function productCardTemplate(product, category) {
  const imageUrl =
    product.Image || (product.Images && product.Images.PrimaryMedium) || '';

  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}&category=${category}">
      <img
        src="${imageUrl}"
        alt="Image of ${product.NameWithoutBrand || product.Name}"
      />
      <h3 class="card__brand">${product.Brand ? product.Brand.Name : ''}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.ListPrice}</p>
    </a>
  </li>`;
}

// ─── 2. CATEGORY LISTING PAGE TEMPLATE (Detailed Grid/List Cards) ───
export function productListCardTemplate(product, category) {
  const imageUrl = product.Image || (product.Images && product.Images.PrimaryMedium) || '';
  
  // Rating calculation default values
  const rating = product.Rating || 4.5;
  const reviewCount = product.ReviewsCount || 12;
  
  // Create stars SVG HTML strings
  let starsHtml = '<div class="card-stars">';
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<svg class="card-star${i <= Math.round(rating) ? ' filled' : ''}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }
  starsHtml += '</div>';

  // Badges setup
  let badgeHtml = '';
  if (product.ListPrice && product.ListPrice > product.FinalPrice) {
    badgeHtml = `<span class="listing-card__badge listing-card__badge--sale">Sale</span>`;
  }

  // Savings / Retail vs Final price styling
  const retailHtml = (product.ListPrice && product.ListPrice > product.FinalPrice)
    ? `<span class="listing-card__retail">$${product.ListPrice.toFixed(2)}</span>`
    : '';

  return `
    <div class="listing-card">
      <a href="../product_pages/index.html?product=${product.Id}&category=${category}">
        <div class="listing-card__image">
          ${imageUrl ? `<img src="${imageUrl}" alt="${product.Brand?.Name || ''} ${product.NameWithoutBrand}">` : '<div class="placeholder-img">🏕️</div>'}
          ${badgeHtml}
        </div>
        <div class="listing-card__info">
          <span class="listing-card__brand">${product.Brand ? product.Brand.Name : ''}</span>
          <div class="listing-card__rating">
            ${starsHtml}
            <span class="card-review-count">(${reviewCount})</span>
          </div>
          <h2 class="listing-card__name">${product.NameWithoutBrand}</h2>
          <div class="listing-card__bottom">
            <div class="listing-card__prices">
              <span class="listing-card__price">$${product.FinalPrice.toFixed(2)}</span>
              ${retailHtml}
            </div>
            <button class="listing-card__add-btn" data-id="${product.Id}" title="Add to cart">+</button>
          </div>
        </div>
      </a>
    </div>
  `;
}

// ─── 3. DYNAMIC PRODUCT LIST CLASS ───
export default class ProductList {
  // 💡 Added templateFn parameter that automatically defaults to the simple layout
  constructor(category, dataSource, listElement, templateFn = productCardTemplate) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.templateFn = templateFn; // Stores the configuration template
    this.products = [];
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);
      this.products = list || [];
      this.renderList(this.products);
    } catch (error) {
      console.error(
        `Error initializing ProductList for ${this.category}:`,
        error,
      );
    }
  }

  renderList(list) {
    // 💡 Uses the dynamically specified template configuration
    renderListWithTemplate(
      (product) => this.templateFn(product, this.category),
      this.listElement,
      list,
      'afterbegin',
      true,
    );
  }
}