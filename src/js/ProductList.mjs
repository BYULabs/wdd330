import { renderListWithTemplate } from './utils.mjs';

// Helper to extract the Brand name dynamically since the API's Brand object lacks a "Name" field
function getBrandName(product) {
  if (product.Brand && product.Brand.Name) return product.Brand.Name;
  // Fallback: Subtract NameWithoutBrand from Name to get the brand prefix
  const brand = product.Name.replace(product.NameWithoutBrand, '').trim();
  return brand || 'Outdoor';
}

// ─── CATEGORY LISTING PAGE TEMPLATE ───
export function productListCardTemplate(product, category) {
  const imageUrl =
    product.Image || (product.Images && product.Images.PrimaryMedium) || '';
  const brandName = getBrandName(product);

  // Correct rating paths from API dump
  const rating = product.Reviews?.AverageRating || 0;
  const reviewCount = product.Reviews?.ReviewCount || 0;

  // Create stars HTML
  let starsHtml = '<div class="card-stars">';
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<svg class="card-star${i <= Math.round(rating) ? ' filled' : ''}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }
  starsHtml += '</div>';

  // Badge setup (compare against SuggestedRetailPrice)
  let badgeHtml = '';
  const isOnSale =
    product.SuggestedRetailPrice &&
    product.SuggestedRetailPrice > product.FinalPrice;
  if (isOnSale) {
    badgeHtml = `<span class="listing-card__badge listing-card__badge--sale">Sale</span>`;
  }

  const retailHtml = isOnSale
    ? `<span class="listing-card__retail">$${product.SuggestedRetailPrice.toFixed(2)}</span>`
    : '';

  return `
    <div class="listing-card">
      <a href="../product_pages/index.html?product=${product.Id}&category=${category}">
        <div class="listing-card__image">
          ${imageUrl ? `<img src="${imageUrl}" alt="${brandName} ${product.NameWithoutBrand}">` : '<div class="placeholder-img">🏕️</div>'}
          ${badgeHtml}
        </div>
        <div class="listing-card__info">
          <span class="listing-card__brand">${brandName}</span>
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

// Simple layout fallback for home carousel
export function productCardTemplate(product, category) {
  const imageUrl =
    product.Image || (product.Images && product.Images.PrimaryMedium) || '';
  const brandName = getBrandName(product);
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}&category=${category}">
      <img src="${imageUrl}" alt="Image of ${product.NameWithoutBrand}" />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

// ─── DYNAMIC PRODUCT LIST CLASS ───
export default class ProductList {
  constructor(
    category,
    dataSource,
    listElement,
    templateFn = productCardTemplate,
  ) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.templateFn = templateFn;
    this.products = []; // Original, untouched array
    this.filteredProducts = []; // Working filtered/sorted array

    // Filter states
    this.filters = {
      brands: [],
      priceMin: null,
      priceMax: null,
      onSaleOnly: false,
      minRating: 0,
    };
    this.currentSort = 'featured';
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);
      this.products = list || [];
      this.filteredProducts = [...this.products];

      this.updateCategoryDetails();
      this.buildBrandFilters();
      this.applyFiltersAndSort();
    } catch (error) {
      console.error(`Error initializing ProductList:`, error);
    }
  }

  // Updates Page Title, Icons, & Count
  updateCategoryDetails() {
    const formattedCategory =
      this.category.charAt(0).toUpperCase() + this.category.slice(1);

    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    const countElement = document.getElementById('product-count');

    if (heroTitle) heroTitle.textContent = formattedCategory;
    if (heroDescription)
      heroDescription.textContent = `Explore our curated selection of high-quality ${this.category}.`;
    if (countElement) {
      countElement.innerHTML = `Showing <strong>${this.filteredProducts.length}</strong> of <strong>${this.products.length}</strong> Products`;
    }
  }

  // Extract unique brands dynamically to build sidebar checklist
  buildBrandFilters() {
    const brandContainer = document.getElementById('filter-brand-options');
    if (!brandContainer) return;

    // Get unique brand names
    const brands = [
      ...new Set(this.products.map((p) => getBrandName(p))),
    ].sort();

    brandContainer.innerHTML = brands
      .map(
        (brand) => `
      <label class="filter-option">
        <input type="checkbox" name="brand-filter" value="${brand}">
        ${brand}
      </label>
    `,
      )
      .join('');
  }

  // Apply filters first, then sort, then render
  applyFiltersAndSort() {
    let result = [...this.products];

    // 1. Brand Filter
    if (this.filters.brands.length > 0) {
      result = result.filter((p) =>
        this.filters.brands.includes(getBrandName(p)),
      );
    }

    // 2. Price Filters
    if (this.filters.priceMin !== null) {
      result = result.filter((p) => p.FinalPrice >= this.filters.priceMin);
    }
    if (this.filters.priceMax !== null) {
      result = result.filter((p) => p.FinalPrice <= this.filters.priceMax);
    }

    // 3. Sale Filter (Final Price < Suggested Retail Price)
    if (this.filters.onSaleOnly) {
      result = result.filter(
        (p) => p.SuggestedRetailPrice && p.SuggestedRetailPrice > p.FinalPrice,
      );
    }

    // 4. Rating Filter
    if (this.filters.minRating > 0) {
      result = result.filter(
        (p) => (p.Reviews?.AverageRating || 0) >= this.filters.minRating,
      );
    }

    // 5. Sort Execution
    result = this.sortList(result, this.currentSort);

    this.filteredProducts = result;
    this.updateCategoryDetails();
    this.renderList(this.filteredProducts);
  }

  sortList(list, sortBy) {
    const sorted = [...list];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
      case 'price-high':
        return sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
      case 'name-az':
        return sorted.sort((a, b) =>
          a.NameWithoutBrand.localeCompare(b.NameWithoutBrand),
        );
      case 'name-za':
        return sorted.sort((a, b) =>
          b.NameWithoutBrand.localeCompare(a.NameWithoutBrand),
        );
      case 'rating':
        return sorted.sort(
          (a, b) =>
            (b.Reviews?.AverageRating || 0) - (a.Reviews?.AverageRating || 0),
        );
      case 'featured':
      default:
        return sorted; // Preserves API's default order
    }
  }

  renderList(list) {
    if (list.length === 0) {
      this.listElement.innerHTML = `
        <div class="no-results">
          <div class="empty-icon">🏕️</div>
          <h3>No products match your criteria.</h3>
          <p>Try resetting your active filters.</p>
        </div>
      `;
      return;
    }

    renderListWithTemplate(
      (product) => this.templateFn(product, this.category),
      this.listElement,
      list,
      'afterbegin',
      true,
    );
  }
}
