// ─── 1. CORE UTILITIES ───

// Wrapper for querySelector that defaults to searching the document
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// ─── 2. DATA & STORAGE HELPERS ───

// Retrieves and parses data from LocalStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Converts data to a string and saves it to LocalStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Extracts a specific query parameter value from the current page URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// ─── 3. UI & EVENT HELPERS ───

// Attaches an event listener for both mobile touch and desktop click events
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Converts an array of data into HTML templates and inserts them into the DOM
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// Inserts a single template into the DOM and executes an optional callback function
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML('afterbegin', template);

  // If a callback function was provided, execute it
  if (callback) {
    callback(data);
  }
}

// Fetches an external HTML template file and returns its content as a string
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// ─── 4. APPLICATION SPECIFIC UI ───
// Loads header and footer templates, targets placeholder elements, and renders them
export async function loadHeaderFooter() {
  // 1. Fetch both template files asynchronously
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');

  // 2. Grab placeholder elements from the DOM
  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  // 3. Render the templates with appropriate callbacks to restore interactive elements
  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement, null, () => {
      updateCartCount();
      initMobileMenu();
    });
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// Calculates total items in the cart and updates the header badge number
export function updateCartCount() {
  const cartItems = getLocalStorage('so-cart');

  if (cartItems && Array.isArray(cartItems)) {
    const count = cartItems.reduce(
      (total, item) => total + (item.Quantity || 1),
      0,
    );
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = count;
  } else {
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = 0;
  }
}

// Handles the accessibility attributes and visibility toggle for the mobile navigation menu
export function initMobileMenu() {
  const menuToggle = qs('.menu-toggle');
  const primaryNav = qs('#primary-nav');

  if (menuToggle && primaryNav) {
    setClick('.menu-toggle', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('open');
    });
  }
}