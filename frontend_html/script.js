// API URL: set window.BACKEND_URL in index.html for production, or defaults to localhost
const API_URL = (window.BACKEND_URL || 'http://localhost:8080') + '/api';

let currentUser = localStorage.getItem('smartstock_user');
let currentMobile = localStorage.getItem('smartstock_mobile');
let currentCategory = 'All';
let products = [];
let cart = {}; // { productId: { ...lockData, intervalId } }
let pollInterval = null;

// Category emoji map
const categoryEmoji = {
    'Groceries': '🥛',
    'Snacks': '🍟',
    'Beverages': '🥤',
    'Personal Care': '🧴',
    'Fruits & Vegetables': '🥦'
};

// Product-specific image overrides (filename → place in frontend_html/)
const productImages = {
    // Groceries
    'Farm Fresh Milk 500ml': 'milk.jpg',
    'Whole Wheat Bread': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/9ec3963a-b8f7-437d-b1b2-a3e04fe2f62c/The-Health-Factory-Zero-Maida-Whole-Wheat-Bread-Clean-Label-Not-Brown.jpeg',
    'Amul Butter 100g': 'butter.jpg',
    'Tata Salt 1kg': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/1c70221b-4440-4d55-87e7-46fcce72fefd/Tata-Salt-Free-Flowing-and-Iodized-Namak-Vacuum-Evaporated-Salt-in-Fresh.jpeg',
    'Aashirvaad Atta 5kg': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/7e9cf9dc-814f-4dd2-a032-c0759053ae32/Aashirvaad-Select-Atta-Made-from-100-MP-Sharbati-Wheat-for-Softer-Rotis.jpeg',
    // Snacks
    'Lays Classic Salted 26g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/15e1bd77-b474-4f36-a362-8f32842fedcb/Lay-s-Classic-Salted-Potato-Chips-Crispy-Salty.jpeg',
    'Dark Fantasy Choco Fills': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1500-1500,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/4f90eca9-f026-4eef-ae75-4c374efc05fd/Sunfeast-Dark-Fantasy-Choco-Fills-Original-Filled-Cookies-with-Choco-Creme.jpeg',
    'Oreo Chocolate Cream': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1100-1100,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/8b19b84c-b9bb-4dd2-964f-90871e7ca7ab/Cadbury-Oreo-Chocolate-Flavour-Creme-Sandwich-Biscuit-Family-Pack.jpeg',
    'Haldiram Bhujia 200g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1600-1600,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/589adcdf-596c-43c6-bd32-040fd0ae6cb9/Let-s-try-Garlic-Bhujia-Savory-Snack.jpeg',
    'Kurkure Masala Munch': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2000-2000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/98119041-423b-4301-be46-66386cbd9e66/Kurkure-Masala-Munch-Crunchy-Snack.jpeg',
    // Beverages
    'Coca Cola 750ml': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/5e4695df-05d0-4bc7-a3ff-4557b0fdd61b/Coca-Cola-Diet-Coke-Soft-Drink-Can-Low-Calorie-Fizzy.jpeg',
    'Nescafe Instant Coffee': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/f0f4ceb3-deb4-452b-8021-71e8f09ed871/Nescafe-Classic-Instant-Coffee-Powder-100-Pure-Coffee.jpeg',
    'Tropicana Orange Juice 1L': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/6fd7bd67-c9de-4055-95d8-27d1643a15b3/Dabur-Real-Fruit-Power-Orange-Fruit-Juice.jpeg',
    'Red Bull Energy Drink 250ml': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/030fe1cd-fff1-44aa-b812-42580a6a9b30/Red-Bull-Energy-Drink-Ready-to-Drink-Beverage.jpg',
    'Bisleri Water 1L': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2500-2500,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/ff3743d9-aedf-49a7-b0ed-5713e283e18b/Bisleri-Packaged-Drinking-Water-Bottle.jpg',
    // Personal Care
    'Dove Soap 100g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/65e04761-ed54-43a8-baeb-f468fd096366/Dove-Serum-Bar-with-Nutrient-Serum.jpeg',
    'Colgate Toothpaste 200g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1080-1080,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/b8c7ab9a-d1e3-4499-840f-7679ee10bb17/Colgate-Strong-Teeth-Anticavity-Toothpaste.jpeg',
    'Head and Shoulders Shampoo': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2400-2400,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/8c7f38c8-9948-4e20-aa05-f3061c57cc22/Head-Shoulders-Anti-Dandruff-Smooth-Silky-Shampoo.jpeg',
    'Dettol Hand Wash 250ml': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/17f6a51a-aac2-48b7-9820-71dd69e00996/Dettol-Skincare-Hand-Wash-Refill-Moisturizing-Handwash-pH-Balance-Gentle-on-Skin.jpeg',
    'Nivea Moisturizer 75ml': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/f9d8af8a-333f-4cbd-b720-e67cf6656f55/NIVEA-Nourishing-Body-Lotion-Body-Milk-48-H-Moisturization-2X-Almond-Oil-For-Very-Dry-Skin.jpeg',
    // Fruits & Vegetables
    'Banana Robusta 6pcs': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/0f94f079-b7ec-4e97-a4f7-85a4f4d5625c/Banana-Elaichi-Yelakki.jpeg',
    'Tomato Local 500g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/dd677117-fffc-4595-87b3-b2ee62d0e465/Tomato-Local.png',
    'Onion 1kg': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/1e55d6e9-6958-40d3-ac15-1b63fc49e248/Onion.jpeg',
    'Potato 1kg': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/c4286d3c-8773-4dce-8b47-341a5d394978/Potato.png',
    'Apple Shimla 4pcs': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2000-2000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/2d5e21d5-fbfa-463b-9749-a327460aa20a/Baby-Apple-Shimla.jpeg',
    'Mango Alphonso 500g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/2e4f9c1a-6b0d-45da-aaaf-36c331a688c3/Mango-Raw.jpeg',
    'Spinach 250g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-858-858,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/615032c7-9dcb-47b8-9947-35a42f8b9270/Organically-Grown-Spinach.jpeg',
    'Carrot 500g': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-768-768,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/3efbcc36-c254-4fa8-8eb5-e34ad58cb8f7/Carrot-Local.png',
    'Lemon 6pcs': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/6b105f5e-c398-4f79-b630-816f403cf675/Lemon.jpeg',
    'Watermelon 1pc': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/16304024-e632-4b29-abb0-0320997422ce/Watermelon-Kiran-Tarbooj-.jpeg',
    'Strawberry (Mahabaleshwar)': 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,,q-40,dpr-2/cms/product_variant/1830bff1-92d3-4b13-bb3d-19b849c6b669/Strawberry-Mahabaleshwar-.jpg'
};



// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginStep1 = document.getElementById('login-step-1');
const loginStep2 = document.getElementById('login-step-2');
const mobileInput = document.getElementById('mobile-input');
const otpInput = document.getElementById('otp-input');
const displayMobile = document.getElementById('display-mobile');
const userIdDisplay = document.getElementById('user-id-display');
const productGrid = document.getElementById('product-grid');
const categoryList = document.getElementById('category-list');

// --- Session Restore ---
if (currentUser) {
    showApp();
}

// --- Auth Logic ---
document.getElementById('mobile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mobile = mobileInput.value.replace(/\D/g, '');
    if (mobile.length === 10) {
        displayMobile.textContent = mobile;
        loginStep1.classList.add('hidden');
        loginStep2.classList.remove('hidden');
    } else {
        showToast('Please enter a valid 10-digit number', 'error');
    }
});

document.getElementById('back-btn').addEventListener('click', () => {
    loginStep2.classList.add('hidden');
    loginStep1.classList.remove('hidden');
    otpInput.value = '';
});

document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = otpInput.value.trim();
    const mobile = mobileInput.value.replace(/\D/g, '');

    if (otp !== '123456') {
        showToast('Invalid OTP. Use 123456', 'error');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber: mobile })
        });
        const data = await res.json();

        if (res.ok) {
            currentUser = data.userId;
            currentMobile = mobile;
            localStorage.setItem('smartstock_user', currentUser);
            localStorage.setItem('smartstock_mobile', currentMobile);
            showApp();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Cannot reach server. Is the backend running?', 'error');
    } finally {
        btn.textContent = 'Verify & Login';
        btn.disabled = false;
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('smartstock_user');
    localStorage.removeItem('smartstock_mobile');
    currentUser = null;
    cart = {};
    if (pollInterval) clearInterval(pollInterval);
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
    loginStep1.classList.remove('hidden');
    loginStep2.classList.add('hidden');
    mobileInput.value = '';
    otpInput.value = '';
});

// --- App Logic ---
function showApp() {
    userIdDisplay.textContent = currentMobile || `User #${currentUser}`;
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    fetchProducts();
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(fetchProducts, 3000);
}

// Category filter
categoryList.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-card');
    if (!btn) return;
    document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    renderProducts();
});

async function fetchProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) {
            products = await res.json();
            renderProducts();
        }
    } catch (err) {
        console.error('Fetch error', err);
    }
}

function renderProducts() {
    productGrid.innerHTML = '';

    const filtered = currentCategory === 'All'
        ? products
        : products.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 3rem;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                <div>No products found in this category</div>
            </div>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const inCart = cart[p.id];
        const available = p.stockQuantity;
        const emoji = categoryEmoji[p.category] || '📦';
        const img = productImages[p.name];
        const productImgHtml = img
            ? `<img src="${img}" alt="${p.name}">`
            : emoji;

        // Action button — overlaid on image bottom-right
        let actionOverlay = '';
        if (inCart) {
            actionOverlay = `
                <div class="card-in-cart">
                    ✓ In Cart
                    <span class="cart-timer" id="timer-${p.id}">--:--</span>
                </div>`;
        } else if (available === 0) {
            actionOverlay = `<button class="card-add-btn out" disabled>OUT OF STOCK</button>`;
        } else {
            actionOverlay = `<button class="card-add-btn" onclick="addToCart(${p.id})">ADD</button>`;
        }

        // Low stock badge
        let stockBadge = '';
        if (available > 0 && available < 5) {
            stockBadge = `<div class="stock-alert">⚡ Only ${available} left!</div>`;
        } else if (available === 0) {
            stockBadge = `<div class="stock-alert">Out of stock</div>`;
        }

        card.innerHTML = `
            <div class="product-img-wrap">
                ${productImgHtml}
                ${actionOverlay}
            </div>
            <div class="card-body">
                <div class="card-price">
                    <span class="price-badge">₹${p.price}</span>
                </div>
                ${stockBadge}
                <div class="product-name">${p.name}</div>
                <div class="product-meta">${p.category}</div>
            </div>`;


        productGrid.appendChild(card);

        if (inCart) {
            updateTimerDisplay(p.id, inCart.expiresAt);
        }
    });
}

window.addToCart = async (productId) => {
    if (!currentUser) return;

    const btn = document.querySelector(`button[onclick="addToCart(${productId})"]`);
    if (btn) { btn.textContent = '...'; btn.disabled = true; }

    try {
        const res = await fetch(`${API_URL}/inventory/lock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser, productId, quantity: 1 })
        });

        if (res.ok) {
            const lock = await res.json();
            cart[productId] = {
                ...lock,
                intervalId: setInterval(() => updateTimer(productId), 1000)
            };
            showToast('Added to cart! Reserved for 7 minutes 🛒', 'success');
            fetchProducts();
        } else {
            const err = await res.json();
            showToast(err.message || 'Failed to add product', 'error');
            fetchProducts();
        }
    } catch (err) {
        console.error(err);
        showToast('Error adding to cart', 'error');
    }
};

function updateTimer(productId) {
    const lock = cart[productId];
    if (!lock) return;

    const diff = new Date(lock.expiresAt) - new Date();
    if (diff <= 0) {
        clearInterval(lock.intervalId);
        delete cart[productId];
        showToast(`⏰ Reservation expired! Item returned to stock.`, 'error');
        fetchProducts();
    } else {
        updateTimerDisplay(productId, lock.expiresAt);
    }
}

function updateTimerDisplay(productId, expiresAt) {
    const el = document.getElementById(`timer-${productId}`);
    if (el) {
        const diff = Math.max(0, new Date(expiresAt) - new Date());
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        el.style.color = diff < 60000 ? '#dc2626' : '#f97316';
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; padding: 0.75rem 1.5rem; border-radius: 999px;
        font-size: 0.875rem; font-weight: 600; z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
