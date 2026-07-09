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

  async init() {
    try {
      this.products = await this.dataSource.getData();
      
      // Call renderList and pass the fetched product array
      this.renderList(this.products);
      
    } catch (error) {
      console.error(`Error initializing ProductList for ${this.category}:`, error);
    }
  }

  // New method to render the products into the HTML
  renderList(list) {
    // 1. Map through the products to turn each one into an HTML string
    const htmlStrings = list.map(product => productCardTemplate(product));
    
    // 2. Join the array of HTML strings into one massive string and insert it into the DOM
    this.listElement.innerHTML = htmlStrings.join('');
  }
}