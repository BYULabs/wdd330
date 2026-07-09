// 1. Template function to generate the HTML string for a single product card
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

// 2. Your ProductList class remains below the template function
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    try {
      this.products = await this.dataSource.getData();
      console.log(`${this.category} loaded:`, this.products);
      
      // Next step: You will use productCardTemplate to render these!
      
    } catch (error) {
      console.error(`Error initializing ProductList for ${this.category}:`, error);
    }
  }
}