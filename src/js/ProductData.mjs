const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  // 1. Remove category and path from the constructor to make it more flexible
  constructor() {}

  // 2. Fetch directly from the external API using async/await
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // The API returns the array wrapped in a Result property
  }

  // 3. Keep findProductById compatible by ensuring it requests a category context
  async findProductById(id, category) {
    const products = await this.getData(category);
    return products.find((item) => item.Id === id);
  }
}
