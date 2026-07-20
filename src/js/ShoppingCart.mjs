import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from './utils.mjs';

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.06;

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  init() {
    this.renderCartContents();
    this.initCartEvents();
    this.initSummaryEvents();
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key) || [];
    const container = document.querySelector(this.parentSelector);
    const layout = document.getElementById('cart-layout');
    const itemCountEl = document.getElementById('cart-item-count');

    // Handle Empty Cart State
    if (cartItems.length === 0) {
      if (layout) {
        layout.innerHTML = `
          <div class="cart-empty">
            <div class="empty-icon">🏕️</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any gear yet. Time to stock up for your next adventure!</p>
            <a href="../index.html" class="btn-continue-shopping">Start Shopping</a>
          </div>
        `;
      }
      if (itemCountEl) itemCountEl.textContent = '0 items in your cart';
      updateCartCount();
      return;
    }

    // Update Header Badge and Total Quantity
    const totalQty = cartItems.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );
    if (itemCountEl) {
      itemCountEl.textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''} in your cart`;
    }

    // Render Product Cards
    if (container) {
      container.innerHTML = '';
      cartItems.forEach((item, index) => {
        const finalPrice = parseFloat(item.FinalPrice || 0);
        const quantity = parseInt(item.Quantity || 1);
        const lineTotal = finalPrice * quantity;

        // Safely determine Category (fallback to 'tents' if not present on older cart items)
        const category = item.Category || 'tents';

        // Safeguard Color values
        const colorName =
          item.Colors && item.Colors[0] ? item.Colors[0].ColorName : 'Default';
        const colorChipHtml =
          item.Colors && item.Colors[0] && item.Colors[0].ColorPreviewImageCode
            ? `<img src="${item.Colors[0].ColorPreviewImageCode}" alt="${colorName}">`
            : `<span style="background:#ccc;"></span>`;

        // Safeguard Images
        const imageUrl =
          item.Image || (item.Images && item.Images.PrimaryMedium) || '';

        const card = document.createElement('div');
        card.className = 'cart-card';
        card.dataset.index = index;
        card.innerHTML = `
          <div class="cart-card__image">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${item.Name}">`
                : `<div class="placeholder-img">⛺</div>`
            }
          </div>
          <div class="cart-card__details">
            <span class="cart-card__brand">${item.Brand?.Name || 'Gear'}</span>
            <span class="cart-card__name">
              <!-- Dynamically formats URL with both product ID and Category -->
              <a href="../product_pages/index.html?product=${item.Id}&category=${category}">${item.Name}</a>
            </span>
            <span class="cart-card__color">
              <span class="cart-card__color-chip">${colorChipHtml}</span>
              ${colorName}
            </span>
            <div class="cart-card__actions-row">
              <div class="cart-qty">
                <button class="cart-qty-btn" data-action="decrease" data-index="${index}">−</button>
                <input class="cart-qty-value" type="number" value="${quantity}" min="1" max="99" data-index="${index}">
                <button class="cart-qty-btn" data-action="increase" data-index="${index}">+</button>
              </div>
              <button class="cart-remove-btn" data-index="${index}">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
              </button>
            </div>
          </div>
          <div class="cart-card__right">
            <span class="cart-card__price">$${lineTotal.toFixed(2)}</span>
            ${quantity > 1 ? `<span class="cart-card__line-total">$${finalPrice.toFixed(2)} each</span>` : ''}
          </div>
        `;
        container.appendChild(card);
      });
    }

    this.calculateCartTotal(cartItems);
  }

  calculateCartTotal(cartItems) {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
      0
    );

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const taxEl = document.getElementById('summary-tax');
    const totalEl = document.getElementById('summary-total');
    const shippingMsgEl = document.getElementById('summary-free-shipping');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl)
      shippingEl.textContent =
        shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    if (shippingMsgEl) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingMsgEl.className = 'summary-free-shipping';
        shippingMsgEl.innerHTML =
          '✅ You qualify for <strong>free shipping</strong>!';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        shippingMsgEl.className = 'summary-free-shipping not-qualified';
        shippingMsgEl.innerHTML = `🚚 Add <strong>$${remaining}</strong> more for free shipping`;
      }
    }
  }

  initCartEvents() {
    const itemsContainer = document.querySelector(this.parentSelector);
    if (!itemsContainer) return;

    itemsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action], .cart-remove-btn');
      if (!btn) return;

      const index = parseInt(btn.dataset.index);
      const cartItems = getLocalStorage(this.key) || [];

      if (btn.dataset.action === 'increase') {
        cartItems[index].Quantity = (cartItems[index].Quantity || 1) + 1;
        setLocalStorage(this.key, cartItems);
        this.renderCartContents();
        updateCartCount();
      } else if (btn.dataset.action === 'decrease') {
        if ((cartItems[index].Quantity || 1) > 1) {
          cartItems[index].Quantity--;
          setLocalStorage(this.key, cartItems);
          this.renderCartContents();
          updateCartCount();
        }
      } else if (btn.classList.contains('cart-remove-btn')) {
        const card = btn.closest('.cart-card');
        const removedName = cartItems[index].Name;
        card.classList.add('removing');

        setTimeout(() => {
          cartItems.splice(index, 1);
          setLocalStorage(this.key, cartItems);
          this.renderCartContents();
          updateCartCount();
          this.showToast(`Removed ${removedName}`);
        }, 350);
      }
    });

    itemsContainer.addEventListener('change', (e) => {
      if (e.target.classList.contains('cart-qty-value')) {
        const index = parseInt(e.target.dataset.index);
        let val = parseInt(e.target.value);
        const cartItems = getLocalStorage(this.key) || [];

        if (isNaN(val) || val < 1) val = 1;
        if (val > 99) val = 99;

        cartItems[index].Quantity = val;
        setLocalStorage(this.key, cartItems);
        this.renderCartContents();
        updateCartCount();
      }
    });
  }

  initSummaryEvents() {
    const promoBtn = document.getElementById('promo-apply-btn');
    const promoInput = document.getElementById('promo-input');
    const checkoutBtn = document.getElementById('btn-checkout');

    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim();
        if (code) {
          this.showToast(`Promo code "${code}" applied (demo only)`);
        }
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cartItems = getLocalStorage(this.key) || [];
        if (cartItems.length > 0) {
          window.location.href = '../checkout/index.html';
        } else {
          this.showToast('Your cart is empty!');
        }
      });
    }
  }

  showToast(message) {
    const toast = document.getElementById('cart-toast');
    const msgSpan = document.getElementById('cart-toast-msg');
    if (toast && msgSpan) {
      msgSpan.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  }
}