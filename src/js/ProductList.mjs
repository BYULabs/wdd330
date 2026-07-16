import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  // Safe image path checker: fallback to nested structure if flat .Image doesn't exist
  const imageUrl = product.Image || (product.Images && product.Images.PrimaryMedium) || '';

  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
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

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    try {
      const data = await this.dataSource.getData();
      
      // If the loaded data has a '.Result' array, unpack it. Otherwise use the raw array.
      this.products = Array.isArray(data) ? data : (data.Result || []);
      
      this.renderList(this.products);
    } catch (error) {
      console.error(
        `Error initializing ProductList for ${this.category}:`,
        error,
      );
    }
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true,
    );
  }
}
