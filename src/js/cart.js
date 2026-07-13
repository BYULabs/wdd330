import { getLocalStorage, updateCartCount } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Step 2: Check if there are items in the cart
  if (cartItems.length > 0) {
    // The cart is not empty, ready to calculate the total in Step 3

    // FEATURE: Calculate the total sum of all items in the cart (multiplied by their quantity)
    // and dynamically unhide the cart footer block to display the final balance on screen.
    calculateCartTotal(cartItems);
  }
}

// Step 3 & 4: Calculate the sum of items and display the footer block
function calculateCartTotal(cartItems) {
  // Sum each item's price multiplied by its quantity
  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);

  // Insert the formatted sum inside the total span element
  const totalElement = document.getElementById('cart-total-amount');
  if (totalElement) {
    totalElement.innerText = total.toFixed(2);
  }

  // Remove the 'hide' class from the footer block to reveal it on screen
  const cartFooter = document.querySelector('.cart-footer');
  if (cartFooter) {
    cartFooter.classList.remove('hide');
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

updateCartCount();