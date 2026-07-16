import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product, category) { // 💡 Add category as a parameter
  const imageUrl = product.Image || (product.Images && product.Images.PrimaryMedium) || '';

  // 💡 FIX: Append "&category=${category}" to the query string
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

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    try {
      // 1. Pass the instance category parameter to the data source
      const list = await this.dataSource.getData(this.category);
      
      // 2. Assign the retrieved list array directly
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
    // Pass a wrapper function that binds the current category to each template item
    renderListWithTemplate(
      (product) => productCardTemplate(product, this.category),
      this.listElement,
      list,
      'afterbegin',
      true,
    );
  }
}
