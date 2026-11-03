# TechHub

TechHub is a responsive, front-end electronics storefront built with HTML, CSS, and vanilla JavaScript.

## Run locally

No build step or package installation is required.

1. Open `index.html` in a modern browser, or serve the project folder with a static web server (for example, VS Code Live Server).
2. Keep the product image files beside `index.html`; the product catalog refers to them by filename.

The page loads Font Awesome from a CDN for some icons, so an internet connection is needed for those icons. The main storefront and product images are local.

## Features

- Responsive landing page and product catalog
- Product search, category filters, quick view, and wishlist
- Shopping cart saved in browser storage
- Sign-up, sign-in, profile, and logout for locally stored accounts
- Browser-local order history and printable invoices

## Storage and checkout limitations

This is a front-end demonstration, not a production e-commerce system. Accounts, sessions, carts, wishlists, and orders are stored in the current browser and are not shared across devices. Passwords are stored as salted PBKDF2 verifiers, but browser storage is still user-accessible and is not a secure authentication system.

Checkout does not collect payment or submit orders for fulfillment. The invoice is an order summary, not proof of payment. Production use requires a trusted backend for authentication, password recovery, order processing, and payment integration.

## Project files

- `index.html` — page structure and dialogs
- `ecommerce-style.css` — styling, responsive layout, and animations
- `ecommerce-script.js` — catalog, cart, account, checkout, and invoice behavior
- `*.jpg` — product images used by the catalog
