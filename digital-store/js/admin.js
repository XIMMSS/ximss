/* ============================================
   XIMSS Admin Panel
   ============================================ */

const STORAGE_KEYS = {
  products: 'ximss_products',
  settings: 'ximss_settings',
  orders: 'ximss_orders'
};

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

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------- Apply nav branding ----------
function applyBranding() {
  const s = getSettings();
  document.getElementById('shop-name').textContent = s.shopName;
  document.getElementById('nav-icon').textContent = s.icon;
  document.title = `Admin — ${s.shopName}`;
  const fav = document.getElementById('favicon');
  if (fav && s.icon) {
    fav.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${encodeURIComponent(s.icon)}</text></svg>`;
  }
}

// ---------- Settings form ----------
function loadSettingsForm() {
  const s = getSettings();
  document.getElementById('setting-shop-name').value = s.shopName;
  document.getElementById('setting-hero-title').value = s.heroTitle;
  document.getElementById('setting-hero-subtitle').value = s.heroSubtitle;
  document.getElementById('setting-about-title').value = s.aboutTitle;
  document.getElementById('setting-about-text').value = s.aboutText;
  document.getElementById('setting-icon').value = s.icon;
  document.getElementById('setting-banner-url').value = s.bannerUrl || '';

  const preview = document.getElementById('banner-preview');
  if (s.bannerData) {
    preview.innerHTML = `<img src="${s.bannerData}" alt="Banner" />`;
  } else if (s.bannerUrl) {
    preview.innerHTML = `<img src="${s.bannerUrl}" alt="Banner" />`;
  } else {
    preview.innerHTML = '<span style="color:var(--text-dim);font-size:0.85rem;">No custom banner</span>';
  }
}

function saveSettings(e) {
  e.preventDefault();
  const current = getSettings();
  const settings = {
    shopName: document.getElementById('setting-shop-name').value.trim() || 'XIMSS',
    heroTitle: document.getElementById('setting-hero-title').value.trim() || 'XIMSS',
    heroSubtitle: document.getElementById('setting-hero-subtitle').value.trim(),
    aboutTitle: document.getElementById('setting-about-title').value.trim(),
    aboutText: document.getElementById('setting-about-text').value.trim(),
    icon: document.getElementById('setting-icon').value.trim() || '⚡',
    bannerUrl: document.getElementById('setting-banner-url').value.trim(),
    bannerData: current.bannerData || ''
  };
  save(STORAGE_KEYS.settings, settings);
  applyBranding();
  alert('Settings saved! Refresh the storefront to see changes.');
}

// Banner file upload
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('setting-banner-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target.result;
        const s = getSettings();
        s.bannerData = data;
        s.bannerUrl = '';
        save(STORAGE_KEYS.settings, s);
        document.getElementById('banner-preview').innerHTML = `<img src="${data}" alt="Banner" />`;
        document.getElementById('setting-banner-url').value = '';
      };
      reader.readAsDataURL(file);
    });
  }
});

// ---------- Products table ----------
function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  const products = getProducts();

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-dim);padding:32px;">No products yet. Click “Add Product”.</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="thumb">
          ${p.image ? `<img src="${p.image}" alt="" />` : '⚡'}
        </div>
      </td>
      <td><strong>${p.name}</strong><br><span style="color:var(--text-dim);font-size:0.85rem;">${p.desc}</span></td>
      <td>$${Number(p.price).toFixed(2)}</td>
      <td>${p.category}</td>
      <td><span class="status-badge ${p.active ? 'active' : 'inactive'}">${p.active ? 'Active' : 'Hidden'}</span></td>
      <td>
        <div class="admin-actions">
          <button class="btn btn-sm btn-ghost edit-btn" data-id="${p.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${p.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openProductForm(btn.dataset.id));
  });
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
  });
}

function openProductForm(id = null) {
  const modal = document.getElementById('product-form-modal');
  const title = document.getElementById('product-form-title');
  const form = document.getElementById('product-form');

  form.reset();
  document.getElementById('product-image-preview').innerHTML = '';
  document.getElementById('product-active').checked = true;

  if (id) {
    const p = getProducts().find(x => x.id === id);
    if (!p) return;
    title.textContent = 'Edit Product';
    document.getElementById('product-id').value = p.id;
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-desc').value = p.desc;
    document.getElementById('product-full-desc').value = p.fullDesc || '';
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-category').value = p.category;
    document.getElementById('product-image').value = p.image || '';
    document.getElementById('product-active').checked = p.active;
    if (p.image) {
      document.getElementById('product-image-preview').innerHTML = `<img src="${p.image}" alt="" />`;
    }
  } else {
    title.textContent = 'Add Product';
    document.getElementById('product-id').value = '';
  }

  modal.classList.add('open');
}

function closeProductForm() {
  document.getElementById('product-form-modal').classList.remove('open');
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  let products = getProducts();

  const imageUrl = document.getElementById('product-image').value.trim();
  // If a file was uploaded, it is already stored in a data URL on the preview
  let image = imageUrl;
  const previewImg = document.querySelector('#product-image-preview img');
  if (previewImg && previewImg.src.startsWith('data:')) {
    image = previewImg.src;
  }

  const product = {
    id: id || uid(),
    name: document.getElementById('product-name').value.trim(),
    desc: document.getElementById('product-desc').value.trim(),
    fullDesc: document.getElementById('product-full-desc').value.trim(),
    price: parseFloat(document.getElementById('product-price').value) || 0,
    category: document.getElementById('product-category').value,
    image: image,
    active: document.getElementById('product-active').checked
  };

  if (id) {
    products = products.map(p => p.id === id ? product : p);
  } else {
    products.push(product);
  }

  save(STORAGE_KEYS.products, products);
  renderProductsTable();
  closeProductForm();
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const products = getProducts().filter(p => p.id !== id);
  save(STORAGE_KEYS.products, products);
  renderProductsTable();
}

// Product image upload
document.addEventListener('DOMContentLoaded', () => {
  const imgInput = document.getElementById('product-image-file');
  if (imgInput) {
    imgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('product-image-preview').innerHTML = `<img src="${ev.target.result}" alt="" />`;
        document.getElementById('product-image').value = ''; // clear URL if file used
      };
      reader.readAsDataURL(file);
    });
  }
});

// ---------- Orders ----------
function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  const orders = load(STORAGE_KEYS.orders, []);

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-dim);padding:32px;">No orders yet.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>${new Date(o.date).toLocaleString()}</td>
      <td>${o.name}</td>
      <td>${o.email}</td>
      <td>${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
      <td>$${Number(o.total).toFixed(2)}</td>
      <td><code style="font-size:0.8rem;color:var(--neon);">${o.key}</code></td>
    </tr>
  `).join('');
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    save(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.settings)) {
    save(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }

  applyBranding();
  loadSettingsForm();
  renderProductsTable();
  renderOrders();

  document.getElementById('settings-form').addEventListener('submit', saveSettings);
  document.getElementById('add-product-btn').addEventListener('click', () => openProductForm());
  document.getElementById('product-form').addEventListener('submit', saveProduct);
  document.getElementById('close-product-form').addEventListener('click', closeProductForm);
  document.getElementById('cancel-product').addEventListener('click', closeProductForm);

  document.getElementById('product-form-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-form-modal') closeProductForm();
  });
});
