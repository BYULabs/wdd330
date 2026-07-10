// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

/**
 * Retrieves the value of a specific parameter from the current URL's query string.
 * @param {string} param - The name of the URL parameter to retrieve.
 * @returns {string|null} The value of the parameter, or null if it doesn't exist.
 */
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

/**
 * Renders a list of items into the DOM using a template function.
 * @param {Function} templateFn - The function that returns an HTML string for an item.
 * @param {HTMLElement} parentElement - The DOM element where the list will be inserted.
 * @param {Array} list - The array of data items to render.
 * @param {string} [position="afterbegin"] - Where to insert the HTML relative to the parentElement.
 * @param {boolean} [clear=false] - Whether to clear the parent element's content first.
 */
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  // If clear is true, wipe out the existing HTML first
  if (clear) {
    parentElement.innerHTML = '';
  }

  // Map each item to its template HTML string and join them
  const htmlStrings = list.map(templateFn);

  // Insert the joined HTML string into the DOM
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function updateCartCount() {
  const cartItems = getLocalStorage('so-cart') || [];
  
  // Sum up all item quantities
  const totalItems = cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0);

  const cartCountElement = document.querySelector('.cart-badge'); 

  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
    
    // Optional: Keep it visible or hide it if empty
    if (totalItems === 0) {
      cartCountElement.style.display = 'none';
    } else {
      cartCountElement.style.display = 'block'; // or 'inline-block'
    }
  }
}
