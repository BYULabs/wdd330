import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Image}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
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

// The init method fetches the data and starts rendering
async init() {
// 1. Fetches the products from the JSON using the dataSource
const list = await this.dataSource.getData(); 

// 2. Renders the product list in the HTML
this.renderList(list); 
}

renderList(list) {
  // const htmlStrings = list.map(productCardTemplate);
  // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

  // apply use new utility function instead of the commented code above
  renderListWithTemplate(productCardTemplate, this.listElement, list);
}
}
