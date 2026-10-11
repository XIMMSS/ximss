# XIMSS — Digital Software Storefront

A clean, professional, dark neon-themed storefront for selling digital products (EXEs, tools, software keys).  
Fully client-side — perfect for **GitHub Pages**.

## Features

- **Storefront**
  - Product grid with categories
  - Product detail modal
  - Cart + simulated checkout
  - Instant license-key generation after “purchase”
  - Order history saved in browser

- **Admin Panel** (`admin.html`)
  - Add / edit / delete products
  - Change prices anytime
  - Toggle products active/hidden
  - Upload product images (or use URL)
  - Change shop name, hero title/subtitle, about text
  - Change logo icon (emoji)
  - Upload or set custom banner image
  - View local orders + generated keys

- **Design**
  - Black / white / gray palette
  - Soft neon white/gray accents & glow
  - Professional, easy navigation
  - Fully responsive

## Quick Start (GitHub Pages)

1. Create a new repository on GitHub.
2. Upload the entire contents of this folder (or push via git).
3. Go to **Settings → Pages**.
4. Set source to `main` branch / root (or `/docs` if you put files there).
5. Your store will be live at `https://YOURUSERNAME.github.io/REPO-NAME/`

## Local Testing

Just open `index.html` in a browser, or run a simple static server:

```bash
npx serve .
# or
python -m http.server 8000
```

Then visit `http://localhost:8000`

## How It Works

Everything is stored in the browser’s **localStorage**:

| Key              | What it holds          |
|------------------|------------------------|
| `ximss_products` | Product list           |
| `ximss_settings` | Shop name, texts, banner, icon |
| `ximss_cart`     | Current cart           |
| `ximss_orders`   | Simulated orders + keys|

**Important:** This is a demo / frontend store.  
There is **no real payment processing**. Checkout generates a fake license key and logs the order locally.  
For production you would connect Stripe, PayPal, Gumroad, or a backend + email service.

## Admin Access

Open `admin.html` (linked in the nav).  
No password by default — add basic auth or hide the link if you deploy publicly.

## Customization

1. Open **Admin → Settings**
2. Change shop name, titles, about text, icon
3. Upload a banner image or paste a URL
4. Add/edit products and set prices
5. Refresh the main store page

## File Structure

```
digital-store/
├── index.html          # Storefront
├── admin.html          # Admin dashboard
├── css/
│   └── style.css
├── js/
│   ├── app.js          # Store logic
│   └── admin.js        # Admin logic
└── README.md
```

## License

Free to use and modify for your own projects.
