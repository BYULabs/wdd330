// 1. Import the ProductData module
import ProductData from './ProductData.mjs';

// 2. Create an instance of ProductData for 'tents'
const tentData = new ProductData('tents');

// 3. Verify it works by fetching the data
tentData
  .getData()
  .then((data) => {
    console.log('Tent data loaded successfully:', data);
  })
  .catch((error) => {
    console.error('Error loading tent data:', error);
  });
