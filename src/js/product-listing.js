import ProductData from './ProductData.mjs';
import ProductList, { productListCardTemplate } from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category') || 'tents';
const listElement = document.querySelector('#product-grid');
const dataSource = new ProductData();

const productList = new ProductList(
  category,
  dataSource,
  listElement,
  productListCardTemplate,
);

// Initialize application and bind UI controls once done
productList.init().then(() => {
  setupEventListeners();
});

function setupEventListeners() {
  // ─── 1. Sort Selection Change ───
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      productList.currentSort = e.target.value;
      productList.applyFiltersAndSort();
    });
  }

  // ─── 2. Brand Checkbox Selection ───
  const brandContainer = document.getElementById('filter-brand-options');
  if (brandContainer) {
    brandContainer.addEventListener('change', () => {
      const checkedBrands = Array.from(
        brandContainer.querySelectorAll('input[type="checkbox"]:checked'),
      ).map((checkbox) => checkbox.value);

      productList.filters.brands = checkedBrands;
      productList.applyFiltersAndSort();
    });
  }

  // ─── 3. Price Filter Apply ───
  const applyPriceBtn = document.getElementById('price-apply-btn');
  const priceMinInput = document.getElementById('price-min');
  const priceMaxInput = document.getElementById('price-max');

  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      const minVal = parseFloat(priceMinInput.value);
      const maxVal = parseFloat(priceMaxInput.value);

      productList.filters.priceMin = isNaN(minVal) ? null : minVal;
      productList.filters.priceMax = isNaN(maxVal) ? null : maxVal;
      productList.applyFiltersAndSort();
    });
  }

  // ─── 4. On Sale Checklist Change ───
  const saleCheckbox = document.querySelector('input[data-filter="sale"]');
  if (saleCheckbox) {
    saleCheckbox.addEventListener('change', (e) => {
      productList.filters.onSaleOnly = e.target.checked;
      productList.applyFiltersAndSort();
    });
  }

  // ─── 5. Rating Checklist Change ───
  const ratingGroup = document.querySelector(
    '.filter-group[data-filter="rating"]',
  );
  if (ratingGroup) {
    ratingGroup.addEventListener('change', () => {
      const checkedRatings = Array.from(
        ratingGroup.querySelectorAll('input[type="checkbox"]:checked'),
      ).map((chk) => parseFloat(chk.value.replace('+', '')));

      // Take the lowest requirement selected (e.g. if 3+ and 4+ are checked, show 3+)
      productList.filters.minRating =
        checkedRatings.length > 0 ? Math.min(...checkedRatings) : 0;
      productList.applyFiltersAndSort();
    });
  }

  // ─── 6. Mobile Sidebar Filter Menu Toggle ───
  const toggleBtn = document.getElementById('filter-mobile-toggle');
  const sidebar = document.getElementById('filter-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed-mobile');
    });
  }
}
