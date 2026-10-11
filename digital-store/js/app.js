/* ============================================
   XIMSS Storefront — Client-side logic
   ============================================ */

const STORAGE_KEYS = {
  products: 'ximss_products',
  settings: 'ximss_settings',
  cart: 'ximss_cart',
  orders: 'ximss_orders'
};

// Default products
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'XIMSS Optimizer Pro',
    desc: 'System optimizer & cleaner for Windows',
    fullDesc: 'Boost performance, clean junk files, manage startup items. Lightweight EXE with lifetime updates.',
    price: 19.99,
    category: 'Utility',
    image: '',
    active: true
  },
  {
    id: 'p2',
    name: 'KeyGen Studio',
    desc: 'License key generation toolkit',
    fullDesc: 'Generate secure license keys for your own software. Includes templates and encryption helpers.',
    price: 29.99,
    category: 'Tool',
    image: '',
    active: true
  },
  {
    id: 'p3',
    name: 'NetShield EXE',
    desc: 'Lightweight network monitor & firewall helper',
    fullDesc: 'Monitor connections, block unwanted traffic, and keep your system secure. Portable EXE.',
    price: 14.99,
    category: 'EXE',
    image: '',
    active: true
  },
  {
    id: 'p4',
    name: 'CodeVault Encryptor',
    desc: 'File & folder encryption utility',
    fullDesc: 'AES-256 encryption for sensitive files. Drag-and-drop interface, password + keyfile support.',
    price: 24.99,
    category: 'Software',
    image: '',
    active: true
  }
];

const DEFAULT_SETTINGS = {
  shopName: 'XIMSS',
  heroTitle: 'XIMSS',
  heroSubtitle: 'Premium digital software, tools & EXEs — instant delivery',
  aboutTitle: 'About XIMSS',
  aboutText: 'XIMSS is your trusted source for premium digital software, utilities, and executable tools. Every product is carefully curated, tested, and delivered with a unique license key the moment you complete your order. Fast, secure, and built for developers and power users.',
  icon: '⚡',
  bannerUrl: '',
  bannerData: ''
};

// ---------- Helpers ----------
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProducts() {
  return load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
}

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...load(STORAGE_KEYS.settings, {}) };
}

function getCart() {
  return load(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
  save(STORAGE_KEYS.cart, cart);
  updateCartUI();
}

function generateKey() {
  const segments = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let s = 0; s < 4; s++) {
    let seg = '';
    for (let i = 0; i < 4; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return 'XIMSS-' + segments.join('-');
}

// ---------- Apply Settings ----------
function applySettings() {
  const s = getSettings();
  document.title = `${s.shopName} — Premium Digital Software`;
  document.getElementById('shop-name').textContent = s.shopName;
  document.getElementById('footer-shop-name').textContent = s.shopName;
  document.getElementById('nav-icon').textContent = s.icon;
  document.getElementById('hero-title').textContent = s.heroTitle;
  document.getElementById('hero-subtitle').textContent = s.heroSubtitle;
  document.getElementById('about-title').textContent = s.aboutTitle;
  document.getElementById('about-text').textContent = s.aboutText;

  // Banner
  const banner = document.getElementById('hero-banner');
  if (s.bannerData) {
    banner.style.backgroundImage = `url(${s.bannerData})`;
  } else if (s.bannerUrl) {
    banner.style.backgroundImage = `url(${s.bannerUrl})`;
  } else {
    banner.style.backgroundImage = '';
  }

  // Favicon (simple emoji)
  const fav = document.getElementById('favicon');
  if (fav && s.icon) {
    fav.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${encodeURIComponent(s.icon)}</text></svg>`;
  }
}

// ---------- Render Products ----------
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const products = getProducts().filter(p => p.active);

  if (products.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-dim);padding:40px;">No products available yet. Add some in the Admin panel.</p>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" />`
          : `<span class="placeholder-icon">⚡</span>`}
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${Number(p.price).toFixed(2)}</span>
          <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');

  // Click card → modal
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) return;
      openProductModal(card.dataset.id);
    });
  });

  // Add to cart buttons
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id);
    });
  });
}

// ---------- Product Modal ----------
function openProductModal(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product) return;

  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div style="text-align:center;margin-bottom:20px;font-size:3rem;">
      ${product.image ? `<img src="${product.image}" style="max-height:160px;border-radius:8px;margin:0 auto;" />` : '⚡'}
    </div>
    <div class="product-category">${product.category}</div>
    <h2 style="margin-bottom:8px;">${product.name}</h2>
    <p style="color:var(--text-muted);margin-bottom:16px;">${product.fullDesc || product.desc}</p>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:24px;">
      <span class="product-price" style="font-size:1.5rem;">$${Number(product.price).toFixed(2)}</span>
      <button class="btn btn-primary" id="modal-add-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  `;

  document.getElementById('product-modal').classList.add('open');
  document.getElementById('modal-add-cart').addEventListener('click', () => {
    addToCart(product.id);
    closeModal('product-modal');
  });
}

// ---------- Cart ----------
function addToCart(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function updateCartUI() {
  const cart = getCart();
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    totalEl.textContent = '$0.00';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name} ${item.qty > 1 ? `×${item.qty}` : ''}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" title="Remove">×</button>
    </div>
  `).join('');

  itemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

// ---------- Checkout ----------
function openCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  closeCart();
  const summary = document.getElementById('order-summary');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  summary.innerHTML = cart.map(i => `
    <div class="order-summary-item">
      <span>${i.name} ×${i.qty}</span>
      <span>$${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join('') + `
    <div class="order-summary-total">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;

  document.getElementById('checkout-modal').classList.add('open');
}

function processCheckout(e) {
  e.preventDefault();
  const email = document.getElementById('checkout-email').value.trim();
  const name = document.getElementById('checkout-name').value.trim();
  const cart = getCart();
  if (!email || !name || cart.length === 0) return;

  const key = generateKey();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: 'ord_' + Date.now(),
    date: new Date().toISOString(),
    name,
    email,
    items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    total,
    key
  };

  const orders = load(STORAGE_KEYS.orders, []);
  orders.unshift(order);
  save(STORAGE_KEYS.orders, orders);

  // Clear cart
  saveCart([]);

  // Show key
  document.getElementById('license-key').textContent = key;
  closeModal('checkout-modal');
  document.getElementById('success-modal').classList.add('open');

  // Simulate notification
  console.log('%c[XIMSS] New order!', 'color:#4ade80;font-weight:bold');
  console.log('Customer:', name, email);
  console.log('Key:', key);
  console.log('Total: $' + total.toFixed(2));
}

// ---------- Modal helpers ----------
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  // Seed defaults if empty
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    save(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    save(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }

  applySettings();
  renderProducts();
  updateCartUI();

  document.getElementById('year').textContent = new Date().getFullYear();

  // Events
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  document.getElementById('checkout-btn').addEventListener('click', openCheckout);
  document.getElementById('close-modal').addEventListener('click', () => closeModal('product-modal'));
  document.getElementById('close-checkout').addEventListener('click', () => closeModal('checkout-modal'));
  document.getElementById('close-success').addEventListener('click', () => closeModal('success-modal'));
  document.getElementById('checkout-form').addEventListener('submit', processCheckout);

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! (Demo — no real email is sent.)');
    e.target.reset();
  });

  // Mobile menu
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});
