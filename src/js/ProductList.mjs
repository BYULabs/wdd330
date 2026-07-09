export default class ProductList {
  // 1. The constructor receives the category, dataSource, and target HTML element
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    
    // This will hold our array of products once fetched
    this.products = [];
  }

  // 2. The init method handles the asynchronous data fetching
  async init() {
    try {
      // Use the dataSource instance to fetch the products
      this.products = await this.dataSource.getData();
      
      // For debugging: verify you got the data
      console.log(`${this.category} loaded:`, this.products);
      
      // Future step: call a method here to render the list to this.listElement
      // this.renderList(this.products);
      
    } catch (error) {
      console.error(`Error initializing ProductList for ${this.category}:`, error);
    }
  }
}