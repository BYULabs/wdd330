import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource, category) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.category = category;
    this.product = {};
    this.selectedImageIndex = 0;
    this.selectedColorIndex = 0;
    this.quantity = 1;
    this.allImages = [];
  }

  async init() {
    this.product = await this.dataSource.findProductById(
      this.productId,
      this.category,
    );
    if (!this.product) {
      console.error('Product not found');
      return;
    }

    // Safe Extraction of Primary Image (checking both casings)
    const primaryImg =
      this.product.Images?.PrimaryExtraLarge ||
      this.product.Images?.primaryExtraLarge ||
      this.product.Image ||
      '';

    this.allImages = [{ title: 'Primary Image', src: primaryImg }];

    // Safe Extraction of Extra Images (checking both ExtraImages and extraImages)
    const extraImagesList =
      this.product.Images?.ExtraImages || this.product.Images?.extraImages;

    if (extraImagesList && Array.isArray(extraImagesList)) {
      const parsedExtras = extraImagesList.map((imgItem, index) => {
        // If it's a plain URL string:
        if (typeof imgItem === 'string') {
          return {
            title: `Alternate View ${index + 1}`,
            src: imgItem,
          };
        }
        // If it's an object, safely check both PascalCase (Src) and camelCase (src)
        return {
          title:
            imgItem.Title || imgItem.title || `Alternate View ${index + 1}`,
          src: imgItem.Src || imgItem.src || '',
        };
      });

      this.allImages.push(...parsedExtras);
    }

    this.renderProductDetails('main.product-detail');
    this.setupInteractivity();
    this.renderRelatedProducts();
  }

  // Toast Notification Trigger
  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  }

  addToCart() {
    let cartItems = getLocalStorage('so-cart');
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingItem = cartItems.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 1) + this.quantity;
    } else {
      // Create a shallow copy of the product to prevent mutations
      const itemToAdd = { ...this.product, Quantity: this.quantity };
      cartItems.push(itemToAdd);
    }

    setLocalStorage('so-cart', cartItems);
    updateCartCount();

    this.showToast(
      `Added ${this.quantity} item${this.quantity > 1 ? 's' : ''} to cart!`,
    );
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    // Build the dynamic Breadcrumbs
    const catName = this.category
      ? this.category.charAt(0).toUpperCase() + this.category.slice(1)
      : 'Products';
    document.getElementById('breadcrumb-category').textContent = catName;
    document.getElementById('breadcrumb-category').href =
      `../product_listing/index.html?category=${this.category}`;
    document.getElementById('breadcrumb-name').textContent =
      this.product.NameWithoutBrand;

    // Setup Badges HTML
    let badgesHtml = '';
    if (this.product.IsClearance) {
      badgesHtml += '<span class="badge badge--clearance">Clearance</span>';
    }
    if (this.product.IsNew) {
      badgesHtml += '<span class="badge badge--new">New Arrival</span>';
    }

    // Setup Color Chip Swatches HTML
    let colorsHtml = '';
    if (this.product.Colors && this.product.Colors.length > 0) {
      colorsHtml = this.product.Colors.map(
        (color, i) => `
        <div class="color-swatch ${i === this.selectedColorIndex ? 'active' : ''}" data-index="${i}">
          <img src="${color.ColorChipImageSrc}" alt="${color.ColorName}" title="${color.ColorName}">
        </div>
      `,
      ).join('');
    }

    // Setup Specification Rows
    const specs = [
      ['Brand', this.product.Brand?.Name || 'N/A'],
      ['Product ID', this.product.Id],
      ['Category', catName],
      ['List Price', `$${(this.product.ListPrice || 0).toFixed(2)}`],
      [
        'Suggested Retail',
        `$${(this.product.SuggestedRetailPrice || 0).toFixed(2)}`,
      ],
      [
        'Colors Available',
        this.product.Colors?.map((c) => c.ColorName).join(', ') || 'N/A',
      ],
    ];
    const specsTableRows = specs
      .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
      .join('');

    // Primary Image Source
    const mainImgUrl = this.allImages[this.selectedImageIndex]?.src || '';

    // Calculations for retail price comparison
    const hasDiscount =
      this.product.SuggestedRetailPrice > this.product.FinalPrice;
    const savings = hasDiscount
      ? this.product.SuggestedRetailPrice - this.product.FinalPrice
      : 0;
    const savingsPct = hasDiscount
      ? Math.round((savings / this.product.SuggestedRetailPrice) * 100)
      : 0;

    element.innerHTML = `
      <!-- Gallery Column -->
      <div class="product-gallery">
        <div class="gallery-main" id="gallery-main">
          <img id="main-image" src="${mainImgUrl}" alt="${this.product.NameWithoutBrand}">
          <span class="zoom-hint">🔍 Click to zoom</span>
        </div>
        <div class="gallery-thumbs" id="gallery-thumbs">
          ${this.allImages
            .map(
              (img, i) => `
            <div class="gallery-thumb ${i === this.selectedImageIndex ? 'active' : ''}" data-index="${i}">
              <img src="${img.src}" alt="${img.title}">
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Detail Info Column -->
      <div class="product-info">
        <div class="product-brand">
          ${this.product.Brand?.LogoSrc ? `<img src="${this.product.Brand.LogoSrc}" alt="${this.product.Brand.Name}">` : ''}
          <span>${this.product.Brand?.Name || ''}</span>
        </div>

        <h1 class="product-title">${this.product.NameWithoutBrand}</h1>

        <div class="product-badges">${badgesHtml}</div>

        <div class="product-rating">
          <div class="stars" id="stars">
            <!-- Simulated 4-star rating for demo -->
            <span style="color: var(--primary-color)">★★★★☆</span>
          </div>
          <span class="review-count">No reviews yet</span>
        </div>

        <div class="product-pricing">
          <div class="price-row">
            <span class="price-final">$${(this.product.FinalPrice || 0).toFixed(2)}</span>
            ${
              hasDiscount
                ? `
              <span class="price-retail">$${this.product.SuggestedRetailPrice.toFixed(2)}</span>
              <span class="price-savings">Save ${savingsPct}% ($${savings.toFixed(2)})</span>
            `
                : ''
            }
          </div>
        </div>

        <div class="product-description">
          ${this.product.DescriptionHtmlSimple}
        </div>

        ${
          colorsHtml
            ? `
          <div class="product-option" id="color-option">
            <div class="option-label">
              Color: <span class="selected-value" id="selected-color-name">${this.product.Colors[this.selectedColorIndex].ColorName}</span>
            </div>
            <div class="color-options" id="color-options">${colorsHtml}</div>
          </div>
        `
            : ''
        }

        <!-- Quantity Selector -->
        <div class="product-option">
          <div class="option-label">Quantity</div>
          <div class="quantity-selector">
            <button class="quantity-btn" id="qty-minus">−</button>
            <input class="quantity-value" id="qty-input" type="number" value="${this.quantity}" min="1" max="10">
            <button class="quantity-btn" id="qty-plus">+</button>
          </div>
        </div>

        <!-- Checkout Buttons -->
        <div class="add-to-cart-section">
          <button class="btn-add-to-cart" id="addToCart">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Add to Cart
          </button>
          <button class="btn-wishlist" id="btn-wishlist">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <!-- Trust signals -->
        <div class="trust-signals">
          <div class="trust-item"><span class="trust-icon">🚚</span> <strong>Free shipping</strong> on orders $75+</div>
          <div class="trust-item"><span class="trust-icon">🔄</span> <strong>60-day</strong> easy returns</div>
          <div class="trust-item"><span class="trust-icon">🛡️</span> <strong>Lifetime</strong> warranty</div>
          <div class="trust-item"><span class="trust-icon">📦</span> In stock — <strong>ships in 1–2 days</strong></div>
        </div>
      </div>

      <!-- Tab Details (Span across both columns grid-column 1 / -1) -->
      <div class="product-tabs">
        <div class="tab-buttons">
          <button class="tab-btn active" data-tab="specs">Specifications</button>
          <button class="tab-btn" data-tab="reviews">Reviews</button>
        </div>
        <div class="tab-content active" id="tab-specs">
          <table class="specs-table">
            ${specsTableRows}
          </table>
        </div>
        <div class="tab-content" id="tab-reviews">
          <div class="reviews-placeholder">
            <div class="icon">⭐</div>
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience with this product.</p>
            <button class="btn-write-review">Write a Review</button>
          </div>
        </div>
      </div>
    `;
  }

  setupInteractivity() {
    // 1. Add to Cart Listener
    const addBtn = document.getElementById('addToCart');
    if (addBtn) addBtn.addEventListener('click', this.addToCart.bind(this));

    // 2. Thumbnail Clicks
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', (e) => {
        const target = e.currentTarget;
        this.selectedImageIndex = parseInt(target.dataset.index);

        // Update Active states
        thumbs.forEach((t) => t.classList.remove('active'));
        target.classList.add('active');

        // Swap image
        document.getElementById('main-image').src =
          this.allImages[this.selectedImageIndex].src;
      });
    });

    // 3. Color Chip Selector Clicks
    const swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', (e) => {
        const target = e.currentTarget;
        this.selectedColorIndex = parseInt(target.dataset.index);

        swatches.forEach((s) => s.classList.remove('active'));
        target.classList.add('active');

        const colorName =
          this.product.Colors[this.selectedColorIndex].ColorName;
        document.getElementById('selected-color-name').textContent = colorName;
      });
    });

    // 4. Quantity Adjustments
    const qtyInput = document.getElementById('qty-input');
    const minusBtn = document.getElementById('qty-minus');
    const plusBtn = document.getElementById('qty-plus');

    if (qtyInput && minusBtn && plusBtn) {
      minusBtn.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          qtyInput.value = this.quantity;
        }
      });
      plusBtn.addEventListener('click', () => {
        if (this.quantity < 10) {
          this.quantity++;
          qtyInput.value = this.quantity;
        }
      });
      qtyInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 10) val = 10;
        this.quantity = val;
        e.target.value = val;
      });
    }

    // 5. Wishlist toggle
    const wishlistBtn = document.getElementById('btn-wishlist');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        wishlistBtn.classList.toggle('active');
        if (wishlistBtn.classList.contains('active')) {
          this.showToast('Added to wishlist ❤️');
        } else {
          this.showToast('Removed from wishlist');
        }
      });
    }

    // 6. Tabs switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach((b) => b.classList.remove('active'));
        document
          .querySelectorAll('.tab-content')
          .forEach((c) => c.classList.remove('active'));

        btn.classList.add('active');
        const tabContentId =
          btn.dataset.tab === 'specs' ? 'tab-specs' : 'tab-reviews';
        document.getElementById(tabContentId).classList.add('active');
      });
    });

    // 7. Zoom Overlay Handlers
    const galleryMain = document.getElementById('gallery-main');
    const zoomOverlay = document.getElementById('zoom-overlay');
    const zoomImage = document.getElementById('zoom-image');
    const zoomClose = document.getElementById('zoom-close');

    if (galleryMain && zoomOverlay && zoomImage) {
      galleryMain.addEventListener('click', () => {
        zoomImage.src = this.allImages[this.selectedImageIndex].src;
        zoomOverlay.classList.add('active');
      });

      zoomOverlay.addEventListener('click', (e) => {
        if (e.target === zoomOverlay || e.target === zoomClose) {
          zoomOverlay.classList.remove('active');
        }
      });
    }
  }

  // Optional: Populates "You Might Also Like" section dynamically based on your category search
  async renderRelatedProducts() {
    try {
      const allCategoryProducts = await this.dataSource.getData(this.category);
      const relatedGrid = document.getElementById('related-grid');

      if (allCategoryProducts && relatedGrid) {
        // Filter out current product and show up to 4 other items
        const rawRelated = allCategoryProducts
          .filter((p) => p.Id !== this.productId)
          .slice(0, 4);

        relatedGrid.innerHTML = rawRelated
          .map(
            (p) => `
          <div class="product-card">
            <a href="index.html?product=${p.Id}&category=${this.category}">
              <div class="card__image">
                <img src="${p.Images?.PrimaryMedium || p.Image}" alt="${p.NameWithoutBrand}">
              </div>
              <div class="card__info">
                <h3 class="card__brand">${p.Brand?.Name || ''}</h3>
                <h2 class="card__name">${p.NameWithoutBrand}</h2>
                <p class="product-card__price">$${p.FinalPrice.toFixed(2)}</p>
              </div>
            </a>
          </div>
        `,
          )
          .join('');
      }
    } catch (err) {
      console.warn('Could not load related products.', err);
    }
  }
}
