import { getLocalStorage, updateCartCount } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Step 2: Check if there are items in the cart
  if (cartItems.length > 0) {
    // The cart is not empty, ready to calculate the total in Step 3
    console.log("Cart is not empty. Ready to calculate total!");
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