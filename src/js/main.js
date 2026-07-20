import ProductData from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// 1. Asynchronously load global site elements
loadHeaderFooter();

// 2. Instantiate and initiate all 4 product lists concurrently
const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];

categories.forEach((category) => {
  const listElement = document.querySelector(`#carousel-${category}`);
  if (listElement) {
    const dataSource = new ProductData();
    const productList = new ProductList(category, dataSource, listElement);
    productList.init();
  }
});

// 3. Category Tabs Toggle Mechanism
const tabs = document.querySelectorAll('.category-tab');
const sections = document.querySelectorAll('.category-content');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    // Remove active markers everywhere
    tabs.forEach((t) => t.classList.remove('active'));
    sections.forEach((s) => s.classList.remove('active'));

    // Apply active marker to clicked target
    tab.classList.add('active');
    const targetCategory = tab.getAttribute('data-category');
    const activeSection = document.querySelector(
      `.category-content[data-category="${targetCategory}"]`,
    );
    if (activeSection) {
      activeSection.classList.add('active');
    }
  });
});

// 4. Carousel Arrow Scroll Hook Mechanics
const wrappers = document.querySelectorAll('.carousel-wrapper');

wrappers.forEach((wrapper) => {
  const container = wrapper.querySelector('.carousel-track-container');
  const prevBtn = wrapper.querySelector('.carousel-arrow--prev');
  const nextBtn = wrapper.querySelector('.carousel-arrow--next');

  if (container && prevBtn && nextBtn) {
    // Scroll distance defaults roughly to two cards' wide profiles
    const scrollAmount = 500;

    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
});
