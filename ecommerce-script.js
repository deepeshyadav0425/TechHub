// ==================== MOUSE TRACKING & INTERACTIVE EFFECTS ====================
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = (e.clientX / window.innerWidth) * 10;
    const y = (e.clientY / window.innerHeight) * 10;
    
    shapes.forEach((shape, index) => {
        shape.style.transform = `translate(${x * (index + 1)}px, ${y * (index + 1)}px)`;
    });
});

// Add glow effect to product cards on mouse move
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    });
});

// ==================== PRODUCT DATA ====================
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 129.99,
        emoji: "🎧",
        // REPLACE THE LINK BELOW WITH YOUR IMAGE LINK
        image: "Headphones.jpg",
        rating: 4.5,
        description: "Premium wireless headphones with noise cancellation.",
        featured: true
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "gadgets",
        price: 299.99,
        emoji: "⌚",
        image: "smart watch.jpg",
        rating: 4.8,
        description: "Advanced smartwatch with health monitoring.",
        featured: false
    },
    {
        id: 3,
        name: "USB-C Cable",
        category: "accessories",
        price: 19.99,
        emoji: "🔌",
        image: "usb c cable.jpg",
        rating: 4.2,
        description: "Durable braided fast charging cable.",
        featured: false
    },
    {
        id: 4,
        name: "4K Webcam",
        category: "electronics",
        price: 189.99,
        emoji: "📷",
        image: "webcam.jpg",
        rating: 4.6,
        description: "Professional webcam for streaming.",
        featured: true
    },
    {
        id: 5,
        name: "Phone Stand",
        category: "accessories",
        price: 24.99,
        emoji: "📱",
        image: "phone stand.jpg",
        rating: 4.3,
        description: "Adjustable aluminum phone stand.",
        featured: false
    },
    {
        id: 6,
        name: "Portable SSD",
        category: "electronics",
        price: 149.99,
        emoji: "💾",
        image: "ssd.jpg",
        rating: 4.7,
        description: "1TB high-speed storage.",
        featured: true
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        category: "gadgets",
        price: 79.99,
        emoji: "🔊",
        image: "speakers.jpg",
        rating: 4.4,
        description: "Waterproof portable speaker.",
        featured: false
    },
    {
        id: 8,
        name: "Screen Protector",
        category: "accessories",
        price: 12.99,
        emoji: "🛡️",
        image: "screen protector.jpg",
        rating: 4.1,
        description: "Tempered glass protection.",
        featured: false
    },
    {
        id: 9,
        name: "Wireless Charger",
        category: "gadgets",
        price: 39.99,
        emoji: "⚡",
        image: "wireless charger.jpg",
        rating: 4.5,
        description: "Fast charging pad.",
        featured: false
    },
    {
        id: 10,
        name: "Laptop Stand",
        category: "accessories",
        price: 34.99,
        emoji: "💻",
        image: "laptop stand.jpg",
        rating: 4.2,
        description: "Ergonomic cooling stand.",
        featured: false
    },
    {
        id: 11,
        name: "Gaming Mouse",
        category: "electronics",
        price: 69.99,
        emoji: "🖱️",
        image: "gaming mouse.jpg",
        rating: 4.6,
        description: "High-precision RGB mouse.",
        featured: true
    },
    {
        id: 12,
        name: "Mechanical Keyboard",
        category: "electronics",
        price: 119.99,
        emoji: "⌨️",
        image: "keyboard.jpg",
        rating: 4.7,
        description: "Premium tactile keyboard.",
        featured: true
    }
];

// ==================== STATE MANAGEMENT ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentFilter = 'all';
let currentSearchTerm = '';
let selectedProduct = null;

// ==================== DOM ELEMENTS ====================
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const quickViewModal = document.getElementById('quickViewModal');
const modalClose = document.getElementById('modalClose');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// ==================== EVENT LISTENERS ====================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProducts();
    });
});

searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    renderProducts();
});

cartIcon.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
modalClose.addEventListener('click', closeQuickViewModal);

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// ==================== RENDER PRODUCTS ====================
function renderProducts() {
    let filtered = products;

    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }

    // Filter by search term
    if (currentSearchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(currentSearchTerm) ||
            p.description.toLowerCase().includes(currentSearchTerm) ||
            p.category.toLowerCase().includes(currentSearchTerm)
        );
    }

    // Sort featured products first
    filtered.sort((a, b) => b.featured - a.featured);

    productsGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');

    // Add event listeners to new cards
    document.querySelectorAll('.quick-view-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => openQuickViewModal(filtered[index]));
    });

    document.querySelectorAll('.add-to-cart-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => addToCart(filtered[index]));
    });

    document.querySelectorAll('.wishlist-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => toggleWishlist(filtered[index], btn));
    });
}

function createProductCard(product) {
    const isWishlisted = wishlist.includes(product.id);

    return `
        <div class="product-card">
            ${product.featured ? '<div class="product-badge">FEATURED</div>' : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span class="emoji-fallback" style="display:none;">${product.emoji}</span>
                <button class="wishlist-btn${isWishlisted ? ' active' : ''}" type="button"
                    aria-label="${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist"
                    aria-pressed="${isWishlisted}" title="${isWishlisted ? 'Remove from' : 'Add to'} wishlist">${isWishlisted ? '♥' : '♡'}</button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span>${product.rating} ⭐</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="quick-view-btn">Quick View</button>
                        <button class="add-to-cart-btn">Add Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleWishlist(product, button) {
    const isWishlisted = wishlist.includes(product.id);

    wishlist = isWishlisted
        ? wishlist.filter(id => id !== product.id)
        : [...wishlist, product.id];
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    const nextIsWishlisted = !isWishlisted;
    button.classList.toggle('active', nextIsWishlisted);
    button.textContent = nextIsWishlisted ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(nextIsWishlisted));
    button.setAttribute(
        'aria-label',
        `${nextIsWishlisted ? 'Remove' : 'Add'} ${product.name} ${nextIsWishlisted ? 'from' : 'to'} wishlist`
    );
    button.title = `${nextIsWishlisted ? 'Remove from' : 'Add to'} wishlist`;
}

// ==================== QUICK VIEW MODAL ====================
function openQuickViewModal(product) {
    selectedProduct = product;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.name;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductRating').textContent = `${product.rating} out of 5 stars`;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
    
    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const modalAddToCartBtn = document.getElementById('modalAddToCart');
    modalAddToCartBtn.onclick = () => {
        addToCart(product);
        closeQuickViewModal();
    };
}

function closeQuickViewModal() {
    quickViewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedProduct = null;
}

quickViewModal.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        closeQuickViewModal();
    }
});

// ==================== CART FUNCTIONS ====================
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            emoji: product.emoji,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showAddedNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItemsEl.innerHTML = cart.map(item => createCartItemHTML(item)).join('');

        // Add event listeners to cart item buttons
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                const action = e.currentTarget.dataset.action;
                const item = cart.find(i => i.id === productId);
                
                if (action === 'increase') {
                    updateQuantity(productId, item.quantity + 1);
                } else if (action === 'decrease') {
                    updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                removeFromCart(productId);
            });
        });
    }

    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-header">
                <span class="cart-item-name">${item.emoji} ${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" data-product-id="${item.id}" data-action="decrease">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-product-id="${item.id}" data-action="increase">+</button>
                <button class="remove-btn" data-product-id="${item.id}">Remove</button>
            </div>
        </div>
    `;
}

function openCart() {
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showAddedNotification() {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(224, 224, 224, 0.9));
        color: #000000;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInUp 0.4s ease;
        box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    notification.textContent = '✓ Added to cart!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 2000);
}

// ==================== AUTHENTICATION & USER MANAGEMENT ====================
const ACCOUNT_STORAGE_KEY = 'techhubAccounts';
const ORDER_STORAGE_KEY = 'techhubOrders';
const PASSWORD_ITERATIONS = 210000;

function readStoredJson(key, fallback) {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return fallback;

    try {
        return JSON.parse(storedValue);
    } catch (error) {
        console.error(`Unable to read ${key} from browser storage.`, error);
        if (key === ACCOUNT_STORAGE_KEY || key === ORDER_STORAGE_KEY) {
            throw new Error('Saved account or order data is invalid. Clear this site’s browser data and try again.');
        }
        return fallback;
    }
}

const storedSession = readStoredJson('currentUser', null);
let currentUser = storedSession && storedSession.email && storedSession.name
    ? { email: String(storedSession.email), name: String(storedSession.name) }
    : null;

if (currentUser && (storedSession.password || storedSession.loginTime)) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const checkoutModal = document.getElementById('checkoutModal');
const billModal = document.getElementById('billModal');
const profileModal = document.getElementById('profileModal');
const orderHistoryModal = document.getElementById('orderHistoryModal');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const checkoutForm = document.getElementById('checkoutForm');

const checkoutBtn = document.getElementById('checkoutBtn');

// ==================== NAVBAR LOGIN & USER PROFILE ====================
const navLoginBtn = document.getElementById('navLoginBtn');
const userProfile = document.getElementById('userProfile');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize user UI on page load
function initializeUserUI() {
    if (currentUser) {
        navLoginBtn.style.display = 'none';
        userProfile.classList.add('active');
        document.getElementById('userName').textContent = currentUser.name.split(' ')[0];
    } else {
        navLoginBtn.style.display = 'flex';
        userProfile.classList.remove('active');
    }
}

function setAuthMessage(formType, message = '', isError = false) {
    const messageElement = document.getElementById(`${formType}Message`);
    messageElement.textContent = message;
    messageElement.classList.toggle('error', isError);
    messageElement.classList.toggle('success', Boolean(message) && !isError);
}

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function readAccounts() {
    const accounts = readStoredJson(ACCOUNT_STORAGE_KEY, []);
    if (!Array.isArray(accounts)) {
        throw new Error('Saved accounts are invalid. Clear this site’s browser data and try again.');
    }
    return accounts;
}

function bytesToBase64(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function hashPassword(password, salt) {
    if (!window.crypto?.subtle) {
        throw new Error('Password protection is unavailable in this browser. Open the site in a modern browser.');
    }

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );
    const hash = await crypto.subtle.deriveBits({
        name: 'PBKDF2',
        salt,
        iterations: PASSWORD_ITERATIONS,
        hash: 'SHA-256'
    }, key, 256);
    return bytesToBase64(hash);
}

async function createPasswordRecord(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return {
        salt: bytesToBase64(salt),
        verifier: await hashPassword(password, salt),
        iterations: PASSWORD_ITERATIONS
    };
}

async function verifyPassword(password, account) {
    const salt = Uint8Array.from(atob(account.salt), character => character.charCodeAt(0));
    return await hashPassword(password, salt) === account.verifier;
}

function startSession(account) {
    const user = { name: account.name, email: account.email };
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
    initializeUserUI();
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    if (!document.querySelector('.modal.active')) {
        document.body.style.overflow = '';
    }
}

document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const passwordInput = document.getElementById(button.dataset.passwordTarget);
        const isVisible = passwordInput.type === 'text';
        passwordInput.type = isVisible ? 'password' : 'text';
        button.textContent = isVisible ? 'Show' : 'Hide';
        button.setAttribute('aria-label', `${isVisible ? 'Show' : 'Hide'} password`);
        button.setAttribute('aria-pressed', String(!isVisible));
    });
});

// Open login modal from navbar button
navLoginBtn.addEventListener('click', () => {
    setAuthMessage('login');
    openModal(loginModal);
    document.getElementById('loginEmail').focus();
});

// Toggle profile dropdown
profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
});

// Close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile')) {
        profileDropdown.classList.remove('active');
    }
});

// Profile View Button
document.getElementById('profileViewBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    profileDropdown.classList.remove('active');
    if (!currentUser) return;
    document.getElementById('accountProfileName').textContent = currentUser.name;
    document.getElementById('accountProfileEmail').textContent = currentUser.email;
    openModal(profileModal);
});

// Order History Button
document.getElementById('orderHistoryBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    profileDropdown.classList.remove('active');
    renderOrderHistory();
    openModal(orderHistoryModal);
});

function renderOrderHistory() {
    const historyContent = document.getElementById('orderHistoryContent');
    const orders = readStoredJson(ORDER_STORAGE_KEY, []);
    const userOrders = Array.isArray(orders)
        ? orders.filter(order => order.customer?.email === currentUser?.email)
        : [];

    if (!userOrders.length) {
        historyContent.innerHTML = '<p class="history-empty">Your orders will appear here after checkout.</p>';
        return;
    }

    historyContent.innerHTML = [...userOrders].reverse().map(order => `
        <article class="order-history-card">
            <div>
                <strong>${escapeHtml(order.orderId)}</strong>
                <span>${escapeHtml(order.orderDate)}</span>
            </div>
            <div>
                <span>${order.items.length} item${order.items.length === 1 ? '' : 's'}</span>
                <strong>${formatCurrency(order.total)}</strong>
            </div>
            <button type="button" class="action-btn history-invoice-btn" data-order-id="${escapeHtml(order.orderId)}">View invoice</button>
        </article>
    `).join('');
}

document.getElementById('orderHistoryContent').addEventListener('click', (event) => {
    const invoiceButton = event.target.closest('[data-order-id]');
    if (!invoiceButton) return;

    const orders = readStoredJson(ORDER_STORAGE_KEY, []);
    const order = Array.isArray(orders)
        ? orders.find(savedOrder => savedOrder.orderId === invoiceButton.dataset.orderId)
        : null;
    if (!order || order.customer?.email !== currentUser?.email) {
        showNotification('This invoice is no longer available.', 'error');
        return;
    }

    closeModal(orderHistoryModal);
    displayBill(order);
    openModal(billModal);
});

// Logout Button
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    profileDropdown.classList.remove('active');
    showNotification('👋 Logged out successfully!', 'success');
    initializeUserUI();
    
    // Close any open modals
    [loginModal, signupModal, checkoutModal, billModal, profileModal, orderHistoryModal]
        .forEach(closeModal);
});

// ==================== LOGIN/SIGNUP EVENT LISTENERS ====================
document.getElementById('switchToSignup').addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMessage('signup');
    closeModal(loginModal);
    openModal(signupModal);
    document.getElementById('signupName').focus();
});

document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMessage('login');
    closeModal(signupModal);
    openModal(loginModal);
    document.getElementById('loginEmail').focus();
});

document.getElementById('loginModalClose').addEventListener('click', () => {
    closeModal(loginModal);
});

document.getElementById('signupModalClose').addEventListener('click', () => {
    closeModal(signupModal);
});

document.getElementById('checkoutModalClose').addEventListener('click', () => {
    closeModal(checkoutModal);
});

document.getElementById('billModalClose').addEventListener('click', () => {
    closeModal(billModal);
});

document.getElementById('closeBillBtn').addEventListener('click', () => closeModal(billModal));
document.getElementById('profileModalClose').addEventListener('click', () => closeModal(profileModal));
document.getElementById('orderHistoryClose').addEventListener('click', () => closeModal(orderHistoryModal));

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const activeModal = document.querySelector('.modal.active');
    if (activeModal) closeModal(activeModal);
});

// Local account sign-in. Production authentication requires a trusted server.
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setAuthMessage('login');

    const email = normalizeEmail(document.getElementById('loginEmail').value);
    const password = document.getElementById('loginPassword').value;

    try {
        const account = readAccounts().find(savedAccount => savedAccount.email === email);
        if (!account || !await verifyPassword(password, account)) {
            setAuthMessage('login', 'Email or password is incorrect.', true);
            return;
        }

        startSession(account);
        loginForm.reset();
        closeModal(loginModal);
        showNotification('Signed in successfully.', 'success');
    } catch (error) {
        console.error('Unable to sign in to the local account.', error);
        setAuthMessage('login', error.message || 'Unable to sign in. Please try again.', true);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setAuthMessage('signup');

    const name = document.getElementById('signupName').value.trim();
    const email = normalizeEmail(document.getElementById('signupEmail').value);
    const password = document.getElementById('signupPassword').value;

    try {
        const accounts = readAccounts();
        if (accounts.some(account => account.email === email)) {
            setAuthMessage('signup', 'An account with this email already exists. Try signing in.', true);
            return;
        }

        const passwordRecord = await createPasswordRecord(password);
        const account = {
            name,
            email,
            ...passwordRecord,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify([...accounts, account]));
        startSession(account);
        signupForm.reset();
        closeModal(signupModal);
        showNotification('Your account is ready.', 'success');
    } catch (error) {
        console.error('Unable to create a local account.', error);
        setAuthMessage('signup', error.message || 'Unable to create your account. Please try again.', true);
    }
});

// ==================== CHECKOUT FLOW ====================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        // Show login modal if not logged in
        closeCartSidebar();
        openModal(loginModal);
        showNotification('Please login first to proceed with checkout', 'info');
        return;
    }
    
    // Pre-fill email from login
    document.getElementById('checkoutEmail').value = currentUser.email;
    document.getElementById('checkoutName').value = currentUser.name;
    
    closeCartSidebar();
    openModal(checkoutModal);
});

// Checkout Form Submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentUser || cart.length === 0) {
        closeModal(checkoutModal);
        showNotification('Sign in and add an item before checking out.', 'error');
        return;
    }

    const items = cart.map(item => ({ ...item }));
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        customer: {
            name: document.getElementById('checkoutName').value.trim(),
            email: currentUser.email,
            address: document.getElementById('checkoutAddress').value.trim(),
            city: document.getElementById('checkoutCity').value.trim(),
            zip: document.getElementById('checkoutZip').value.trim()
        },
        items,
        subtotal,
        tax: subtotal * 0.1,
        orderDate: new Date().toLocaleString(),
        paymentMethod: 'Not collected'
    };

    orderData.total = orderData.subtotal + orderData.tax;

    const previousOrders = readStoredJson(ORDER_STORAGE_KEY, []);
    if (!Array.isArray(previousOrders)) {
        showNotification('Order history could not be saved. Please clear this browser’s saved data and try again.', 'error');
        return;
    }

    try {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([...previousOrders, orderData]));
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
    } catch (error) {
        console.error('Unable to save the order.', error);
        showNotification('Unable to save this order in browser storage.', 'error');
        return;
    }

    closeModal(checkoutModal);
    displayBill(orderData);
    openModal(billModal);
    checkoutForm.reset();
    document.getElementById('checkoutEmail').value = currentUser.email;
    cart = [];
    saveCart();
    updateCartUI();
});

// ==================== BILL GENERATION ====================
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
}

function generateBillHTML(orderData) {
    const itemsHTML = orderData.items.map(item => `
        <tr>
            <td class="product-cell">${escapeHtml(item.emoji)} ${escapeHtml(item.name)}</td>
            <td class="price-cell">${formatCurrency(item.price)}</td>
            <td class="qty-cell">${Number(item.quantity) || 0}</td>
            <td class="total-cell">${formatCurrency(Number(item.price) * Number(item.quantity))}</td>
        </tr>
    `).join('');

    // Generate unique logo for this invoice
    const invoiceLogo = `
        <div class="invoice-watermark">
            <div class="watermark-logo">
                <span class="watermark-icon">⚡</span>
                <span class="watermark-text">TechHub</span>
            </div>
            <div class="watermark-tagline">Premium Tech Store</div>
        </div>
    `;
    
    return `
        <div class="bill-container">
            <!-- Watermark Logo in Background -->
            ${invoiceLogo}

            <!-- Header Section -->
            <div class="bill-header">
                <div class="header-top">
                    <div class="company-logo">
                        <span class="logo-icon">⚡</span>
                        <span class="logo-text">TechHub</span>
                    </div>
                    <div class="invoice-badge">✓ ORDER SUMMARY · SAVED LOCALLY</div>
                </div>
                <div class="header-title">
                    <h1 id="invoiceDialogTitle">INVOICE</h1>
                    <p class="invoice-subtitle">Your TechHub order summary</p>
                </div>
            </div>

            <!-- Order Status Bar -->
            <div class="order-status">
                <div class="status-item active">
                    <span class="status-icon">🛍️</span>
                    <span class="status-label">Order created</span>
                </div>
                <div class="status-line"></div>
                <div class="status-item active">
                    <span class="status-icon">💾</span>
                    <span class="status-label">Saved locally</span>
                </div>
                <div class="status-line"></div>
                <div class="status-item">
                    <span class="status-icon">💳</span>
                    <span class="status-label">Not paid</span>
                </div>
                <div class="status-line"></div>
                <div class="status-item">
                    <span class="status-icon">📦</span>
                    <span class="status-label">Not shipped</span>
                </div>
            </div>

            <!-- Order Info Section -->
            <div class="bill-details">
                <div class="detail-card order-info">
                    <h3>📋 ORDER DETAILS</h3>
                    <div class="info-row">
                        <span class="label">Order Number</span>
                        <span class="value">${escapeHtml(orderData.orderId)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Order Date</span>
                        <span class="value">${escapeHtml(orderData.orderDate)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Payment Method</span>
                        <span class="value">💵 Not collected</span>
                    </div>
                </div>

                <div class="detail-card customer-info">
                    <h3>👤 DELIVERY TO</h3>
                    <p class="customer-name">${escapeHtml(orderData.customer.name)}</p>
                    <div class="address-details">
                        <div class="address-line">${escapeHtml(orderData.customer.address)}</div>
                        <div class="address-line">${escapeHtml(orderData.customer.city)}, ${escapeHtml(orderData.customer.zip)}</div>
                        <div class="address-line">📧 ${escapeHtml(orderData.customer.email)}</div>
                    </div>
                </div>
            </div>

            <!-- Items Table -->
            <div class="items-section">
                <h3 class="section-title">🛍️ ORDER ITEMS</h3>
                <table class="bill-items">
                    <thead>
                        <tr>
                            <th>PRODUCT</th>
                            <th class="text-right">PRICE</th>
                            <th class="text-center">QTY</th>
                            <th class="text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
            </div>

            <!-- Summary Section -->
            <div class="summary-section">
                <div class="bill-summary">
                    <div class="summary-row">
                        <span class="summary-label">Subtotal</span>
                        <span class="summary-value">${formatCurrency(orderData.subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Tax (10%)</span>
                        <span class="summary-value">${formatCurrency(orderData.tax)}</span>
                    </div>
                    <div class="summary-row total-row">
                        <span class="summary-label">TOTAL AMOUNT</span>
                        <span class="summary-value total-value">${formatCurrency(orderData.total)}</span>
                    </div>
                </div>
            </div>

            <!-- Footer Section -->
            <div class="bill-footer">
                <div class="footer-message">
                    <h4>✨ Thank you for choosing TechHub!</h4>
                    <p>This order is saved only in this browser. No payment was collected and it has not been sent for fulfillment.</p>
                </div>
                <div class="footer-divider"></div>
                <div class="footer-info">
                    <p>This order summary is not proof of payment.</p>
                    <p class="footer-copyright">© 2026 TechHub</p>
                </div>
            </div>
        </div>
    `;
}

function displayBill(orderData) {
    const billHTML = generateBillHTML(orderData);
    document.getElementById('billContent').innerHTML = billHTML;
    
    // Store current bill for actions
    window.currentBillData = orderData;
}

// Print the invoice or let the browser save it as a PDF.
document.getElementById('printBillBtn').addEventListener('click', () => {
    const billContent = document.getElementById('billContent').innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
        showNotification('Allow pop-ups to print or save your invoice as a PDF.', 'error');
        return;
    }

    const stylesheet = document.querySelector('link[rel="stylesheet"]')?.href;
    printWindow.addEventListener('load', () => {
        printWindow.focus();
        printWindow.print();
    }, { once: true });

    printWindow.document.write(`
        <html>
        <head>
            <title>Invoice - ${escapeHtml(window.currentBillData.orderId)}</title>
            ${stylesheet ? `<link rel="stylesheet" href="${escapeHtml(stylesheet)}">` : ''}
            <style>
                body { margin: 0; padding: 24px; background: #fff; }
                .bill-container { max-height: none; overflow: visible; margin: 0 auto; box-shadow: none; border: 0; }
                .bill-actions, .modal-close { display: none !important; }
                @page { margin: 12mm; }
                @media print {
                    body { padding: 0; }
                    .bill-container { padding: 12mm; }
                    .detail-card, .bill-summary, .bill-footer, .bill-header { break-inside: avoid; }
                    .bill-items tr { break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            ${billContent}
        </body>
        </html>
    `);
    printWindow.document.close();
});

// ==================== NOTIFICATION FUNCTION ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 5000;
        animation: slideInDown 0.4s ease;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    `;
    
    // Type-specific styling
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        notification.style.color = 'white';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Close modals when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
});

signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) closeModal(signupModal);
});

checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeModal(checkoutModal);
});

billModal.addEventListener('click', (e) => {
    if (e.target === billModal) closeModal(billModal);
});

profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeModal(profileModal);
});

orderHistoryModal.addEventListener('click', (e) => {
    if (e.target === orderHistoryModal) closeModal(orderHistoryModal);
});

// Initialize with user info if logged in
if (currentUser) {
    console.log('User logged in:', currentUser.name);
}

// ==================== PRODUCT CARD HOVER EFFECTS ====================
function addProductCardHoverEffects() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

// ==================== SCROLL ANIMATION OBSERVER ====================
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px' // This helps trigger the animation slightly before they enter the view
    });

    document.querySelectorAll('.product-card, .filter-btn').forEach(el => {
        observer.observe(el);
    });
}

// ==================== UTILITY ANIMATIONS ====================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        navbar.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)';
    } else {
        navbar.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.08)';
    }

});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Force the filter to 'all' and render immediately
    currentFilter = 'all'; 
    renderProducts();
    
    // 2. Existing UI initializations
    updateCartUI();
    addProductCardHoverEffects();
    initializeUserUI();
    observeElements(); // Important for scroll animations

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            const target = document.getElementById(href.slice(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
            }
        });
    });

    // Close cart sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            closeCartSidebar();
        }
    });

    // Add scroll animations
    observeElements();
});

// Add fade out animation to document
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
