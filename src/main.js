import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  DEFAULT_USERS
} from './data/initialData.js';

// ============================================================
// STORAGE & REACTIVE STATE ENGINE
// ============================================================
const STORAGE_KEYS = {
  PRODUCTS: 'caprio_products_v3',
  COUPONS: 'caprio_coupons_v3',
  ORDERS: 'caprio_orders_v3',
  USERS: 'caprio_users_v3',
  CURRENT_USER: 'caprio_current_user_v3',
  CART: 'caprio_cart_v3',
  WISHLIST: 'caprio_wishlist_v3'
};

function loadStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key}`, e);
  }
}

function loadProducts() {
  const stored = loadStorage(STORAGE_KEYS.PRODUCTS, null);
  if (!stored || !Array.isArray(stored) || !stored.some(p => p.id === 'cap-a04') || !stored.some(p => p.id === 'cap-k01')) {
    saveStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return stored;
}

export const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop',
    title: 'Pure French Linen Shirts',
    subtitle: 'Breathable, Lightweight & Tailored for Elegance',
    tag: 'Men\'s Linen',
    icon: 'layers'
  },
  {
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1200&auto=format&fit=crop',
    title: 'Italian Full-Grain Leather Belts',
    subtitle: 'Reversible Dual-Tone with Solid Brass Buckle',
    tag: 'Signature Leather',
    icon: 'shield-check'
  },
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    title: 'Royal Gold Chronograph Watch',
    subtitle: 'Precision Multi-Function Timepiece',
    tag: 'Luxury Watches',
    icon: 'watch'
  },
  {
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop',
    title: 'Oud & Amber Royal Eau De Parfum',
    subtitle: 'Bespoke Long-Lasting Sillage (100ml)',
    tag: 'Haute Fragrance',
    icon: 'sparkles'
  },
  {
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200&auto=format&fit=crop',
    title: 'Junior Linen & Cotton Sets',
    subtitle: 'Ultra-Comfort Daily & Festive Wear for Kids',
    tag: 'Kids Collection',
    icon: 'smile'
  }
];

let heroSliderTimer = null;
export function startHeroSlider() {
  if (heroSliderTimer) clearInterval(heroSliderTimer);
  heroSliderTimer = setInterval(() => {
    if (state.currentView === 'store') {
      nextHeroSlide(false);
    }
  }, 4000);
}

export function nextHeroSlide(manual = true) {
  state.heroSlideIndex = (state.heroSlideIndex + 1) % HERO_SLIDES.length;
  updateHeroSlideUI();
  if (manual) startHeroSlider();
}

export function prevHeroSlide() {
  state.heroSlideIndex = (state.heroSlideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
  updateHeroSlideUI();
  startHeroSlider();
}

export function setHeroSlide(idx) {
  state.heroSlideIndex = idx;
  updateHeroSlideUI();
  startHeroSlider();
}

function updateHeroSlideUI() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const badgeTitle = document.getElementById('hero-badge-title');
  const badgeSub = document.getElementById('hero-badge-sub');
  
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === state.heroSlideIndex);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === state.heroSlideIndex);
  });
  
  const current = HERO_SLIDES[state.heroSlideIndex];
  if (badgeTitle && current) badgeTitle.textContent = current.title;
  if (badgeSub && current) badgeSub.textContent = current.subtitle;
}

export function executeSearch(query) {
  state.searchQuery = (query || '').trim();
  state.selectedCategory = 'all';
  state.currentView = 'collections';
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    const colInp = document.getElementById('collection-search-input');
    if (colInp) colInp.focus();
  }, 80);
}

export function openProductDetailPage(productId) {
  state.selectedProductId = productId;
  state.currentView = 'product-detail';
  state.quickViewProduct = null;
  state.isMobileNavOpen = false;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function openQuickViewModal(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (prod) {
    state.quickViewProduct = prod;
    renderApp();
  }
}

export function closeQuickViewModal() {
  state.quickViewProduct = null;
  renderApp();
}

export function openProductDetailOrModal(productId) {
  // Mobile devices (<= 768px): direct dedicated separate page (Audio 2)
  // Desktop/Laptops (> 768px): centered sheet modal (Latest Audio Request)
  if (window.innerWidth <= 768 || state.currentView === 'product-detail') {
    openProductDetailPage(productId);
  } else {
    openQuickViewModal(productId);
  }
}

export function openCartView() {
  // Mobile screens (<= 768px): full screen dedicated page (Audio Request)
  // Desktop screens (> 768px): normal drawer panel
  if (window.innerWidth <= 768) {
    state.currentView = 'cart';
    state.isCartOpen = false;
    state.isMobileNavOpen = false;
    state.isWishlistOpen = false;
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    state.isCartOpen = true;
    renderApp();
  }
}

export function openWishlistView() {
  // Mobile screens (<= 768px): full screen dedicated page (Audio Request)
  // Desktop screens (> 768px): normal drawer panel
  if (window.innerWidth <= 768) {
    state.currentView = 'wishlist';
    state.isWishlistOpen = false;
    state.isMobileNavOpen = false;
    state.isCartOpen = false;
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    state.isWishlistOpen = true;
    renderApp();
  }
}

export const state = {
  products: loadProducts(),
  categories: INITIAL_CATEGORIES,
  coupons: loadStorage(STORAGE_KEYS.COUPONS, INITIAL_COUPONS),
  orders: loadStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS),
  users: loadStorage(STORAGE_KEYS.USERS, DEFAULT_USERS),
  currentUser: loadStorage(STORAGE_KEYS.CURRENT_USER, null),

  // Navigation: 'store' (Home) | 'collections' | 'product-detail' | 'about' | 'orders' | 'profile' | 'checkout' | 'admin'
  currentView: 'store',
  selectedProductId: null,
  adminTab: 'overview', // 'overview' | 'inventory' | 'orders' | 'coupons' | 'customers'

  // Hero Slider State (Audio 2)
  heroSlideIndex: 0,

  // Catalog Filters
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  priceFilter: 3500,
  inStockOnly: false,

  // User Commerce State
  cart: loadStorage(STORAGE_KEYS.CART, []),
  wishlist: loadStorage(STORAGE_KEYS.WISHLIST, ['cap-b01', 'cap-t01']),
  appliedCoupon: null,
  quickViewProduct: null,

  // Modals & Drawers
  isCartOpen: false,
  isWishlistOpen: false,
  isMobileNavOpen: false,
  isAuthModalOpen: false,
  authMode: 'signin', // 'signin' | 'signup'
  authRedirectAction: null,
  isPrivacyModalOpen: false,
  isRazorpayModalOpen: false,
  pendingRazorpayOrder: null,

  // Admin Forms
  editingProduct: null,
  isAddProductModalOpen: false,
  isAddCouponModalOpen: false,

  toasts: []
};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
export function showToast(message, type = 'info') {
  const toast = { id: Date.now(), message, type };
  state.toasts.push(toast);
  renderToasts();
  setTimeout(() => {
    state.toasts = state.toasts.filter(t => t.id !== toast.id);
    renderToasts();
  }, 3500);
}

function renderToasts() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  container.innerHTML = state.toasts.map(t => `
    <div class="toast">
      <i data-lucide="${t.type === 'success' ? 'check-circle' : t.type === 'error' ? 'alert-circle' : 'info'}" style="width:18px;height:18px;color:var(--gold-400);"></i>
      <span>${t.message}</span>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

// ============================================================
// COMMERCE LOGIC (Cart, Wishlist, Coupons in ₹)
// ============================================================
export function addToCart(productId, quantity = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast(`${product.name} is currently out of stock.`, 'error');
    return;
  }

  const existing = state.cart.find(item => item.id === productId);
  const currentQty = existing ? existing.quantity : 0;

  if (currentQty + quantity > product.stock) {
    showToast(`Maximum available stock reached (${product.stock} units)`, 'error');
    return;
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }

  saveStorage(STORAGE_KEYS.CART, state.cart);
  showToast(`Added "${product.name}" to your shopping bag!`, 'success');
  state.isCartOpen = true;
  renderApp();
}

export function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  const product = state.products.find(p => p.id === productId);
  const newQty = item.quantity + delta;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (product && newQty > product.stock) {
    showToast(`Only ${product.stock} units currently in stock.`, 'error');
    return;
  }

  item.quantity = newQty;
  saveStorage(STORAGE_KEYS.CART, state.cart);
  renderApp();
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveStorage(STORAGE_KEYS.CART, state.cart);
  showToast('Item removed from shopping bag.', 'info');
  renderApp();
}

export function toggleWishlist(productId) {
  if (state.wishlist.includes(productId)) {
    state.wishlist = state.wishlist.filter(id => id !== productId);
    showToast('Removed from wishlist.', 'info');
  } else {
    state.wishlist.push(productId);
    showToast('Saved to your wishlist!', 'success');
  }
  saveStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
  renderApp();
}

export function moveToBagFromWishlist(productId) {
  addToCart(productId, 1);
  state.wishlist = state.wishlist.filter(id => id !== productId);
  saveStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
  showToast('Moved item from wishlist to your bag!', 'success');
  renderApp();
}

export function getCartCalculations() {
  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let discount = 0;

  if (state.appliedCoupon) {
    const coupon = state.coupons.find(c => c.code === state.appliedCoupon.code && c.active);
    if (coupon) {
      if (subtotal >= coupon.minSpend) {
        if (coupon.type === 'percentage') {
          discount = (subtotal * coupon.value) / 100;
        } else {
          discount = Math.min(coupon.value, subtotal);
        }
      }
    }
  }

  // Free shipping above ₹999 across India
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = Math.max(0, subtotal - discount + shipping);

  return { subtotal, discount, shipping, total };
}

export function applyCoupon(code) {
  const cleaned = code.trim().toUpperCase();
  const coupon = state.coupons.find(c => c.code === cleaned);

  if (!coupon) {
    showToast('Invalid coupon code.', 'error');
    return false;
  }

  if (!coupon.active) {
    showToast('This privilege code is expired or inactive.', 'error');
    return false;
  }

  const { subtotal } = getCartCalculations();
  if (subtotal < coupon.minSpend) {
    showToast(`Minimum order amount of ₹${coupon.minSpend} required for code ${coupon.code}.`, 'error');
    return false;
  }

  state.appliedCoupon = coupon;
  coupon.uses = (coupon.uses || 0) + 1;
  saveStorage(STORAGE_KEYS.COUPONS, state.coupons);
  showToast(`Privilege code ${coupon.code} applied successfully!`, 'success');
  renderApp();
  return true;
}

export function removeCoupon() {
  state.appliedCoupon = null;
  showToast('Coupon removed.', 'info');
  renderApp();
}

// ============================================================
// AUTHENTICATION (Audio 1 & Audio 5: Email/Mobile + Password & Google)
// ============================================================
export function handleLogin(identifier, password) {
  const cleanId = identifier.trim().toLowerCase();
  
  // Find matching user by email, phone, or name
  const foundUser = state.users.find(u => 
    (u.email && u.email.toLowerCase() === cleanId) ||
    (u.phone && u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')) ||
    (u.name && u.name.toLowerCase() === cleanId)
  );

  if (!foundUser || foundUser.password !== password) {
    showToast('Invalid credentials. Please verify your details.', 'error');
    return false;
  }

  state.currentUser = foundUser;
  saveStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
  state.isAuthModalOpen = false;

  showToast(`Welcome back, ${foundUser.name}!`, 'success');

  // If Admin logged in, grant direct access to Admin view if desired
  if (foundUser.role === 'admin') {
    state.currentView = 'admin';
  } else if (state.authRedirectAction === 'checkout') {
    state.authRedirectAction = null;
    state.currentView = 'checkout';
  }

  renderApp();
  return true;
}

export function handleRegister(name, identifier, phone, password) {
  const cleanId = identifier.trim().toLowerCase();
  const existing = state.users.find(u => u.email?.toLowerCase() === cleanId);

  if (existing) {
    showToast('An account with this email/username already exists.', 'error');
    return false;
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanId.includes('@') ? cleanId : `${cleanId}@caprio.in`,
    phone: phone.trim() || '+91 98470 12345',
    password: password,
    role: 'customer',
    address: 'Panampilly Nagar, Kochi, Kerala',
    joined: new Date().toISOString().split('T')[0]
  };

  state.users.push(newUser);
  saveStorage(STORAGE_KEYS.USERS, state.users);

  state.currentUser = newUser;
  saveStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
  state.isAuthModalOpen = false;

  showToast(`Account created! Welcome to Caprio, ${newUser.name}.`, 'success');

  if (state.authRedirectAction === 'checkout') {
    state.authRedirectAction = null;
    state.currentView = 'checkout';
  }

  renderApp();
  return true;
}

export function handleGoogleSignIn() {
  const googleUser = {
    id: 'usr-google-99',
    name: 'Sameer Varma',
    email: 'sameer.varma@gmail.com',
    phone: '+91 98471 22334',
    address: 'Flat 4B, Marine Drive, Kochi, Kerala 682011',
    role: 'customer',
    joined: new Date().toISOString().split('T')[0]
  };

  state.currentUser = googleUser;
  saveStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
  state.isAuthModalOpen = false;

  showToast(`Signed in with Google as ${googleUser.name}!`, 'success');

  if (state.authRedirectAction === 'checkout') {
    state.authRedirectAction = null;
    state.currentView = 'checkout';
  }

  renderApp();
}

export function handleLogout() {
  state.currentUser = null;
  saveStorage(STORAGE_KEYS.CURRENT_USER, null);
  state.currentView = 'store';
  showToast('You have been signed out safely.', 'info');
  renderApp();
}

export function updateUserProfile(updatedData) {
  if (!state.currentUser) return;

  state.currentUser = {
    ...state.currentUser,
    ...updatedData
  };

  // Sync back to users list
  const idx = state.users.findIndex(u => u.id === state.currentUser.id);
  if (idx !== -1) {
    state.users[idx] = state.currentUser;
    saveStorage(STORAGE_KEYS.USERS, state.users);
  }

  saveStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
  showToast('Profile information updated successfully!', 'success');
  renderApp();
}

// ============================================================
// CHECKOUT & ORDERS
// ============================================================
export function initiateCheckout() {
  if (state.cart.length === 0) {
    showToast('Your shopping bag is empty.', 'error');
    return;
  }

  // Mandatory Login for Placing an Order (Audio 4)
  if (!state.currentUser) {
    state.authRedirectAction = 'checkout';
    state.authMode = 'signin';
    state.isAuthModalOpen = true;
    showToast('Please sign in or create an account to proceed to checkout.', 'info');
    renderApp();
    return;
  }

  state.isCartOpen = false;
  state.currentView = 'checkout';
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function submitOrder(orderDetails) {
  if (!state.currentUser) {
    showToast('Authentication required.', 'error');
    return;
  }

  const calc = getCartCalculations();
  const newOrderId = `CP-${Math.floor(10000 + Math.random() * 90000)}`;

  const orderPayload = {
    id: newOrderId,
    customerName: orderDetails.fullName || state.currentUser.name,
    customerEmail: state.currentUser.email,
    customerPhone: orderDetails.phone || state.currentUser.phone || '+91 98470 12345',
    address: `${orderDetails.street}, ${orderDetails.city}, ${orderDetails.state} ${orderDetails.zip}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Processing',
    paymentMethod: orderDetails.paymentMethod,
    items: [...state.cart],
    subtotal: calc.subtotal,
    discount: calc.discount,
    couponCode: state.appliedCoupon ? state.appliedCoupon.code : null,
    shipping: calc.shipping,
    total: calc.total
  };

  if (orderDetails.paymentMethod.includes('Razorpay')) {
    state.pendingRazorpayOrder = orderPayload;
    state.isRazorpayModalOpen = true;
    renderApp();
    return;
  }

  finalizeOrder(orderPayload);
}

export function finalizeOrder(order) {
  // Decrement Stock
  state.cart.forEach(cartItem => {
    const prod = state.products.find(p => p.id === cartItem.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cartItem.quantity);
    }
  });

  state.orders.unshift(order);
  saveStorage(STORAGE_KEYS.ORDERS, state.orders);
  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);

  // Clear Cart
  state.cart = [];
  state.appliedCoupon = null;
  state.isRazorpayModalOpen = false;
  state.pendingRazorpayOrder = null;
  saveStorage(STORAGE_KEYS.CART, state.cart);

  if (window.confetti) {
    window.confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#0f1d36', '#f6e27a', '#c59b27']
    });
  }

  showToast(`Order #${order.id} placed successfully!`, 'success');
  renderOrderSuccess(order);
}

// ============================================================
// ADMIN PRODUCT & COUPON MANAGEMENT (Audio 3)
// ============================================================
export function adminAddProduct(productData) {
  const newId = `cap-${Date.now()}`;
  const product = {
    id: newId,
    name: productData.name,
    category: productData.category,
    price: parseFloat(productData.price),
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : parseFloat(productData.price) * 1.3,
    stock: parseInt(productData.stock, 10),
    rating: 5.0,
    reviewsCount: 1,
    badge: productData.badge || 'New Arrival',
    featured: true,
    image: productData.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
    description: productData.description || 'Premium comfort daily wear engineered by Caprio.',
    specs: {
      fabric: '100% Combed Cotton',
      care: 'Machine Wash Gentle'
    }
  };

  state.products.unshift(product);
  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
  state.isAddProductModalOpen = false;
  showToast(`Product "${product.name}" added to inventory!`, 'success');
  renderApp();
}

export function adminUpdateProduct(id, updatedFields) {
  const index = state.products.findIndex(p => p.id === id);
  if (index === -1) return;

  state.products[index] = {
    ...state.products[index],
    ...updatedFields,
    price: parseFloat(updatedFields.price),
    originalPrice: parseFloat(updatedFields.originalPrice || updatedFields.price),
    stock: parseInt(updatedFields.stock, 10)
  };

  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
  state.editingProduct = null;
  showToast('Product updated successfully!', 'success');
  renderApp();
}

export function adminDeleteProduct(id) {
  const prod = state.products.find(p => p.id === id);
  if (!confirm(`Are you sure you want to remove "${prod?.name || 'this item'}"?`)) return;

  state.products = state.products.filter(p => p.id !== id);
  saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
  showToast('Product deleted from inventory.', 'info');
  renderApp();
}

export function adminAddCoupon(couponData) {
  const newCoupon = {
    id: `c-${Date.now()}`,
    code: couponData.code.trim().toUpperCase(),
    type: couponData.type,
    value: parseFloat(couponData.value),
    minSpend: parseFloat(couponData.minSpend || 0),
    expiresAt: couponData.expiresAt || '2027-12-31',
    description: couponData.description || `Privilege offer: ${couponData.code}`,
    active: true,
    uses: 0
  };

  state.coupons.unshift(newCoupon);
  saveStorage(STORAGE_KEYS.COUPONS, state.coupons);
  state.isAddCouponModalOpen = false;
  showToast(`Privilege code ${newCoupon.code} generated!`, 'success');
  renderApp();
}

export function adminToggleCoupon(id) {
  const coupon = state.coupons.find(c => c.id === id);
  if (coupon) {
    coupon.active = !coupon.active;
    saveStorage(STORAGE_KEYS.COUPONS, state.coupons);
    showToast(`Coupon ${coupon.code} is now ${coupon.active ? 'ACTIVE' : 'INACTIVE'}.`, 'info');
    renderApp();
  }
}

export function adminDeleteCoupon(id) {
  state.coupons = state.coupons.filter(c => c.id !== id);
  saveStorage(STORAGE_KEYS.COUPONS, state.coupons);
  showToast('Coupon removed.', 'info');
  renderApp();
}

export function adminUpdateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveStorage(STORAGE_KEYS.ORDERS, state.orders);
    showToast(`Order #${orderId} updated to ${newStatus}!`, 'success');
    renderApp();
  }
}

// ============================================================
// TEMPLATE RENDERING FUNCTIONS
// ============================================================

// 1. Navigation Header (Audio 2 & Audio 3)
function renderHeader() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;
  const isUserAdmin = state.currentUser?.role === 'admin';

  return `
    <header class="main-header">
      <div class="container header-inner">
        <div class="header-brand-wrap">
          <button class="mobile-menu-toggle-btn" id="btn-mobile-menu-toggle" aria-label="Open Navigation Menu" title="Open Navigation Menu">
            <i data-lucide="menu" style="width:22px;height:22px;"></i>
          </button>
          <a href="#" class="brand-link" id="nav-brand-logo">
            <img src="/logo.png" alt="Caprio Online Store" class="brand-logo-img" />
          </a>
        </div>

        <!-- Clear Page Navigation Links (Audio 2) -->
        <nav class="header-nav">
          <span class="nav-link ${state.currentView === 'store' ? 'active' : ''}" data-nav-view="store">Home</span>
          <span class="nav-link ${state.currentView === 'collections' ? 'active' : ''}" data-nav-view="collections">Collections</span>
          <span class="nav-link ${state.currentView === 'about' ? 'active' : ''}" data-nav-view="about">About Us</span>
          <span class="nav-link ${state.currentView === 'orders' ? 'active' : ''}" data-nav-view="orders">My Orders</span>
          ${state.currentUser ? `
            <span class="nav-link ${state.currentView === 'profile' ? 'active' : ''}" data-nav-view="profile">My Profile</span>
          ` : ''}
        </nav>

        <div class="header-actions">
        <!-- Header Search Bar (Audio 1) -->
        <div class="header-search-bar" id="header-search-bar">
          <i data-lucide="search" class="header-search-icon"></i>
          <input 
            type="text" 
            class="header-search-input" 
            id="nav-search-input" 
            placeholder="Search shirts, belts, watches, perfumes..." 
            value="${state.searchQuery || ''}" 
            autocomplete="off"
          />
          ${state.searchQuery ? `
            <button class="header-search-clear" id="btn-header-search-clear" title="Clear">
              <i data-lucide="x" style="width:14px;height:14px;"></i>
            </button>
          ` : ''}
          <button class="header-search-submit" id="btn-header-search-submit">
            Search
          </button>
        </div>

          <button class="icon-btn" id="btn-open-wishlist" title="Wishlist">
            <i data-lucide="heart" style="width:18px;height:18px;"></i>
            ${wishlistCount > 0 ? `<span class="badge-count">${wishlistCount}</span>` : ''}
          </button>

          <button class="icon-btn" id="btn-open-cart" title="Shopping Bag">
            <i data-lucide="shopping-bag" style="width:18px;height:18px;"></i>
            ${cartCount > 0 ? `<span class="badge-count gold">${cartCount}</span>` : ''}
          </button>

          ${state.currentUser ? `
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <button class="user-profile-btn" id="btn-profile-menu">
                <i data-lucide="${isUserAdmin ? 'shield' : 'user'}" style="width:15px;height:15px;color:var(--gold-600);"></i>
                <span>${state.currentUser.name.split(' ')[0]}</span>
              </button>
              <button class="icon-btn" id="btn-logout" title="Sign Out" style="width:34px;height:34px;">
                <i data-lucide="log-out" style="width:15px;height:15px;color:var(--text-muted);"></i>
              </button>
            </div>
          ` : `
            <button class="btn-primary" id="btn-open-auth-modal" style="padding:0.45rem 1.15rem;font-size:0.82rem;">
              <i data-lucide="user" style="width:15px;height:15px;"></i> Sign In
            </button>
          `}
        </div>
      </div>
    </header>
  `;
}

// 2. Home Page View (Audio 2 & 4: Daily Wear, No Razorpay/Tech badges on Home, No return policy)
function renderHomeView() {
  const featuredProducts = state.products.slice(0, 6);

  return `
    <!-- Hero Showcase: Multi-Fabric Apparel & Signature Accessories (Men & Kids) -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-badge">
            <i data-lucide="award" style="width:15px;height:15px;"></i>
            <span>Luxury Apparel & Signature Accessories • Men & Kids</span>
          </div>

          <h1 class="hero-title">
            Luxury Apparel. <br/>
            <span class="gold-gradient-text">Signature Accessories.</span>
          </h1>

          <p class="hero-subtitle">
            Explore Caprio's distinguished multi-fabric collections — from pure French linen and silk-blend shirts to tailored chinos, daily tees, kids fashion, full-grain leather belts, luxury perfumes, and chronographs.
          </p>

          <div class="hero-actions">
            <button class="btn-gold" data-nav-view="collections">
              <i data-lucide="shopping-bag" style="width:16px;height:16px;"></i> Explore Collections
            </button>
            <button class="btn-outline" data-quick-cat="accessories">
              <i data-lucide="watch" style="width:16px;height:16px;"></i> Belts, Watches & Perfumes
            </button>
          </div>

          <div class="hero-trust-row">
            <div class="trust-item">
              <span class="trust-number">Multi-Fabric</span>
              <span class="trust-label">Linen, Silk, Cotton & Leather</span>
            </div>
            <div class="trust-item">
              <span class="trust-number">3-Day</span>
              <span class="trust-label">Easy Returns in Original Cover</span>
            </div>
            <div class="trust-item">
              <span class="trust-number">All-India</span>
              <span class="trust-label">100% Prepaid Delivery</span>
            </div>
          </div>
        </div>

        <div class="hero-media-wrap">
          <div class="hero-main-card">
            <div class="hero-slider-wrap" id="hero-slider-container">
              ${HERO_SLIDES.map((slide, idx) => `
                <div class="hero-slide ${idx === state.heroSlideIndex ? 'active' : ''}" data-slide="${idx}">
                  <img src="${slide.image}" alt="${slide.title}" class="hero-slide-img" />
                </div>
              `).join('')}

              <div class="hero-slider-nav">
                <button class="slider-arrow-btn" id="btn-hero-prev" title="Previous Slide">
                  <i data-lucide="chevron-left" style="width:20px;height:20px;"></i>
                </button>
                <button class="slider-arrow-btn" id="btn-hero-next" title="Next Slide">
                  <i data-lucide="chevron-right" style="width:20px;height:20px;"></i>
                </button>
              </div>

              <div class="hero-slider-dots">
                ${HERO_SLIDES.map((_, idx) => `
                  <div class="slider-dot ${idx === state.heroSlideIndex ? 'active' : ''}" data-dot-idx="${idx}"></div>
                `).join('')}
              </div>
            </div>

            <div class="hero-floating-badge">
              <div class="hero-floating-icon">
                <i data-lucide="${HERO_SLIDES[state.heroSlideIndex]?.icon || 'crown'}" style="width:20px;height:20px;"></i>
              </div>
              <div>
                <div style="font-weight:700;font-size:0.88rem;color:var(--navy-deep);" id="hero-badge-title">
                  ${HERO_SLIDES[state.heroSlideIndex]?.title || 'Pure Linen & Luxury Apparel'}
                </div>
                <div style="font-size:0.75rem;color:var(--text-secondary);" id="hero-badge-sub">
                  ${HERO_SLIDES[state.heroSlideIndex]?.subtitle || 'Curated Men, Kids & Accessories'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clean Pillars: Multi-Fabric + 3-Day Return Policy in Original Cover + All-India Prepaid Delivery -->
    <section class="pillars-section">
      <div class="container pillars-grid">
        <div class="pillar-item">
          <div class="pillar-icon-box"><i data-lucide="sparkles" style="width:20px;height:20px;"></i></div>
          <div>
            <div class="pillar-title">Premium Multi-Fabric Apparel</div>
            <div class="pillar-desc">Woven from pure linen, silk blends, stretch twill, and combed cotton for supreme comfort.</div>
          </div>
        </div>
        <div class="pillar-item">
          <div class="pillar-icon-box"><i data-lucide="rotate-ccw" style="width:20px;height:20px;"></i></div>
          <div>
            <div class="pillar-title">3-Day Return Policy</div>
            <div class="pillar-desc">Hassle-free 3-day returns. Item must be returned in the original delivery cover and courier packaging.</div>
          </div>
        </div>
        <div class="pillar-item">
          <div class="pillar-icon-box"><i data-lucide="truck" style="width:20px;height:20px;"></i></div>
          <div>
            <div class="pillar-title">All-India Prepaid Delivery</div>
            <div class="pillar-desc">Expedited pan-India tracked courier delivery via 100% secure Razorpay gateway.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Category Bento Grid (Audio 2) -->
    <section class="container" style="padding-top:3.5rem;">
      <div class="section-header">
        <span class="section-tag">Curated Collections</span>
        <h2 class="section-title">Designed for Everyday Life</h2>
        <p class="section-desc">Explore tailored essentials designed for comfort, breathability, and versatile style.</p>
      </div>

      <div class="featured-bento-grid">
        <div class="bento-card" data-quick-cat="shirts">
          <div class="bento-img-wrap">
            <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop" alt="Shirts" class="bento-img" />
          </div>
          <div class="bento-overlay">
            <h3 class="bento-title">Linen & Oxford Shirts</h3>
            <span class="bento-action">Shop Shirts →</span>
          </div>
        </div>

        <div class="bento-card" data-quick-cat="accessories">
          <div class="bento-img-wrap">
            <img src="https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop" alt="Accessories" class="bento-img" />
          </div>
          <div class="bento-overlay">
            <h3 class="bento-title">Belts, Watches & Perfumes</h3>
            <span class="bento-action">Shop Accessories →</span>
          </div>
        </div>

        <div class="bento-card" data-quick-cat="kids">
          <div class="bento-img-wrap">
            <img src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=900&auto=format&fit=crop" alt="Kids Collection" class="bento-img" />
          </div>
          <div class="bento-overlay">
            <h3 class="bento-title">Kids Collection</h3>
            <span class="bento-action">Shop Kids Wear →</span>
          </div>
        </div>

        <div class="bento-card" data-quick-cat="trousers">
          <div class="bento-img-wrap">
            <img src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop" alt="Trousers" class="bento-img" />
          </div>
          <div class="bento-overlay">
            <h3 class="bento-title">Trousers & Loungewear</h3>
            <span class="bento-action">Shop Bottoms →</span>
          </div>
        </div>

        <div class="bento-card" data-quick-cat="tshirts">
          <div class="bento-img-wrap">
            <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop" alt="T-Shirts" class="bento-img" />
          </div>
          <div class="bento-overlay">
            <h3 class="bento-title">T-Shirts & Daily Vests</h3>
            <span class="bento-action">Shop Tees →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Products Showcase Grid (Audio 2) -->
    <section class="container" style="padding-bottom:5rem;">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
        <div>
          <span class="section-tag" style="margin-bottom:0.25rem;">Daily Favorites</span>
          <h2 class="section-title" style="margin:0;">Trending Daily Wear</h2>
        </div>
        <button class="btn-outline" data-nav-view="collections">
          <span>View All Products (${state.products.length})</span>
          <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
        </button>
      </div>

      <div class="products-grid">
        ${featuredProducts.map(product => renderProductCard(product)).join('')}
      </div>

      <div style="text-align:center;margin-top:1.5rem;">
        <button class="btn-primary" data-nav-view="collections" style="padding:0.9rem 2.2rem;font-size:0.95rem;">
          <i data-lucide="grid" style="width:16px;height:16px;"></i> Explore Full Collections Catalog
        </button>
      </div>
    </section>
  `;
}

// 3. Collections Catalog Page (Audio 2)
function renderCollectionsView() {
  let filtered = state.products.filter(p => {
    const matchesCategory = state.selectedCategory === 'all' || p.category === state.selectedCategory;
    const matchesSearch = !state.searchQuery || 
      p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesPrice = p.price <= state.priceFilter;
    const matchesStock = !state.inStockOnly || p.stock > 0;
    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  });

  if (state.sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (state.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (state.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (state.sortBy === 'newest') filtered.reverse();

  return `
    <div class="container" style="padding-top:2.5rem;padding-bottom:5rem;">
      <div class="section-header">
        <span class="section-tag">Full Catalog</span>
        <h1 class="section-title">The Caprio Collections</h1>
        <p class="section-desc">Explore our full line-up of combed cotton vests, t-shirts, relaxed linen shirts, and accessories.</p>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-tabs-bar">
        ${state.categories.map(cat => {
          const count = cat.id === 'all' ? state.products.length : state.products.filter(p => p.category === cat.id).length;
          const isActive = state.selectedCategory === cat.id;
          return `
            <button class="category-tab-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}">
              <span>${cat.name}</span>
              <span class="tab-count">${count}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Collections Search Query Box (Audio 1) -->
      <div class="collection-search-container">
        <div class="collection-search-wrap">
          <i data-lucide="search" style="width:18px;height:18px;color:var(--gold-600);"></i>
          <input 
            type="text" 
            id="collection-search-input" 
            class="collection-search-input" 
            placeholder="Search by product name, category, fabric, or description..." 
            value="${state.searchQuery || ''}" 
          />
          ${state.searchQuery ? `
            <button id="btn-clear-collection-search" class="btn-clear-search">
              <i data-lucide="x" style="width:14px;height:14px;"></i> Clear Search
            </button>
          ` : ''}
        </div>
        ${state.searchQuery ? `
          <div class="search-active-pill">
            <span>Showing results for "<strong>${state.searchQuery}</strong>" (${filtered.length} found)</span>
          </div>
        ` : ''}
      </div>

      <!-- Toolbar -->
      <div class="products-toolbar">
        <div class="toolbar-left">
          <span class="items-found-count">Showing <strong>${filtered.length}</strong> creations</span>
        </div>

        <div class="toolbar-right">
          <label class="toggle-filter-label">
            <input type="checkbox" id="filter-stock-only" ${state.inStockOnly ? 'checked' : ''} />
            <span>In Stock Only</span>
          </label>

          <label class="toggle-filter-label" style="gap:0.6rem;">
            <span>Max: ₹${state.priceFilter}</span>
            <input 
              type="range" 
              id="filter-price-range" 
              min="300" 
              max="4000" 
              step="100" 
              value="${state.priceFilter}" 
              style="cursor:pointer;"
            />
          </label>

          <select class="filter-select" id="filter-sort-select">
            <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
          </select>
        </div>
      </div>

      <!-- Product Cards Grid or Empty Search State -->
      ${filtered.length === 0 ? `
        <div class="empty-products-state">
          <i data-lucide="search-x" style="width:48px;height:48px;color:var(--gold-600);margin-bottom:1rem;"></i>
          <h3>No matching creations found</h3>
          <p>We couldn't find any products matching "<strong>${state.searchQuery || 'your filters'}</strong>". Try searching for linen, shirts, belts, watches, or perfumes.</p>
          <button class="btn-primary" id="btn-empty-reset-search" style="margin-top:1.25rem;">
            View All Collections
          </button>
        </div>
      ` : `
        <div class="products-grid">
          ${filtered.map(product => renderProductCard(product)).join('')}
        </div>
      `}
    </div>
  `;
}

// 4. Product Card Template
function renderProductCard(product) {
  const isWishlisted = state.wishlist.includes(product.id);
  const discountPercent = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  let stockClass = 'stock-in';
  let stockText = `${product.stock} in stock`;
  if (product.stock <= 0) {
    stockClass = 'stock-out';
    stockText = 'Sold Out';
  } else if (product.stock <= 5) {
    stockClass = 'stock-low';
    stockText = `Only ${product.stock} left`;
  }

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="card-media-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-thumb-img" loading="lazy" />
        
        <div class="card-badge-container">
          ${product.badge ? `<span class="product-badge badge-gold">${product.badge}</span>` : ''}
          ${discountPercent > 0 ? `<span class="product-badge badge-sale">-${discountPercent}%</span>` : ''}
        </div>

        <div class="card-floating-actions">
          <button class="card-action-icon-btn ${isWishlisted ? 'active' : ''}" data-action="wishlist" data-id="${product.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <i data-lucide="heart" style="width:16px;height:16px;"></i>
          </button>
        </div>

        <button class="quick-view-overlay-btn" data-action="quickview" data-id="${product.id}">
          <i data-lucide="eye" style="width:14px;height:14px;"></i> Quick View
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta-row">
          <span class="card-category-label">${product.category}</span>
          <div class="card-rating">
            <i data-lucide="star" class="star-icon" style="width:12px;height:12px;"></i>
            <span>${product.rating}</span>
            <span style="color:var(--text-muted);font-weight:400;">(${product.reviewsCount})</span>
          </div>
        </div>

        <h3 class="card-title" data-action="quickview" data-id="${product.id}">${product.name}</h3>
        <p class="card-desc-snippet">${product.description}</p>

        <div class="card-stock-row" style="margin-bottom:0.85rem;">
          <span class="stock-indicator-pill ${stockClass}">
            <i data-lucide="${product.stock > 0 ? 'check' : 'x'}" style="width:10px;height:10px;"></i>
            ${stockText}
          </span>
        </div>

        <div class="card-footer-row">
          <div class="price-group">
            <span class="current-price">₹${product.price}</span>
            ${product.originalPrice > product.price ? `
              <span class="original-price">₹${product.originalPrice}</span>
            ` : ''}
          </div>

          <button 
            class="btn-add-cart" 
            data-action="add-cart" 
            data-id="${product.id}" 
            ${product.stock <= 0 ? 'disabled' : ''}
          >
            <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i>
            <span>${product.stock <= 0 ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 5. About Us Page (Audio 2)
function renderAboutView() {
  return `
    <div class="about-hero-section">
      <div class="container">
        <span class="section-tag">Our Heritage</span>
        <h1 class="section-title">The Caprio Story</h1>
        <p class="section-desc" style="max-width:600px;margin:0 auto;">
          Redefining everyday comfort clothing with pure combed cotton, precision tailoring, and honest pricing.
        </p>
      </div>
    </div>

    <div class="container">
      <div class="about-content-grid">
        <div>
          <h2 style="font-size:2rem;color:var(--navy-deep);margin-bottom:1rem;">Crafted for Daily Wear</h2>
          <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;margin-bottom:1.25rem;">
            Founded with a singular vision, Caprio brings workshop-grade craftsmanship directly to the modern Indian lifestyle. We believe daily essentials — your everyday vest, t-shirt, and casual shirt — should feel like second skin.
          </p>
          <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem;">
            Every single yard of fabric is bio-washed, combed to eliminate short-staple impurities, and finished with reinforced flatlock stitching to guarantee zero friction and shape retention.
          </p>
          <div style="display:flex;gap:1rem;">
            <button class="btn-primary" data-nav-view="collections">View Catalog</button>
          </div>
        </div>

        <div class="about-card">
          <h3 style="font-size:1.3rem;color:var(--navy-deep);margin-bottom:1rem;">The Caprio Pillars</h3>
          <div style="display:flex;flex-direction:column;gap:1.25rem;">
            <div style="display:flex;gap:0.85rem;">
              <i data-lucide="sparkles" style="color:var(--gold-600);width:22px;height:22px;flex-shrink:0;"></i>
              <div>
                <strong>Diverse Luxury Fabrics & Accessories</strong>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">From French linen and silk blends to full-grain leather belts, watches, and perfumes.</p>
              </div>
            </div>
            <div style="display:flex;gap:0.85rem;">
              <i data-lucide="rotate-ccw" style="color:var(--gold-600);width:22px;height:22px;flex-shrink:0;"></i>
              <div>
                <strong>3-Day Easy Return Policy</strong>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">Hassle-free 3-day returns. Item must be returned in the original delivery cover & packaging.</p>
              </div>
            </div>
            <div style="display:flex;gap:0.85rem;">
              <i data-lucide="truck" style="color:var(--gold-600);width:22px;height:22px;flex-shrink:0;"></i>
              <div>
                <strong>All-India 100% Prepaid Delivery</strong>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">Swift, pan-India courier dispatch with live tracking and zero delivery hiccups.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 6. User Profile Page (Audio 1: Name, Email, Phone, Address, Password)
function renderProfileView() {
  if (!state.currentUser) {
    return `
      <div class="container" style="padding:5rem 0;text-align:center;">
        <h2>Please Sign In</h2>
        <p style="color:var(--text-secondary);margin:1rem 0;">Sign in to view and edit your profile credentials.</p>
        <button class="btn-primary" id="btn-open-auth-modal">Sign In to Account</button>
      </div>
    `;
  }

  const u = state.currentUser;

  return `
    <div class="container">
      <div style="padding-top:2.5rem;margin-bottom:1.5rem;">
        <button class="btn-outline" id="btn-back-to-store" style="padding:0.4rem 0.9rem;font-size:0.8rem;margin-bottom:0.75rem;">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Return to Store
        </button>
        <h1 style="font-size:2.2rem;color:var(--navy-deep);">My Account & Profile</h1>
        <p style="color:var(--text-secondary);font-size:0.9rem;">Manage your contact credentials and default shipping address.</p>
      </div>

      <div class="profile-grid">
        <!-- Sidebar -->
        <div class="profile-sidebar">
          <div class="profile-avatar-circle">
            <i data-lucide="user" style="width:36px;height:36px;"></i>
          </div>
          <h3 style="font-size:1.2rem;color:var(--navy-deep);">${u.name}</h3>
          <p style="font-size:0.82rem;color:var(--text-secondary);">${u.email}</p>
          <span class="status-badge status-delivered" style="margin-top:0.6rem;">
            ${u.role.toUpperCase()} CLIENT
          </span>

          <div style="border-top:1px solid var(--border-subtle);margin-top:1.5rem;padding-top:1.25rem;display:flex;flex-direction:column;gap:0.75rem;">
            <button class="btn-outline" style="width:100%;justify-content:center;font-size:0.85rem;" data-nav-view="orders">
              <i data-lucide="package" style="width:15px;height:15px;"></i> View Order History
            </button>
            <button class="btn-outline" style="width:100%;justify-content:center;font-size:0.85rem;" id="btn-profile-logout">
              <i data-lucide="log-out" style="width:15px;height:15px;"></i> Sign Out
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="checkout-card">
          <h3 class="checkout-card-title">
            <i data-lucide="edit-3" style="width:18px;height:18px;color:var(--gold-600)"></i>
            Personal Credentials & Shipping Details
          </h3>

          <form id="profile-edit-form">
            <div class="checkout-form-grid" style="margin-bottom:1.5rem;">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="prof-name" value="${u.name}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Contact Number</label>
                <input type="tel" class="form-control" id="prof-phone" value="${u.phone || ''}" required />
              </div>
              <div class="form-group full-span">
                <label class="form-label">Email Address / Username</label>
                <input type="email" class="form-control" id="prof-email" value="${u.email}" required />
              </div>
              <div class="form-group full-span">
                <label class="form-label">Default Shipping Destination Address</label>
                <input type="text" class="form-control" id="prof-address" value="${u.address || ''}" placeholder="House/Flat number, Street name, City, PIN" />
              </div>
            </div>

            <h4 style="font-size:0.95rem;color:var(--navy-deep);margin-bottom:0.75rem;">Account Password</h4>
            <div class="form-group" style="max-width:320px;margin-bottom:1.5rem;">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="prof-password" value="${u.password || ''}" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn-gold" style="padding:0.75rem 1.8rem;">
              <i data-lucide="check" style="width:16px;height:16px;"></i> Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// 7. Shopping Cart Drawer
function renderCartDrawer() {
  const { subtotal, discount, shipping, total } = getCartCalculations();
  const freeThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  const remaining = Math.max(0, freeThreshold - subtotal);

  return `
    <div class="cart-drawer-backdrop ${state.isCartOpen ? 'open' : ''}" id="cart-drawer-backdrop">
      <div class="cart-drawer-panel">
        <div class="cart-drawer-header">
          <div class="cart-title-row">
            <i data-lucide="shopping-bag" style="width:20px;height:20px;color:var(--gold-600)"></i>
            <h3 class="cart-title">Shopping Bag</h3>
            <span class="tab-count">${state.cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-cart" style="position:static;">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <div class="cart-items-scroll">
          ${state.cart.length === 0 ? `
            <div class="cart-empty-state">
              <div class="empty-icon-circle"><i data-lucide="shopping-bag" style="width:32px;height:32px;"></i></div>
              <h4 style="font-size:1.15rem;font-weight:700;">Your bag is empty</h4>
              <p style="color:var(--text-secondary);font-size:0.85rem;">Discover our pure cotton vests and daily essentials.</p>
              <button class="btn-primary" id="btn-cart-continue" style="margin-top:1rem;">
                Explore Creations
              </button>
            </div>
          ` : `
            ${state.cart.map(item => `
              <div class="cart-item-card">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.name}</div>
                  <div class="cart-item-price">₹${item.price} each</div>
                  <div class="quantity-stepper">
                    <button class="step-btn" data-action="qty-minus" data-id="${item.id}">-</button>
                    <span class="step-value">${item.quantity}</span>
                    <button class="step-btn" data-action="qty-plus" data-id="${item.id}">+</button>
                  </div>
                </div>
                <button class="cart-item-remove-btn" data-action="remove-item" data-id="${item.id}" title="Remove item">
                  <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                </button>
              </div>
            `).join('')}
          `}
        </div>

        ${state.cart.length > 0 ? `
          <div class="cart-drawer-footer">
            <div class="free-shipping-progress">
              <div class="free-shipping-text">
                ${remaining > 0 ? `
                  <span>Add <strong>₹${remaining.toFixed(0)}</strong> for free express delivery</span>
                ` : `
                  <span style="color:var(--success);font-weight:700;">✓ Free Express Delivery Unlocked!</span>
                `}
                <span>${Math.round(progressPercent)}%</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width:${progressPercent}%;"></div>
              </div>
            </div>

            ${state.appliedCoupon ? `
              <div class="applied-coupon-pill">
                <span>Code <strong>${state.appliedCoupon.code}</strong> applied (-₹${discount.toFixed(0)})</span>
                <button class="cart-item-remove-btn" id="btn-remove-coupon" style="padding:0;">
                  <i data-lucide="x" style="width:14px;height:14px;"></i>
                </button>
              </div>
            ` : `
              <div class="cart-coupon-box">
                <input 
                  type="text" 
                  placeholder="Coupon Code (e.g. CAPRIO10)" 
                  class="coupon-input" 
                  id="cart-coupon-input" 
                />
                <button class="btn-apply-coupon" id="btn-apply-cart-coupon">Apply</button>
              </div>
            `}

            <div class="cart-calc-row">
              <span>Subtotal</span>
              <span>₹${subtotal.toFixed(0)}</span>
            </div>
            ${discount > 0 ? `
              <div class="cart-calc-row" style="color:var(--gold-700);font-weight:600;">
                <span>Discount</span>
                <span>-₹${discount.toFixed(0)}</span>
              </div>
            ` : ''}
            <div class="cart-calc-row">
              <span>Express Delivery</span>
              <span>${shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div class="cart-calc-row total-row">
              <span>Total Amount</span>
              <span class="gold-gradient-text">₹${total.toFixed(0)}</span>
            </div>

            <button class="btn-checkout-proceed" id="btn-proceed-checkout">
              <span>Proceed to Checkout</span>
              <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 8. Wishlist Drawer (Audio 4: Setup Wishlist)
function renderWishlistDrawer() {
  const wishlistedItems = state.products.filter(p => state.wishlist.includes(p.id));

  return `
    <div class="cart-drawer-backdrop ${state.isWishlistOpen ? 'open' : ''}" id="wishlist-drawer-backdrop">
      <div class="cart-drawer-panel">
        <div class="cart-drawer-header">
          <div class="cart-title-row">
            <i data-lucide="heart" style="width:20px;height:20px;color:var(--danger)"></i>
            <h3 class="cart-title">Saved Wishlist</h3>
            <span class="tab-count">${wishlistedItems.length}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-wishlist" style="position:static;">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <div class="cart-items-scroll">
          ${wishlistedItems.length === 0 ? `
            <div class="cart-empty-state">
              <div class="empty-icon-circle"><i data-lucide="heart" style="width:32px;height:32px;"></i></div>
              <h4 style="font-size:1.1rem;font-weight:700;">Your wishlist is empty</h4>
              <p style="color:var(--text-secondary);font-size:0.85rem;">Click the heart icon on any product to save it here.</p>
            </div>
          ` : `
            ${wishlistedItems.map(item => `
              <div class="cart-item-card">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.name}</div>
                  <div class="cart-item-price">₹${item.price}</div>
                  <button class="btn-primary" style="padding:0.35rem 0.75rem;font-size:0.75rem;margin-top:0.4rem;" data-action="wishlist-move-bag" data-id="${item.id}">
                    <i data-lucide="shopping-bag" style="width:13px;height:13px;"></i> Move to Bag
                  </button>
                </div>
                <button class="cart-item-remove-btn" data-action="wishlist" data-id="${item.id}" title="Remove">
                  <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                </button>
              </div>
            `).join('')}
          `}
        </div>
      </div>
    </div>
  `;
}

// 8B. Dedicated Full-Screen Mobile Shopping Bag Page (Audio Request)
function renderCartPageView() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.discountType === 'percent') {
      discount = (subtotal * state.appliedCoupon.discountValue) / 100;
    } else {
      discount = state.appliedCoupon.discountValue;
    }
  }
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Recommendations for matching items
  const recommendations = state.products
    .filter(p => !state.cart.some(ci => ci.id === p.id))
    .slice(0, 4);

  return `
    <div class="mobile-fullscreen-page-view">
      <div class="container mobile-page-container">
        <!-- Top Navigation Bar -->
        <div class="mobile-page-top-bar">
          <button class="btn-page-back" data-nav-view="collections">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Continue Shopping</span>
          </button>
          <div class="mobile-page-header-title">
            <h1 class="page-title-main">Shopping Bag</h1>
            <span class="page-title-badge">${totalItems} ${totalItems === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        ${state.cart.length === 0 ? `
          <div class="mobile-empty-page-card">
            <div class="empty-icon-circle-large">
              <i data-lucide="shopping-bag" style="width:44px;height:44px;color:var(--gold-600);"></i>
            </div>
            <h2 class="empty-page-heading">Your Shopping Bag is Empty</h2>
            <p class="empty-page-subtext">Looks like you haven't added anything to your cart yet. Explore our handcrafted linen shirts, Italian belts, and luxury perfumes.</p>
            <button class="btn-primary" data-nav-view="collections" style="padding:0.85rem 2rem;font-size:0.92rem;margin-top:1.25rem;">
              <i data-lucide="compass" style="width:18px;height:18px;"></i>
              <span>Explore Collections</span>
            </button>
          </div>
        ` : `
          <div class="mobile-cart-page-layout">
            <!-- Items Section -->
            <div class="mobile-cart-items-list">
              <div class="mobile-section-title-row">
                <h3>Bag Items (${totalItems})</h3>
                <span class="delivery-pill">⚡ Free Express Courier</span>
              </div>

              ${state.cart.map(item => `
                <div class="mobile-cart-card">
                  <img src="${item.image}" alt="${item.name}" class="mobile-cart-thumb" />
                  <div class="mobile-cart-details">
                    <div class="mobile-cart-card-header">
                      <div>
                        <span class="mobile-cart-cat">${item.category}</span>
                        <h4 class="mobile-cart-item-name">${item.name}</h4>
                      </div>
                      <button class="mobile-cart-item-del" data-action="remove-item" data-id="${item.id}" title="Remove item">
                        <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                      </button>
                    </div>

                    <div class="mobile-cart-price-stepper-row">
                      <div class="mobile-cart-item-price">₹${item.price}</div>
                      <div class="mobile-cart-stepper">
                        <button class="stepper-btn" data-action="qty-minus" data-id="${item.id}" aria-label="Decrease quantity">
                          <i data-lucide="minus" style="width:14px;height:14px;"></i>
                        </button>
                        <span class="stepper-value">${item.quantity}</span>
                        <button class="stepper-btn" data-action="qty-plus" data-id="${item.id}" aria-label="Increase quantity">
                          <i data-lucide="plus" style="width:14px;height:14px;"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Coupon Code Section -->
            <div class="mobile-coupon-card">
              <div class="coupon-header">
                <i data-lucide="tag" style="width:18px;height:18px;color:var(--gold-600);"></i>
                <span style="font-weight:700;font-size:0.9rem;color:var(--navy-deep);">Apply Promo Coupon</span>
              </div>
              ${state.appliedCoupon ? `
                <div class="coupon-applied-pill">
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <i data-lucide="check-circle" style="width:16px;height:16px;color:#16a34a;"></i>
                    <span><strong>${state.appliedCoupon.code}</strong> applied (-₹${discount.toFixed(0)})</span>
                  </div>
                  <button class="btn-remove-coupon" id="btn-remove-coupon-page" title="Remove coupon">
                    <i data-lucide="x" style="width:14px;height:14px;"></i>
                  </button>
                </div>
              ` : `
                <div class="cart-coupon-box" style="margin-top:0.75rem;">
                  <input 
                    type="text" 
                    placeholder="Coupon Code (e.g. CAPRIO10)" 
                    class="coupon-input" 
                    id="cart-coupon-input-page" 
                  />
                  <button class="btn-apply-coupon" id="btn-apply-cart-coupon-page">Apply</button>
                </div>
              `}
            </div>

            <!-- Order Summary Card -->
            <div class="mobile-order-summary-card">
              <h3 class="summary-card-title">Order Summary</h3>

              <div class="summary-line">
                <span>Subtotal (${totalItems} items)</span>
                <span>₹${subtotal.toFixed(0)}</span>
              </div>

              ${discount > 0 ? `
                <div class="summary-line discount-line">
                  <span>Coupon Discount</span>
                  <span>-₹${discount.toFixed(0)}</span>
                </div>
              ` : ''}

              <div class="summary-line">
                <span>Express Courier Shipping</span>
                <span style="color:#16a34a;font-weight:700;">FREE</span>
              </div>

              <div class="summary-line total-line">
                <span>Total Amount</span>
                <span class="gold-gradient-text" style="font-size:1.35rem;font-weight:800;">₹${total.toFixed(0)}</span>
              </div>

              <div class="mobile-trust-points">
                <span><i data-lucide="shield-check" style="color:var(--gold-600);width:15px;height:15px;"></i> 100% Prepaid via Razorpay</span>
                <span><i data-lucide="rotate-ccw" style="color:var(--gold-600);width:15px;height:15px;"></i> 3-Day Return in Original Cover</span>
              </div>

              <button class="btn-checkout-proceed" id="btn-proceed-checkout-page" style="margin-top:1.25rem;">
                <span>Proceed to Prepaid Checkout</span>
                <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>
              </button>
            </div>
          </div>
        `}

        <!-- Curated Recommendations (Meesho style infinite scroll) -->
        ${recommendations.length > 0 ? `
          <div class="mobile-page-recommendations">
            <div class="section-header" style="text-align:left;margin-bottom:1rem;">
              <span class="section-tag">You Might Also Like</span>
              <h3 style="font-size:1.25rem;color:var(--navy-deep);">Curated For You</h3>
            </div>
            <div class="products-grid">
              ${recommendations.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 8C. Dedicated Full-Screen Mobile Wishlist Page (Audio Request)
function renderWishlistPageView() {
  const wishlistedItems = state.products.filter(p => state.wishlist.includes(p.id));
  const wishlistCount = wishlistedItems.length;

  const recommendations = state.products
    .filter(p => !state.wishlist.includes(p.id))
    .slice(0, 4);

  return `
    <div class="mobile-fullscreen-page-view">
      <div class="container mobile-page-container">
        <!-- Top Navigation Bar -->
        <div class="mobile-page-top-bar">
          <button class="btn-page-back" data-nav-view="collections">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Back to Collections</span>
          </button>
          <div class="mobile-page-header-title">
            <h1 class="page-title-main">Saved Wishlist</h1>
            <span class="page-title-badge">${wishlistCount} ${wishlistCount === 1 ? 'piece' : 'pieces'}</span>
          </div>
        </div>

        ${wishlistCount === 0 ? `
          <div class="mobile-empty-page-card">
            <div class="empty-icon-circle-large">
              <i data-lucide="heart" style="width:44px;height:44px;color:var(--danger);"></i>
            </div>
            <h2 class="empty-page-heading">Your Wishlist is Empty</h2>
            <p class="empty-page-subtext">Save pieces you love by tapping the heart icon on any creation. They will remain saved here for your next bespoke order.</p>
            <button class="btn-primary" data-nav-view="collections" style="padding:0.85rem 2rem;font-size:0.92rem;margin-top:1.25rem;">
              <i data-lucide="compass" style="width:18px;height:18px;"></i>
              <span>Explore Collections</span>
            </button>
          </div>
        ` : `
          <div class="mobile-wishlist-grid">
            ${wishlistedItems.map(item => `
              <div class="mobile-wishlist-card">
                <div class="mobile-wishlist-img-wrap" data-action="quickview" data-id="${item.id}">
                  <img src="${item.image}" alt="${item.name}" class="mobile-wishlist-img" />
                  <button class="mobile-wishlist-remove-btn" data-action="wishlist" data-id="${item.id}" title="Remove from wishlist">
                    <i data-lucide="heart" style="width:16px;height:16px;fill:var(--danger);color:var(--danger);"></i>
                  </button>
                  ${item.badge ? `<span class="product-badge badge-gold" style="top:8px;left:8px;">${item.badge}</span>` : ''}
                </div>

                <div class="mobile-wishlist-body">
                  <span class="card-category-label">${item.category}</span>
                  <h4 class="mobile-wishlist-title" data-action="quickview" data-id="${item.id}">${item.name}</h4>
                  <div class="mobile-wishlist-price-row">
                    <span class="detail-current-price" style="font-size:1.15rem;">₹${item.price}</span>
                    ${item.originalPrice > item.price ? `
                      <span class="detail-original-price" style="font-size:0.85rem;">₹${item.originalPrice}</span>
                    ` : ''}
                  </div>

                  <button class="btn-primary mobile-wishlist-move-btn" data-action="wishlist-move-bag" data-id="${item.id}">
                    <i data-lucide="shopping-bag" style="width:15px;height:15px;"></i>
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Recommendations Grid -->
        ${recommendations.length > 0 ? `
          <div class="mobile-page-recommendations">
            <div class="section-header" style="text-align:left;margin-bottom:1rem;">
              <span class="section-tag">Trending Pieces</span>
              <h3 style="font-size:1.25rem;color:var(--navy-deep);">You May Also Love</h3>
            </div>
            <div class="products-grid">
              ${recommendations.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 8D. Mobile Side Navigation Drawer (User Audio Request: 3-line hamburger menu with full navigation)
function renderMobileNavDrawer() {
  const isUserAdmin = state.currentUser?.role === 'admin';
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  return `
    <div class="cart-drawer-backdrop mobile-nav-backdrop ${state.isMobileNavOpen ? 'open' : ''}" id="mobile-nav-backdrop">
      <div class="mobile-nav-panel">
        <div class="mobile-nav-header">
          <img src="/logo.png" alt="Caprio Store" class="mobile-nav-logo" />
          <button class="modal-close-btn" id="btn-close-mobile-nav" style="position:static;" aria-label="Close Menu">
            <i data-lucide="x" style="width:20px;height:20px;"></i>
          </button>
        </div>

        <div class="mobile-nav-user-bar">
          ${state.currentUser ? `
            <div class="mobile-user-info">
              <div class="mobile-user-avatar">${(state.currentUser.name || 'U')[0].toUpperCase()}</div>
              <div style="flex:1;overflow:hidden;">
                <div class="mobile-user-name">${state.currentUser.name}</div>
                <div class="mobile-user-email">${state.currentUser.email}</div>
              </div>
            </div>
          ` : `
            <div class="mobile-user-guest">
              <div>
                <div class="mobile-user-name">Welcome to Caprio</div>
                <div class="mobile-user-email">Sign in for orders, wishlist & benefits</div>
              </div>
              <button class="btn-primary" id="btn-mobile-nav-login" style="padding:0.45rem 1rem;font-size:0.78rem;">
                Sign In
              </button>
            </div>
          `}
        </div>

        <div class="mobile-nav-links">
          <div class="mobile-nav-group-label">Store Navigation</div>

          <a class="mobile-nav-item ${state.currentView === 'store' ? 'active' : ''}" data-nav-view="store">
            <i data-lucide="home" style="width:18px;height:18px;"></i>
            <span>Home</span>
          </a>

          <a class="mobile-nav-item ${state.currentView === 'collections' ? 'active' : ''}" data-nav-view="collections">
            <i data-lucide="grid" style="width:18px;height:18px;"></i>
            <span>Collections Catalog</span>
            <span class="badge-count" style="margin-left:auto;background:var(--gold-100);color:var(--gold-800);">${state.products.length}</span>
          </a>

          <!-- Quick Category Filters in Drawer -->
          <div class="mobile-nav-subcategories">
            <button class="mobile-subcat-btn" data-quick-cat="shirts">👔 Shirts</button>
            <button class="mobile-subcat-btn" data-quick-cat="trousers">👖 Bottoms</button>
            <button class="mobile-subcat-btn" data-quick-cat="tshirts">👕 Tees & Vests</button>
            <button class="mobile-subcat-btn" data-quick-cat="accessories">⌚ Accessories</button>
            <button class="mobile-subcat-btn" data-quick-cat="kids">🧸 Kids Wear</button>
          </div>

          <a class="mobile-nav-item ${state.currentView === 'about' ? 'active' : ''}" data-nav-view="about">
            <i data-lucide="sparkles" style="width:18px;height:18px;"></i>
            <span>About Us & Craftsmanship</span>
          </a>

          <a class="mobile-nav-item ${state.currentView === 'orders' ? 'active' : ''}" data-nav-view="orders">
            <i data-lucide="package" style="width:18px;height:18px;"></i>
            <span>My Orders & Tracking</span>
          </a>

          ${state.currentUser ? `
            <a class="mobile-nav-item ${state.currentView === 'profile' ? 'active' : ''}" data-nav-view="profile">
              <i data-lucide="user" style="width:18px;height:18px;"></i>
              <span>My Profile</span>
            </a>
          ` : ''}

          ${isUserAdmin ? `
            <a class="mobile-nav-item admin-highlight" data-nav-view="admin">
              <i data-lucide="shield-check" style="width:18px;height:18px;color:var(--gold-600);"></i>
              <span>Admin Portal</span>
            </a>
          ` : ''}

          <div class="mobile-nav-group-label" style="margin-top:1.25rem;">Quick Access</div>

          <a class="mobile-nav-item" id="btn-mobile-nav-wishlist">
            <i data-lucide="heart" style="width:18px;height:18px;color:var(--danger)"></i>
            <span>Saved Wishlist</span>
            ${wishlistCount > 0 ? `<span class="badge-count" style="margin-left:auto;">${wishlistCount}</span>` : ''}
          </a>

          <a class="mobile-nav-item" id="btn-mobile-nav-cart">
            <i data-lucide="shopping-bag" style="width:18px;height:18px;color:var(--gold-600)"></i>
            <span>Shopping Bag</span>
            ${cartCount > 0 ? `<span class="badge-count gold" style="margin-left:auto;">${cartCount}</span>` : ''}
          </a>
        </div>

        <div class="mobile-nav-footer">
          <a href="https://wa.me/919999999999" target="_blank" class="mobile-nav-help-link">
            <i data-lucide="message-circle" style="width:16px;height:16px;color:#25d366;"></i>
            <span>WhatsApp Customer Care</span>
          </a>
          <div class="mobile-nav-copyright">© 2026 Caprio Online Store</div>
        </div>
      </div>
    </div>
  `;
}

// 8E. Mobile Sticky Bottom Navigation Bar (Meesho/Myntra 1-Thumb Shopping UX)
function renderMobileBottomNav() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  return `
    <nav class="mobile-bottom-nav">
      <button class="mobile-bottom-item ${state.currentView === 'store' ? 'active' : ''}" data-nav-view="store">
        <i data-lucide="home" style="width:19px;height:19px;"></i>
        <span>Home</span>
      </button>

      <button class="mobile-bottom-item ${state.currentView === 'collections' ? 'active' : ''}" data-nav-view="collections">
        <i data-lucide="grid" style="width:19px;height:19px;"></i>
        <span>Catalog</span>
      </button>

      <button class="mobile-bottom-item ${state.currentView === 'wishlist' ? 'active' : ''}" id="btn-mobile-bottom-wishlist">
        <div style="position:relative;display:inline-flex;">
          <i data-lucide="heart" style="width:19px;height:19px;"></i>
          ${wishlistCount > 0 ? `<span class="mobile-bottom-badge">${wishlistCount}</span>` : ''}
        </div>
        <span>Wishlist</span>
      </button>

      <button class="mobile-bottom-item ${state.currentView === 'cart' ? 'active' : ''}" id="btn-mobile-bottom-cart">
        <div style="position:relative;display:inline-flex;">
          <i data-lucide="shopping-bag" style="width:19px;height:19px;"></i>
          ${cartCount > 0 ? `<span class="mobile-bottom-badge gold">${cartCount}</span>` : ''}
        </div>
        <span>Bag</span>
      </button>

      <button class="mobile-bottom-item ${state.currentView === 'profile' ? 'active' : ''}" id="btn-mobile-bottom-profile">
        <i data-lucide="user" style="width:19px;height:19px;"></i>
        <span>${state.currentUser ? state.currentUser.name.split(' ')[0] : 'Profile'}</span>
      </button>
    </nav>
  `;
}

// 9. Clean Auth Modal (Audio 1 & Audio 5: Email/Mobile + Password + Google. NO OTP, NO Admin bottom link)
function renderAuthModal() {
  if (!state.isAuthModalOpen) return '';

  const isSignIn = state.authMode === 'signin';

  return `
    <div class="modal-backdrop open" id="auth-modal-backdrop">
      <div class="modal-window auth-modal-window">
        <button class="modal-close-btn" id="btn-close-auth-modal">
          <i data-lucide="x" style="width:18px;height:18px;"></i>
        </button>

        <div class="auth-logo-card">
          <img src="/logo.png" alt="Caprio Online Store" />
        </div>

        <h3 class="auth-header-title">${isSignIn ? 'Welcome to Caprio' : 'Create Your Account'}</h3>
        <p class="auth-header-sub">
          ${state.authRedirectAction === 'checkout' 
            ? 'Sign in to complete your order.' 
            : 'Access orders, save favorites, and receive personalized service.'}
        </p>

        <!-- Tab Switcher -->
        <div class="auth-tabs-nav">
          <button class="auth-tab-btn ${isSignIn ? 'active' : ''}" id="tab-auth-signin">Sign In</button>
          <button class="auth-tab-btn ${!isSignIn ? 'active' : ''}" id="tab-auth-signup">Create Account</button>
        </div>

        <form id="auth-unified-form">
          ${!isSignIn ? `
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" id="auth-name" placeholder="Alexander Wright" required />
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <input type="tel" class="form-control" id="auth-phone" placeholder="9847012345" required />
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">${isSignIn ? 'Email, Username, or Mobile' : 'Email Address'}</label>
            <input type="text" class="form-control" id="auth-identifier" placeholder="${isSignIn ? 'admin@gmail.com or mobile' : 'name@example.com'}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" id="auth-password" placeholder="••••••••" required />
          </div>

          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;padding:0.8rem;margin-top:0.5rem;">
            <span>${isSignIn ? 'Sign In to Account' : 'Complete Registration'}</span>
            <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
          </button>
        </form>

        <div class="auth-divider-row">
          <span>or continue with</span>
        </div>

        <!-- Google OAuth Button (Audio 1 & Audio 5) -->
        <button class="btn-google-auth" id="btn-google-signin">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
            <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.17.28-1.71V4.96H.96A8.996 8.996 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  `;
}

// 10. Checkout View with Razorpay (Audio 4 & Audio 5)
function renderCheckoutView() {
  const { subtotal, discount, shipping, total } = getCartCalculations();

  return `
    <div class="container" style="padding-top:2.5rem;padding-bottom:5rem;">
      <div style="margin-bottom:2rem;">
        <button class="btn-outline" id="btn-back-to-store" style="padding:0.4rem 0.9rem;font-size:0.8rem;margin-bottom:1rem;">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Return to Store
        </button>
        <h1 style="font-size:2.3rem;color:var(--navy-deep);">Checkout</h1>
        <p style="color:var(--text-secondary);font-size:0.95rem;">
          Purchasing as <strong>${state.currentUser.name}</strong> (${state.currentUser.phone || state.currentUser.email})
        </p>
      </div>

      <form id="checkout-form" class="checkout-view-grid">
        <div>
          <div class="checkout-card">
            <h3 class="checkout-card-title">
              <i data-lucide="map-pin" style="width:20px;height:20px;color:var(--gold-600)"></i>
              Delivery Destination
            </h3>
            <div class="checkout-form-grid">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="ship-name" value="${state.currentUser.name}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Contact</label>
                <input type="tel" class="form-control" id="ship-phone" value="${state.currentUser.phone || '+91 98470 12345'}" required />
              </div>
              <div class="form-group full-span">
                <label class="form-label">Street Address & Landmark</label>
                <input type="text" class="form-control" id="ship-street" value="${state.currentUser.address || ''}" placeholder="Flat 4B, Emerald Heights, MG Road" required />
              </div>
              <div class="form-group">
                <label class="form-label">City</label>
                <input type="text" class="form-control" id="ship-city" placeholder="Kochi" required />
              </div>
              <div class="form-group">
                <label class="form-label">Postal PIN Code</label>
                <input type="text" class="form-control" id="ship-zip" placeholder="682001" maxlength="6" required />
              </div>
            </div>
          </div>

          <div class="checkout-card">
            <h3 class="checkout-card-title">
              <i data-lucide="shield-check" style="width:20px;height:20px;color:var(--gold-600)"></i>
              Payment Gateway (100% Prepaid Delivery)
            </h3>

            <div class="payment-methods-grid">
              <div class="payment-method-card active" data-method="Razorpay Secure Prepaid (UPI, Cards, NetBanking)">
                <div class="payment-method-title">
                  <span>Razorpay Secure Gateway</span>
                  <span class="razorpay-badge">⚡ 100% Prepaid</span>
                </div>
                <div class="payment-method-desc">
                  UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards & NetBanking.
                </div>
                <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.4rem;font-size:0.75rem;color:var(--gold-700);font-weight:600;">
                  <i data-lucide="lock" style="width:13px;height:13px;"></i>
                  <span>256-Bit SSL Encrypted • RBI Approved Infrastructure</span>
                </div>
              </div>
            </div>

            <div class="prepaid-notice-box">
              <i data-lucide="info" style="width:18px;height:18px;color:#166534;flex-shrink:0;margin-top:2px;"></i>
              <div>
                <strong>All-India 100% Prepaid Delivery:</strong> To ensure priority courier transit and prevent delivery delays, Cash on Delivery (COD) is disabled. All orders are backed by our <strong>3-Day Easy Return Guarantee</strong> (items must be returned in the original delivery cover and courier packaging).
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="checkout-card" style="position:sticky;top:100px;">
            <h3 class="checkout-card-title">
              <i data-lucide="receipt" style="width:20px;height:20px;color:var(--gold-600)"></i>
              Order Summary (${state.cart.length} items)
            </h3>

            <div style="display:flex;flex-direction:column;gap:0.85rem;max-height:280px;overflow-y:auto;padding-right:0.5rem;margin-bottom:1.25rem;">
              ${state.cart.map(item => `
                <div style="display:flex;align-items:center;gap:0.85rem;">
                  <img src="${item.image}" alt="${item.name}" style="width:48px;height:48px;border-radius:var(--radius-sm);object-fit:cover;" />
                  <div style="flex:1;">
                    <div style="font-size:0.82rem;font-weight:600;color:var(--navy-deep);">${item.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">${item.quantity} × ₹${item.price}</div>
                  </div>
                  <div style="font-weight:700;font-size:0.85rem;">₹${(item.quantity * item.price).toFixed(0)}</div>
                </div>
              `).join('')}
            </div>

            <div class="cart-calc-row">
              <span>Subtotal</span>
              <span>₹${subtotal.toFixed(0)}</span>
            </div>
            ${discount > 0 ? `
              <div class="cart-calc-row" style="color:var(--gold-700);font-weight:600;">
                <span>Coupon (${state.appliedCoupon.code})</span>
                <span>-₹${discount.toFixed(0)}</span>
              </div>
            ` : ''}
            <div class="cart-calc-row">
              <span>Express Shipping</span>
              <span>${shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div class="cart-calc-row total-row">
              <span>Grand Total</span>
              <span class="gold-gradient-text" style="font-size:1.35rem;">₹${total.toFixed(0)}</span>
            </div>

            <button type="submit" class="btn-gold" style="width:100%;justify-content:center;padding:0.95rem;margin-top:1rem;font-size:1rem;">
              <i data-lucide="lock" style="width:18px;height:18px;"></i>
              <span>Pay ₹${total.toFixed(0)}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
}

// Razorpay Simulated Modal (Audio 4)
function renderRazorpayModal() {
  if (!state.isRazorpayModalOpen || !state.pendingRazorpayOrder) return '';
  const order = state.pendingRazorpayOrder;

  return `
    <div class="razorpay-modal-backdrop" id="razorpay-backdrop">
      <div class="razorpay-modal-box">
        <div class="razorpay-header">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <div style="font-weight:800;font-size:1.15rem;">Razorpay</div>
            <span style="font-size:0.7rem;background:rgba(255,255,255,0.2);padding:0.15rem 0.45rem;border-radius:4px;">SECURE</span>
          </div>
          <button class="modal-close-btn" id="btn-close-razorpay" style="color:#fff;background:rgba(255,255,255,0.1);position:static;width:30px;height:30px;">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
          </button>
        </div>

        <div class="razorpay-body">
          <div class="razorpay-amount-box">
            <div>
              <div style="font-size:0.72rem;color:var(--text-muted);">PAYING CAPRIO ONLINE STORE</div>
              <div style="font-weight:700;font-size:0.85rem;color:var(--navy-deep);">Order #${order.id}</div>
            </div>
            <div style="font-size:1.3rem;font-weight:800;color:#0c2340;">₹${order.total.toFixed(0)}</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.25rem;">
            <button class="btn-outline" style="justify-content:space-between;padding:0.65rem 1rem;" id="btn-pay-upi">
              <span style="display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;">
                <i data-lucide="smartphone" style="width:16px;height:16px;color:#0284c7;"></i> UPI (GPay / PhonePe / Paytm)
              </span>
              <span style="font-size:0.75rem;color:var(--success);font-weight:bold;">Instant</span>
            </button>
            <button class="btn-outline" style="justify-content:space-between;padding:0.65rem 1rem;" id="btn-pay-card">
              <span style="display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;">
                <i data-lucide="credit-card" style="width:16px;height:16px;color:#d97706;"></i> Credit / Debit Card
              </span>
              <span style="font-size:0.75rem;color:var(--text-muted);">Visa/MC/Rupay</span>
            </button>
          </div>

          <button class="btn-primary" id="btn-confirm-razorpay" style="width:100%;justify-content:center;padding:0.85rem;background:#0c2340;">
            <i data-lucide="shield-check" style="width:16px;height:16px;"></i>
            <span>Simulate Successful Payment (₹${order.total.toFixed(0)})</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Order Placed Success Screen
function renderOrderSuccess(order) {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="container order-success-box" style="text-align:center;padding:3.5rem 1.5rem;max-width:600px;margin:0 auto;">
      <div style="width:72px;height:72px;border-radius:50%;background:var(--gold-gradient);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
        <i data-lucide="check" style="width:40px;height:40px;color:#000;"></i>
      </div>
      <span class="section-tag">Order Confirmed</span>
      <h1 style="font-size:2.4rem;color:var(--navy-deep);margin-bottom:0.5rem;">Thank You, ${order.customerName}!</h1>
      <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:2rem;">
        Your order <strong>#${order.id}</strong> has been confirmed and forwarded to dispatch.
      </p>

      <div class="checkout-card" style="text-align:left;margin-bottom:2rem;">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-subtle);padding-bottom:1rem;margin-bottom:1rem;">
          <div>
            <div style="font-size:0.72rem;color:var(--text-muted);">ORDER REF</div>
            <div style="font-weight:700;font-size:1.1rem;color:var(--navy-deep);">${order.id}</div>
          </div>
          <div>
            <div style="font-size:0.72rem;color:var(--text-muted);">DATE</div>
            <div style="font-weight:600;font-size:0.85rem;">${order.date}</div>
          </div>
          <div>
            <div style="font-size:0.72rem;color:var(--text-muted);">TOTAL PAID</div>
            <div style="font-weight:700;font-size:1.1rem;color:var(--gold-600);">₹${order.total.toFixed(0)}</div>
          </div>
        </div>

        <div style="font-size:0.82rem;line-height:1.7;">
          <div><strong>Payment Method:</strong> ${order.paymentMethod}</div>
          <div><strong>Delivery Address:</strong> ${order.address}</div>
          <div><strong>Status:</strong> <span class="status-badge status-processing">${order.status}</span></div>
        </div>
      </div>

      <div style="display:flex;gap:1rem;justify-content:center;">
        <button class="btn-primary" id="btn-success-continue">
          <i data-lucide="shopping-bag" style="width:16px;height:16px;"></i> Continue Shopping
        </button>
        <button class="btn-outline" data-nav-view="orders">
          <i data-lucide="package" style="width:16px;height:16px;"></i> View in My Orders
        </button>
      </div>
    </div>
    ${renderFooter()}
  `;

  if (window.lucide) window.lucide.createIcons();
  bindGlobalEvents();
}

// 11. Customer Orders View
function renderCustomerOrdersView() {
  const userOrders = state.orders.filter(o => 
    o.customerEmail?.toLowerCase() === state.currentUser?.email?.toLowerCase() ||
    o.customerPhone === state.currentUser?.phone
  );

  return `
    <div class="container" style="padding-top:2.5rem;padding-bottom:5rem;">
      <div style="margin-bottom:2rem;">
        <button class="btn-outline" id="btn-back-to-store" style="padding:0.4rem 0.9rem;font-size:0.8rem;margin-bottom:0.75rem;">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Return to Store
        </button>
        <h1 style="font-size:2.2rem;color:var(--navy-deep);">My Caprio Orders</h1>
        <p style="color:var(--text-secondary);font-size:0.9rem;">View past purchases and real-time delivery status.</p>
      </div>

      ${userOrders.length === 0 ? `
        <div class="cart-empty-state" style="padding:4rem 0;">
          <div class="empty-icon-circle"><i data-lucide="package" style="width:32px;height:32px;"></i></div>
          <h3>No Orders Placed Yet</h3>
          <p style="color:var(--text-secondary);font-size:0.9rem;">Explore our everyday cotton vests and t-shirts.</p>
          <button class="btn-primary" data-nav-view="collections">Explore Collection</button>
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          ${userOrders.map(order => `
            <div class="checkout-card">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;padding-bottom:0.85rem;border-bottom:1px solid var(--border-subtle);flex-wrap:wrap;gap:0.75rem;">
                <div>
                  <span style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">ORDER REF</span>
                  <div style="font-family:monospace;font-size:1.05rem;font-weight:800;color:var(--navy-deep);">${order.id}</div>
                </div>
                <div>
                  <span style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">DATE PLACED</span>
                  <div style="font-size:0.82rem;font-weight:600;">${order.date}</div>
                </div>
                <div>
                  <span style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;">AMOUNT</span>
                  <div style="font-family:var(--font-serif);font-size:1.15rem;font-weight:700;color:var(--gold-600);">₹${order.total.toFixed(0)}</div>
                </div>
                <div>
                  <span class="status-badge ${order.status === 'Delivered' ? 'status-delivered' : order.status === 'Shipped' ? 'status-shipped' : 'status-processing'}">
                    ● ${order.status}
                  </span>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:0.85rem;margin-bottom:0.85rem;">
                ${order.items.map(item => `
                  <div style="display:flex;align-items:center;gap:0.85rem;background:var(--bg-secondary);padding:0.6rem;border-radius:var(--radius-md);">
                    <img src="${item.image}" alt="${item.name}" style="width:44px;height:44px;border-radius:var(--radius-sm);object-fit:cover;" />
                    <div>
                      <div style="font-size:0.8rem;font-weight:600;color:var(--navy-deep);">${item.name}</div>
                      <div style="font-size:0.72rem;color:var(--text-secondary);">${item.quantity} × ₹${item.price}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div style="font-size:0.75rem;color:var(--text-secondary);display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;border-top:1px solid var(--border-subtle);padding-top:0.65rem;">
                <span><strong>Destination:</strong> ${order.address}</span>
                <span><strong>Payment:</strong> ${order.paymentMethod}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// 12. Dedicated Standalone Admin Portal (Audio 3: Independent website feel)
function renderAdminStandaloneView() {
  const totalRevenue = state.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = state.orders.length;
  const totalProducts = state.products.length;
  const activeCoupons = state.coupons.filter(c => c.active).length;
  const lowStockProducts = state.products.filter(p => p.stock <= 5);

  return `
    <div class="admin-standalone-wrapper">
      <header class="admin-standalone-header">
        <div class="container admin-header-content">
          <div class="admin-brand-group">
            <div class="brand-logo-card" style="padding:4px 10px;">
              <img src="/logo.png" alt="Caprio Online Store" style="height:26px;" />
            </div>
            <div>
              <div class="admin-brand-title">CAPRIO ATELIER</div>
              <span class="admin-portal-tag">Store Administration Suite</span>
            </div>
          </div>

          <div class="admin-header-right">
            <span style="font-size:0.8rem;color:var(--gold-200);">
              Administrator: <strong>${state.currentUser?.name}</strong>
            </span>
            <!-- Single Prominent Return to Store Button (Audio 3 & 4) -->
            <button class="btn-admin-return-store" id="btn-admin-return-store">
              <i data-lucide="store" style="width:16px;height:16px;"></i>
              <span>View Storefront</span>
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top:2.5rem;padding-bottom:4rem;flex:1;">
        <div class="admin-header-row">
          <div>
            <h1 style="font-size:1.85rem;color:var(--navy-deep);">Atelier Management Suite</h1>
            <p style="font-size:0.85rem;color:var(--text-secondary);">Manage product inventory, stock levels, promo codes, and customer orders.</p>
          </div>
          <div style="display:flex;gap:0.75rem;">
            <button class="btn-primary" id="btn-admin-add-product-open" style="font-size:0.85rem;padding:0.6rem 1.25rem;">
              <i data-lucide="plus-circle" style="width:16px;height:16px;"></i> Add Product
            </button>
            <button class="btn-gold" id="btn-admin-add-coupon-open" style="font-size:0.85rem;padding:0.6rem 1.25rem;">
              <i data-lucide="tag" style="width:16px;height:16px;"></i> Generate Coupon
            </button>
          </div>
        </div>

        <div class="admin-tabs-nav">
          <button class="admin-tab-btn ${state.adminTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
            <i data-lucide="layout-grid" style="width:16px;height:16px;"></i> Overview
          </button>
          <button class="admin-tab-btn ${state.adminTab === 'inventory' ? 'active' : ''}" data-admin-tab="inventory">
            <i data-lucide="package" style="width:16px;height:16px;"></i> Stock & Inventory (${totalProducts})
          </button>
          <button class="admin-tab-btn ${state.adminTab === 'orders' ? 'active' : ''}" data-admin-tab="orders">
            <i data-lucide="shopping-cart" style="width:16px;height:16px;"></i> Orders (${totalOrders})
          </button>
          <button class="admin-tab-btn ${state.adminTab === 'coupons' ? 'active' : ''}" data-admin-tab="coupons">
            <i data-lucide="percent" style="width:16px;height:16px;"></i> Coupons & Offers (${state.coupons.length})
          </button>
          <button class="admin-tab-btn ${state.adminTab === 'customers' ? 'active' : ''}" data-admin-tab="customers">
            <i data-lucide="users" style="width:16px;height:16px;"></i> Clients (${state.users.length})
          </button>
        </div>

        ${state.adminTab === 'overview' ? `
          <div class="admin-kpi-grid">
            <div class="kpi-card">
              <div>
                <div class="kpi-label">Total Revenue</div>
                <div class="kpi-value">₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                <div class="kpi-sub">↑ 100% fulfillment</div>
              </div>
              <div class="kpi-icon-box"><i data-lucide="indian-rupee" style="width:24px;height:24px;"></i></div>
            </div>

            <div class="kpi-card">
              <div>
                <div class="kpi-label">Orders Placed</div>
                <div class="kpi-value">${totalOrders}</div>
                <div class="kpi-sub">Active client orders</div>
              </div>
              <div class="kpi-icon-box"><i data-lucide="shopping-bag" style="width:24px;height:24px;"></i></div>
            </div>

            <div class="kpi-card">
              <div>
                <div class="kpi-label">Active Creations</div>
                <div class="kpi-value">${totalProducts}</div>
                <div class="kpi-sub">${lowStockProducts.length} low stock warnings</div>
              </div>
              <div class="kpi-icon-box"><i data-lucide="box" style="width:24px;height:24px;"></i></div>
            </div>

            <div class="kpi-card">
              <div>
                <div class="kpi-label">Active Coupons</div>
                <div class="kpi-value">${activeCoupons}</div>
                <div class="kpi-sub">Live discount codes</div>
              </div>
              <div class="kpi-icon-box"><i data-lucide="ticket" style="width:24px;height:24px;"></i></div>
            </div>
          </div>

          ${lowStockProducts.length > 0 ? `
            <div class="admin-card" style="border-left:4px solid var(--warning);background:#fffef9;">
              <h3 style="font-size:1.15rem;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;color:var(--warning);">
                <i data-lucide="alert-triangle" style="width:20px;height:20px;"></i>
                Low Stock Alert (${lowStockProducts.length} items require replenishment)
              </h3>
              <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                ${lowStockProducts.map(p => `
                  <div style="background:#fff;border:1px solid var(--border-light);padding:0.6rem 0.85rem;border-radius:var(--radius-md);display:flex;align-items:center;gap:0.75rem;">
                    <img src="${p.image}" alt="${p.name}" style="width:36px;height:36px;border-radius:var(--radius-sm);object-fit:cover;" />
                    <div>
                      <div style="font-size:0.8rem;font-weight:700;">${p.name}</div>
                      <div style="font-size:0.72rem;color:var(--warning);font-weight:600;">Stock: ${p.stock} units left</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="admin-card">
            <div class="admin-card-header">
              <h3 style="font-size:1.2rem;color:var(--navy-deep);">Recent Orders</h3>
              <button class="btn-outline" style="font-size:0.8rem;padding:0.35rem 0.85rem;" data-admin-tab="orders">View All Orders</button>
            </div>
            ${renderOrdersTable(state.orders.slice(0, 5))}
          </div>
        ` : ''}

        ${state.adminTab === 'inventory' ? `
          <div class="admin-card">
            <div class="admin-card-header">
              <div>
                <h3 style="font-size:1.3rem;color:var(--navy-deep);">Catalog & Stock Management</h3>
                <p style="font-size:0.85rem;color:var(--text-secondary);">Add new items, update pricing in ₹, and modify stock quantities.</p>
              </div>
              <button class="btn-primary" id="btn-admin-add-product-open-2">
                <i data-lucide="plus" style="width:16px;height:16px;"></i> Add Product
              </button>
            </div>

            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Units</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.products.map(prod => `
                    <tr>
                      <td>
                        <div style="display:flex;align-items:center;gap:0.85rem;">
                          <img src="${prod.image}" alt="${prod.name}" class="table-thumb" />
                          <div>
                            <div style="font-weight:700;color:var(--navy-deep);">${prod.name}</div>
                            <div style="font-size:0.72rem;color:var(--text-muted);">${prod.badge || 'Standard Catalog'}</div>
                          </div>
                        </div>
                      </td>
                      <td style="text-transform:capitalize;font-weight:500;">${prod.category}</td>
                      <td>
                        <div style="font-weight:700;">₹${prod.price}</div>
                        ${prod.originalPrice > prod.price ? `<span style="font-size:0.72rem;text-decoration:line-through;color:var(--text-muted);">₹${prod.originalPrice}</span>` : ''}
                      </td>
                      <td>
                        <div style="display:flex;align-items:center;gap:0.4rem;">
                          <input 
                            type="number" 
                            class="form-control" 
                            style="width:70px;padding:0.3rem 0.5rem;font-size:0.82rem;font-weight:bold;" 
                            value="${prod.stock}" 
                            data-inline-stock-id="${prod.id}"
                            min="0"
                          />
                          <button class="table-action-btn" data-action="save-stock" data-id="${prod.id}" title="Save Stock">
                            <i data-lucide="check" style="width:14px;height:14px;"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span class="stock-indicator-pill ${prod.stock <= 0 ? 'stock-out' : prod.stock <= 5 ? 'stock-low' : 'stock-in'}">
                          ${prod.stock <= 0 ? 'Sold Out' : prod.stock <= 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <div style="display:flex;gap:0.4rem;">
                          <button class="table-action-btn" data-action="edit-product" data-id="${prod.id}" title="Edit Product">
                            <i data-lucide="edit-3" style="width:14px;height:14px;"></i>
                          </button>
                          <button class="table-action-btn delete" data-action="delete-product" data-id="${prod.id}" title="Delete Product">
                            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${state.adminTab === 'orders' ? `
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 style="font-size:1.3rem;color:var(--navy-deep);">All Customer Orders</h3>
            </div>
            ${renderOrdersTable(state.orders)}
          </div>
        ` : ''}

        ${state.adminTab === 'coupons' ? `
          <div class="admin-card">
            <div class="admin-card-header">
              <div>
                <h3 style="font-size:1.3rem;color:var(--navy-deep);">Privilege Promo Codes</h3>
                <p style="font-size:0.85rem;color:var(--text-secondary);">Manage active coupons and customer discounts.</p>
              </div>
              <button class="btn-gold" id="btn-admin-add-coupon-open-2">
                <i data-lucide="plus" style="width:16px;height:16px;"></i> Generate New Coupon
              </button>
            </div>

            <div class="coupon-cards-grid">
              ${state.coupons.map(coupon => `
                <div class="coupon-ticket" style="${!coupon.active ? 'opacity:0.6;filter:grayscale(0.5);' : ''}">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <span class="coupon-code-banner">${coupon.code}</span>
                    <button class="table-action-btn delete" data-action="delete-coupon" data-id="${coupon.id}" title="Delete" style="width:28px;height:28px;">
                      <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                  </div>

                  <div class="coupon-discount-val">
                    ${coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT`}
                  </div>

                  <p style="font-size:0.8rem;color:var(--text-secondary);margin:0.5rem 0 1rem;">
                    ${coupon.description}
                  </p>

                  <div style="font-size:0.75rem;color:var(--text-muted);border-top:1px dashed var(--border-light);padding-top:0.65rem;display:flex;justify-content:space-between;">
                    <span>Min spend: <strong>₹${coupon.minSpend}</strong></span>
                    <span>Used: <strong>${coupon.uses || 0} times</strong></span>
                  </div>

                  <div style="margin-top:0.85rem;display:flex;align-items:center;justify-content:space-between;">
                    <span class="status-badge ${coupon.active ? 'status-delivered' : 'status-cancelled'}">
                      ● ${coupon.active ? 'Active' : 'Disabled'}
                    </span>
                    <button class="btn-outline" style="font-size:0.75rem;padding:0.25rem 0.65rem;" data-action="toggle-coupon" data-id="${coupon.id}">
                      ${coupon.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${state.adminTab === 'customers' ? `
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 style="font-size:1.3rem;color:var(--navy-deep);">Registered Clients Directory</h3>
            </div>
            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile Phone</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Member Since</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.users.map(u => {
                    const orderCount = state.orders.filter(o => o.customerPhone === u.phone || o.customerEmail?.toLowerCase() === u.email?.toLowerCase()).length;
                    return `
                      <tr>
                        <td><strong>${u.name}</strong></td>
                        <td>${u.phone || 'N/A'}</td>
                        <td>${u.email || 'N/A'}</td>
                        <td>
                          <span class="status-badge ${u.role === 'admin' ? 'status-processing' : 'status-delivered'}">
                            ${u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>${u.joined}</td>
                        <td><strong>${orderCount} orders</strong></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </main>
    </div>
  `;
}

function renderOrdersTable(ordersList) {
  if (!ordersList || ordersList.length === 0) {
    return `
      <div style="text-align:center;padding:2.5rem;color:var(--text-secondary);">
        <i data-lucide="inbox" style="width:36px;height:36px;color:var(--text-muted);margin-bottom:0.5rem;"></i>
        <div>No orders recorded yet.</div>
      </div>
    `;
  }

  return `
    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order Ref</th>
            <th>Client</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Date</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          ${ordersList.map(order => `
            <tr>
              <td><strong style="font-family:monospace;">${order.id}</strong></td>
              <td>
                <div style="font-weight:600;">${order.customerName}</div>
                <div style="font-size:0.72rem;color:var(--text-muted);">${order.customerPhone || order.customerEmail}</div>
              </td>
              <td>
                <div style="font-size:0.75rem;">
                  ${order.items.map(i => `${i.quantity}x ${i.name}`).join('<br/>')}
                </div>
              </td>
              <td><strong style="color:var(--navy-deep);">₹${order.total.toFixed(0)}</strong></td>
              <td><span style="font-size:0.75rem;">${order.paymentMethod}</span></td>
              <td style="font-size:0.75rem;">${order.date}</td>
              <td>
                <span class="status-badge ${order.status === 'Delivered' ? 'status-delivered' : order.status === 'Shipped' ? 'status-shipped' : order.status === 'Cancelled' ? 'status-cancelled' : 'status-processing'}">
                  ● ${order.status}
                </span>
              </td>
              <td>
                <select class="filter-select" style="padding:0.3rem 0.5rem;font-size:0.78rem;" data-action="change-order-status" data-order-id="${order.id}">
                  <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                  <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                  <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 13. Dedicated Product Detail Page (User Audio 2 Request: Full Responsive Page + Similar Products Grid below like Meesho)
function renderProductDetailView() {
  const prod = state.products.find(p => p.id === state.selectedProductId) || state.products[0];
  if (!prod) return '';

  const isWishlisted = state.wishlist.includes(prod.id);
  const discountPercent = prod.originalPrice > prod.price 
    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) 
    : 0;

  let stockClass = 'stock-in';
  let stockText = `${prod.stock} in stock`;
  if (prod.stock <= 0) {
    stockClass = 'stock-out';
    stockText = 'Sold Out';
  } else if (prod.stock <= 5) {
    stockClass = 'stock-low';
    stockText = `Only ${prod.stock} left`;
  }

  // Similar Products from same category (excluding current product), plus other top items
  const similarProducts = state.products
    .filter(p => p.id !== prod.id && (p.category === prod.category || prod.category === 'all'))
    .slice(0, 6);
  if (similarProducts.length < 4) {
    state.products.forEach(p => {
      if (p.id !== prod.id && !similarProducts.some(sp => sp.id === p.id) && similarProducts.length < 6) {
        similarProducts.push(p);
      }
    });
  }

  return `
    <div class="product-detail-page-container">
      <div class="container">
        <!-- Breadcrumbs & Back Navigation -->
        <div class="product-detail-breadcrumb-bar">
          <button class="btn-detail-back" id="btn-back-to-catalog">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Back to Collections</span>
          </button>
          <div class="breadcrumb-links">
            <span data-nav-view="store" style="cursor:pointer;">Home</span>
            <span class="bc-sep">/</span>
            <span data-nav-view="collections" style="cursor:pointer;">Collections</span>
            <span class="bc-sep">/</span>
            <span class="bc-current">${prod.name}</span>
          </div>
        </div>

        <!-- Product Hero Card -->
        <div class="product-detail-hero-grid">
          <!-- Left: Gallery Media -->
          <div class="product-detail-media-card">
            <div class="detail-image-wrapper">
              <img src="${prod.image}" alt="${prod.name}" class="product-detail-main-img" />
              <div class="detail-badge-container">
                ${prod.badge ? `<span class="product-badge badge-gold">${prod.badge}</span>` : ''}
                ${discountPercent > 0 ? `<span class="product-badge badge-sale">-${discountPercent}% OFF</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Right: Product Information & Specifications -->
          <div class="product-detail-info-card">
            <div class="detail-header-meta">
              <span class="detail-category-tag">${prod.category}</span>
              <div class="card-rating">
                <i data-lucide="star" class="star-icon" style="width:15px;height:15px;"></i>
                <span style="font-weight:700;">${prod.rating}</span>
                <span style="color:var(--text-muted);font-weight:400;">(${prod.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 class="product-detail-title">${prod.name}</h1>

            <div class="detail-price-box">
              <div class="price-display-group">
                <span class="detail-current-price">₹${prod.price}</span>
                ${prod.originalPrice > prod.price ? `
                  <span class="detail-original-price">₹${prod.originalPrice}</span>
                  <span class="detail-discount-pill">Save ₹${prod.originalPrice - prod.price} (${discountPercent}% OFF)</span>
                ` : ''}
              </div>
              <div class="detail-stock-row" style="margin-top:0.4rem;display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
                <span class="stock-indicator-pill ${stockClass}">
                  <i data-lucide="${prod.stock > 0 ? 'check' : 'x'}" style="width:11px;height:11px;"></i>
                  ${stockText}
                </span>
                <span class="detail-tax-inclusive">Inclusive of all taxes & express shipping</span>
              </div>
            </div>

            <div class="detail-description-block">
              <h3 class="detail-subhead">Craftsmanship & Description</h3>
              <p class="detail-description-text">${prod.description}</p>
            </div>

            <!-- Specifications Table -->
            <div class="detail-specs-block">
              <h3 class="detail-subhead">Product Specifications</h3>
              <div class="specs-pill-grid">
                ${Object.entries(prod.specs || {}).map(([key, val]) => `
                  <div class="spec-pill-item">
                    <span class="spec-key">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span class="spec-value">${val}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="detail-trust-badges-grid">
              <div class="trust-badge-card">
                <i data-lucide="rotate-ccw" style="width:20px;height:20px;color:var(--gold-600);"></i>
                <div>
                  <strong>3-Day Easy Return</strong>
                  <span>Original cover & tag required</span>
                </div>
              </div>
              <div class="trust-badge-card">
                <i data-lucide="truck" style="width:20px;height:20px;color:var(--gold-600);"></i>
                <div>
                  <strong>Express Courier Delivery</strong>
                  <span>Fast shipping across India</span>
                </div>
              </div>
              <div class="trust-badge-card">
                <i data-lucide="shield-check" style="width:20px;height:20px;color:var(--gold-600);"></i>
                <div>
                  <strong>Genuine Caprio Quality</strong>
                  <span>100% authentic craftsmanship</span>
                </div>
              </div>
            </div>

            <!-- CTA Actions (Add to Bag / Wishlist) -->
            <div class="detail-actions-row">
              <button 
                class="btn-primary detail-add-cart-btn" 
                id="btn-detail-add-cart" 
                data-id="${prod.id}"
                ${prod.stock <= 0 ? 'disabled' : ''}
              >
                <i data-lucide="shopping-bag" style="width:20px;height:20px;"></i>
                <span>${prod.stock <= 0 ? 'Sold Out' : 'Add to Shopping Bag'}</span>
              </button>

              <button 
                class="icon-btn detail-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                id="btn-detail-wishlist" 
                data-id="${prod.id}"
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
              >
                <i data-lucide="heart" style="width:22px;height:22px;"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- SIMILAR / RECOMMENDED PRODUCTS (Meesho Style Infinite Exploration) -->
        <div class="detail-similar-section">
          <div class="section-header" style="margin-bottom:1.5rem;text-align:left;">
            <span class="section-tag">Explore More</span>
            <h2 class="section-title">Similar Curated Pieces</h2>
            <p class="section-desc">Customers who viewed this piece also loved these handcrafted styles.</p>
          </div>

          <div class="products-grid">
            ${similarProducts.map(p => renderProductCard(p)).join('')}
          </div>

          <div style="text-align:center;margin-top:2rem;">
            <button class="btn-outline" data-nav-view="collections" style="padding:0.75rem 2rem;">
              <span>View All Collections</span>
              <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 13b. Desktop Center Sheet Modal (User Audio: "mattedhanel aadyathe pole thanne naduvil oru sheet kaanichitt athil details kaanikkunnathanu better")
function renderQuickViewModal() {
  if (!state.quickViewProduct) return '';
  const prod = state.quickViewProduct;
  const isWishlisted = state.wishlist.includes(prod.id);
  const discountPercent = prod.originalPrice > prod.price 
    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) 
    : 0;

  let stockClass = 'stock-in';
  let stockText = `${prod.stock} in stock`;
  if (prod.stock <= 0) {
    stockClass = 'stock-out';
    stockText = 'Sold Out';
  } else if (prod.stock <= 5) {
    stockClass = 'stock-low';
    stockText = `Only ${prod.stock} left`;
  }

  return `
    <div class="modal-backdrop open" id="quick-view-backdrop">
      <div class="modal-window quickview-modal-window">
        <button class="modal-close-btn" id="btn-close-quick-view" title="Close Sheet">
          <i data-lucide="x" style="width:20px;height:20px;"></i>
        </button>

        <div class="quickview-modal-grid">
          <!-- Left: High-Resolution Product Media -->
          <div class="quickview-media-col">
            <div class="quickview-img-wrap">
              <img src="${prod.image}" alt="${prod.name}" class="quickview-img" />
              <div class="detail-badge-container">
                ${prod.badge ? `<span class="product-badge badge-gold">${prod.badge}</span>` : ''}
                ${discountPercent > 0 ? `<span class="product-badge badge-sale">-${discountPercent}% OFF</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Right: Product Information Sheet -->
          <div class="quickview-info-col">
            <div class="detail-header-meta">
              <span class="detail-category-tag">${prod.category}</span>
              <div class="card-rating">
                <i data-lucide="star" class="star-icon" style="width:14px;height:14px;"></i>
                <span style="font-weight:700;">${prod.rating}</span>
                <span style="color:var(--text-muted);font-weight:400;font-size:0.78rem;">(${prod.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h2 class="quickview-title">${prod.name}</h2>

            <div class="detail-price-box" style="margin-bottom:1rem;padding:0.75rem 1rem;">
              <div class="price-display-group">
                <span class="detail-current-price" style="font-size:1.6rem;">₹${prod.price}</span>
                ${prod.originalPrice > prod.price ? `
                  <span class="detail-original-price">₹${prod.originalPrice}</span>
                  <span class="detail-discount-pill">Save ₹${prod.originalPrice - prod.price} (${discountPercent}% OFF)</span>
                ` : ''}
              </div>
              <div class="detail-stock-row" style="margin-top:0.4rem;display:flex;align-items:center;gap:0.75rem;">
                <span class="stock-indicator-pill ${stockClass}">
                  <i data-lucide="${prod.stock > 0 ? 'check' : 'x'}" style="width:11px;height:11px;"></i>
                  ${stockText}
                </span>
                <span class="detail-tax-inclusive">Inclusive of all taxes & expedited shipping</span>
              </div>
            </div>

            <p class="quickview-desc">${prod.description}</p>

            <!-- Specifications Table -->
            <div class="quickview-specs-table-wrap">
              <table class="specs-table">
                ${Object.entries(prod.specs || {}).map(([key, val]) => `
                  <tr>
                    <td>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                    <td>${val}</td>
                  </tr>
                `).join('')}
              </table>
            </div>

            <!-- Trust Strip -->
            <div class="product-modal-trust-strip">
              <span><i data-lucide="rotate-ccw"></i> 3-Day Return Policy (Original Cover Required)</span>
              <span><i data-lucide="truck"></i> All-India Prepaid Courier</span>
              <span><i data-lucide="shield-check"></i> Genuine Caprio Quality</span>
            </div>

            <!-- Action Buttons Row -->
            <div class="quickview-actions-row">
              <button 
                class="btn-primary" 
                id="modal-btn-add-cart" 
                data-id="${prod.id}"
                style="flex:1;justify-content:center;padding:0.85rem 1.5rem;font-size:0.92rem;"
                ${prod.stock <= 0 ? 'disabled' : ''}
              >
                <i data-lucide="shopping-bag" style="width:18px;height:18px;"></i>
                <span>${prod.stock <= 0 ? 'Sold Out' : 'Add to Shopping Bag'}</span>
              </button>

              <button 
                class="icon-btn ${isWishlisted ? 'active' : ''}" 
                id="modal-btn-wishlist" 
                data-id="${prod.id}" 
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                style="width:48px;height:48px;"
              >
                <i data-lucide="heart" style="width:20px;height:20px;"></i>
              </button>
            </div>

            <!-- Option to expand into dedicated full page -->
            <div style="margin-top:0.85rem;text-align:center;">
              <button class="btn-quickview-full-page" id="btn-quickview-view-full" data-id="${prod.id}">
                <span>View Full Page & Similar Recommendations</span>
                <i data-lucide="arrow-up-right" style="width:14px;height:14px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 14. Privacy Policy & Terms Modal (Audio 4)
function renderPrivacyPolicyModal() {
  if (!state.isPrivacyModalOpen) return '';

  return `
    <div class="modal-backdrop open" id="privacy-modal-backdrop">
      <div class="modal-window legal-modal-window">
        <button class="modal-close-btn" id="btn-close-privacy">
          <i data-lucide="x" style="width:20px;height:20px;"></i>
        </button>

        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
          <div class="brand-logo-card">
            <img src="/logo.png" alt="Caprio Online Store" />
          </div>
          <div>
            <h3 style="font-size:1.35rem;color:var(--navy-deep);margin:0;">Client Privacy, 3-Day Returns & Terms</h3>
            <span style="font-size:0.75rem;color:var(--gold-600);font-weight:700;">CAPRIO ONLINE STORE</span>
          </div>
        </div>

        <div class="legal-section-block">
          <h4>1. 3-Day Hassle-Free Return Policy (Original Packaging Mandatory)</h4>
          <p>
            We take pride in delivering perfect luxury garments and accessories. Caprio provides a <strong>3-Day Return & Size Exchange Policy</strong> from the date of delivery.
          </p>
          <div style="margin-top:0.6rem;background:#fef2f2;border-left:3px solid #ef4444;padding:0.75rem 1rem;border-radius:6px;color:#991b1b;font-size:0.86rem;line-height:1.5;">
            <strong>Mandatory Return Condition:</strong> As per Caprio standard policy, any returned item <strong>must be returned in the exact original courier delivery cover and packaging</strong> as it was delivered, along with all tags, labels, and boxes intact. Items must be unworn and unwashed. Returns without the original courier cover cannot be accepted by reverse logistics partners.
          </div>
          <p style="margin-top:0.6rem;">
            To initiate your return or size exchange within the 3-day window, contact customer support with your Order ID (<code>CP-XXXXX</code>).
          </p>
        </div>

        <div class="legal-section-block">
          <h4>2. 100% Prepaid All-India Delivery Policy</h4>
          <p>
            Caprio delivers across all postal PIN codes across India. To guarantee prioritized courier dispatch and prevent fraudulent order rejections, all orders are accepted on a <strong>100% Prepaid basis</strong> via Razorpay (UPI, Google Pay, PhonePe, Debit/Credit Cards & NetBanking). Cash on Delivery (COD) is not offered.
          </p>
        </div>

        <div class="legal-section-block">
          <h4>3. Secure Electronic Payments & Privacy</h4>
          <p>
            Customer details (name, delivery address, phone) are strictly collected for courier dispatch and real-time SMS tracking updates. All electronic transactions are 256-bit encrypted via RBI-authorized payment processors. We never store credit/debit card numbers or UPI PINs.
          </p>
        </div>

        <div style="text-align:right;margin-top:1.5rem;">
          <button class="btn-primary" id="btn-agree-privacy" style="padding:0.6rem 1.5rem;">
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  `;
}

// 15. Admin Add Product & Coupon Modals
function renderProductEditModal() {
  if (!state.isAddProductModalOpen && !state.editingProduct) return '';
  const isEditing = !!state.editingProduct;
  const prod = state.editingProduct || {
    name: '',
    category: 'baniyans',
    price: 399,
    originalPrice: 599,
    stock: 25,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop',
    description: ''
  };

  return `
    <div class="modal-backdrop open" id="product-modal-backdrop">
      <div class="modal-window" style="max-width:600px;padding:2rem;">
        <button class="modal-close-btn" id="btn-close-product-modal">
          <i data-lucide="x" style="width:18px;height:18px;"></i>
        </button>

        <h3 style="font-size:1.4rem;color:var(--navy-deep);margin-bottom:0.4rem;">
          ${isEditing ? 'Edit Product & Stock' : 'Add New Creation'}
        </h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1.5rem;">
          ${isEditing ? `Modifying "${prod.name}"` : 'Publish a new item to the Caprio storefront.'}
        </p>

        <form id="admin-product-form">
          <div class="form-group">
            <label class="form-label">Product Name</label>
            <input type="text" class="form-control" id="prod-name" value="${prod.name}" required />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-control" id="prod-category">
                <option value="baniyans" ${prod.category === 'baniyans' ? 'selected' : ''}>Baniyans & Vests</option>
                <option value="tshirts" ${prod.category === 'tshirts' ? 'selected' : ''}>T-Shirts & Polos</option>
                <option value="shirts" ${prod.category === 'shirts' ? 'selected' : ''}>Shirts & Casuals</option>
                <option value="loungewear" ${prod.category === 'loungewear' ? 'selected' : ''}>Innerwear & Bottoms</option>
                <option value="accessories" ${prod.category === 'accessories' ? 'selected' : ''}>Accessories & Fragrances</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Badge</label>
              <input type="text" class="form-control" id="prod-badge" value="${prod.badge || ''}" placeholder="e.g. Bestseller" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label class="form-label">Price (₹)</label>
              <input type="number" class="form-control" id="prod-price" value="${prod.price}" min="1" required />
            </div>
            <div class="form-group">
              <label class="form-label">Original Price (₹)</label>
              <input type="number" class="form-control" id="prod-original-price" value="${prod.originalPrice}" min="1" />
            </div>
            <div class="form-group">
              <label class="form-label">Stock Units</label>
              <input type="number" class="form-control" id="prod-stock" value="${prod.stock}" min="0" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input type="url" class="form-control" id="prod-image" value="${prod.image}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-control" id="prod-desc" rows="3" required>${prod.description}</textarea>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
            <button type="button" class="btn-outline" id="btn-cancel-product-modal">Cancel</button>
            <button type="submit" class="btn-primary">
              <span>${isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderCouponModal() {
  if (!state.isAddCouponModalOpen) return '';

  return `
    <div class="modal-backdrop open" id="coupon-modal-backdrop">
      <div class="modal-window" style="max-width:500px;padding:2rem;">
        <button class="modal-close-btn" id="btn-close-coupon-modal">
          <i data-lucide="x" style="width:18px;height:18px;"></i>
        </button>

        <h3 style="font-size:1.4rem;color:var(--navy-deep);margin-bottom:0.4rem;">
          Generate Privilege Coupon
        </h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1.5rem;">
          Clients can apply this code during checkout for instant discount in ₹.
        </p>

        <form id="admin-coupon-form">
          <div class="form-group">
            <label class="form-label">Coupon Code</label>
            <input type="text" class="form-control" id="coup-code" placeholder="e.g. CAPRIO20" style="text-transform:uppercase;font-weight:700;" required />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label class="form-label">Discount Type</label>
              <select class="form-control" id="coup-type">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Flat Amount (₹)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Discount Value</label>
              <input type="number" class="form-control" id="coup-value" placeholder="e.g. 15 or 100" min="1" required />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div class="form-group">
              <label class="form-label">Min Spend (₹)</label>
              <input type="number" class="form-control" id="coup-min-spend" value="499" min="0" required />
            </div>
            <div class="form-group">
              <label class="form-label">Expiry Date</label>
              <input type="date" class="form-control" id="coup-expiry" value="2027-12-31" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-control" id="coup-desc" placeholder="Special privilege discount" />
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
            <button type="button" class="btn-outline" id="btn-cancel-coupon-modal">Cancel</button>
            <button type="submit" class="btn-gold">Generate Code</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 16. Footer
function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <div class="footer-logo-card">
            <img src="/logo.png" alt="Caprio Online Store" />
          </div>
          <p class="footer-brand-text">
            India's premier luxury apparel and signature accessories destination — from fine linen shirts and tailored trousers to kids wear, full-grain leather belts, luxury perfumes, and timepieces.
          </p>
        </div>

        <div>
          <h4 class="footer-col-title">Navigation</h4>
          <div class="footer-links">
            <span class="footer-link" data-nav-view="store">Home</span>
            <span class="footer-link" data-nav-view="collections">Collections Catalog</span>
            <span class="footer-link" data-nav-view="about">About Us</span>
            <span class="footer-link" data-nav-view="orders">Order Tracking</span>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Client Support</h4>
          <div class="footer-links">
            <span class="footer-link" id="footer-link-returns">3-Day Return Policy</span>
            <span class="footer-link" id="footer-link-wishlist">My Wishlist</span>
            <span class="footer-link" id="footer-link-privacy">Privacy Policy</span>
            <span class="footer-link" id="footer-link-terms">Terms of Service</span>
            <span class="footer-link" data-nav-view="about">Courier Dispatch Info</span>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Caprio Newsletter</h4>
          <p style="font-size:0.82rem;color:#94a3b8;line-height:1.5;">
            Subscribe to our private dispatch for special seasonal drops and offers.
          </p>
          <div class="newsletter-box">
            <input type="email" placeholder="Enter your email..." class="newsletter-input" />
            <button class="newsletter-btn" onclick="alert('Thank you for subscribing to Caprio!')">Join</button>
          </div>
        </div>
      </div>

      <div class="container footer-bottom">
        <div>
          © ${new Date().getFullYear()} Caprio Online Store Inc. All Rights Reserved.
        </div>
        <div style="display:flex;gap:1.5rem;">
          <span style="color:var(--gold-400);cursor:pointer;" id="footer-admin-link">
            👑 Administrator Portal
          </span>
          <span class="footer-link" id="footer-link-returns-2">3-Day Returns</span>
          <span class="footer-link" id="footer-link-privacy-2">Privacy & Policy</span>
        </div>
      </div>
    </footer>
  `;
}

// ============================================================
// MASTER RENDER DISPATCHER
// ============================================================
export function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  // Audio 3: Standalone Dedicated Admin Portal
  if (state.currentView === 'admin') {
    app.innerHTML = `
      ${renderAdminStandaloneView()}
      ${renderProductEditModal()}
      ${renderCouponModal()}
    `;
    if (window.lucide) window.lucide.createIcons();
    bindGlobalEvents();
    return;
  }

  // Customer Views
  let bodyContent = renderHeader();

  if (state.currentView === 'store') {
    bodyContent += renderHomeView();
  } else if (state.currentView === 'collections') {
    bodyContent += renderCollectionsView();
  } else if (state.currentView === 'product-detail') {
    bodyContent += renderProductDetailView();
  } else if (state.currentView === 'cart') {
    bodyContent += renderCartPageView();
  } else if (state.currentView === 'wishlist') {
    bodyContent += renderWishlistPageView();
  } else if (state.currentView === 'about') {
    bodyContent += renderAboutView();
  } else if (state.currentView === 'profile') {
    bodyContent += renderProfileView();
  } else if (state.currentView === 'checkout') {
    bodyContent += renderCheckoutView();
  } else if (state.currentView === 'orders') {
    bodyContent += renderCustomerOrdersView();
  }

  bodyContent += renderFooter();

  // Overlay Modals & Mobile Bars
  bodyContent += `
    ${renderCartDrawer()}
    ${renderWishlistDrawer()}
    ${renderMobileNavDrawer()}
    ${renderMobileBottomNav()}
    ${renderQuickViewModal()}
    ${renderAuthModal()}
    ${renderPrivacyPolicyModal()}
    ${renderRazorpayModal()}
  `;

  app.innerHTML = bodyContent;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  bindGlobalEvents();

  if (state.currentView === 'store') {
    startHeroSlider();
  } else {
    if (heroSliderTimer) clearInterval(heroSliderTimer);
  }
}

function bindProductCardEvents() {
  document.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      addToCart(btn.getAttribute('data-id'), 1);
    };
  });

  document.querySelectorAll('[data-action="wishlist"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleWishlist(btn.getAttribute('data-id'));
    };
  });

  document.querySelectorAll('[data-action="quickview"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openProductDetailOrModal(btn.getAttribute('data-id'));
    };
  });

  document.querySelectorAll('.product-thumb-img, .card-title').forEach(el => {
    el.onclick = (e) => {
      const card = el.closest('.product-card');
      if (card) {
        const id = card.getAttribute('data-product-id');
        if (id) openProductDetailOrModal(id);
      }
    };
  });
}

function updateCollectionsGridLive() {
  const countEl = document.querySelector('.items-found-count');
  const activePill = document.querySelector('.search-active-pill');

  let filtered = state.products.filter(p => {
    const matchesCategory = state.selectedCategory === 'all' || p.category === state.selectedCategory;
    const matchesSearch = !state.searchQuery || 
      p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesPrice = p.price <= state.priceFilter;
    const matchesStock = !state.inStockOnly || p.stock > 0;
    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  });

  if (state.sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (state.sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (state.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (state.sortBy === 'newest') filtered.reverse();

  if (countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> creations`;
  if (activePill) {
    activePill.innerHTML = state.searchQuery ? `<span>Showing results for "<strong>${state.searchQuery}</strong>" (${filtered.length} found)</span>` : '';
  }

  const container = document.querySelector('.products-toolbar')?.parentElement;
  if (!container) return;

  let existingGrid = document.querySelector('.products-grid');
  let existingEmpty = document.querySelector('.empty-products-state');

  if (filtered.length === 0) {
    if (existingGrid) existingGrid.remove();
    if (!existingEmpty) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-products-state';
      emptyDiv.innerHTML = `
        <i data-lucide="search-x" style="width:48px;height:48px;color:var(--gold-600);margin-bottom:1rem;"></i>
        <h3>No matching creations found</h3>
        <p>We couldn't find any products matching "<strong>${state.searchQuery}</strong>". Try searching for linen, shirts, belts, watches, or perfumes.</p>
        <button class="btn-primary" id="btn-empty-reset-search" style="margin-top:1.25rem;">View All Collections</button>
      `;
      container.appendChild(emptyDiv);
      const resetBtn = document.getElementById('btn-empty-reset-search');
      if (resetBtn) resetBtn.onclick = () => executeSearch('');
      if (window.lucide) window.lucide.createIcons();
    }
  } else {
    if (existingEmpty) existingEmpty.remove();
    if (!existingGrid) {
      existingGrid = document.createElement('div');
      existingGrid.className = 'products-grid';
      container.appendChild(existingGrid);
    }
    existingGrid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
    if (window.lucide) window.lucide.createIcons();
    bindProductCardEvents();
  }
}

// ============================================================
// EVENT DELEGATION & LISTENERS
// ============================================================
function bindGlobalEvents() {
  bindProductCardEvents();
  // Brand Logo Click -> Return to Home
  const logo = document.getElementById('nav-brand-logo');
  if (logo) {
    logo.onclick = (e) => {
      e.preventDefault();
      state.currentView = 'store';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  // Page Navigation Links (Home, Collections, About, Orders, Profile, Cart, Wishlist)
  document.querySelectorAll('[data-nav-view]').forEach(el => {
    el.onclick = (e) => {
      e.preventDefault();
      const targetView = el.getAttribute('data-nav-view');
      state.isMobileNavOpen = false;
      state.isCartOpen = false;
      state.isWishlistOpen = false;
      state.quickViewProduct = null;
      state.currentView = targetView;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });

  // Quick Bento / Category Clicks
  document.querySelectorAll('[data-quick-cat]').forEach(card => {
    card.onclick = () => {
      const cat = card.getAttribute('data-quick-cat');
      state.isMobileNavOpen = false;
      state.selectedCategory = cat;
      state.currentView = 'collections';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });

  // Category Tab Filter Buttons
  document.querySelectorAll('.category-tab-btn').forEach(btn => {
    btn.onclick = () => {
      state.selectedCategory = btn.getAttribute('data-cat');
      renderApp();
    };
  });

  // Admin Switcher Header Button
  const btnGoAdmin = document.getElementById('btn-header-go-admin');
  if (btnGoAdmin) {
    btnGoAdmin.onclick = () => {
      state.currentView = 'admin';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  // Admin Return Storefront Button (Audio 3 & 4)
  const btnAdminReturn = document.getElementById('btn-admin-return-store');
  if (btnAdminReturn) {
    btnAdminReturn.onclick = () => {
      state.currentView = 'store';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  // Header Search Input & Submit (Audio 1)
  const navSearchInput = document.getElementById('nav-search-input');
  const btnHeaderSearchSubmit = document.getElementById('btn-header-search-submit');
  const btnHeaderSearchClear = document.getElementById('btn-header-search-clear');

  if (navSearchInput) {
    navSearchInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch(navSearchInput.value);
      }
    };
  }

  if (btnHeaderSearchSubmit && navSearchInput) {
    btnHeaderSearchSubmit.onclick = () => {
      executeSearch(navSearchInput.value);
    };
  }

  if (btnHeaderSearchClear) {
    btnHeaderSearchClear.onclick = () => {
      executeSearch('');
    };
  }

  // Collection Page Live Search Input (Audio 1)
  const colSearchInput = document.getElementById('collection-search-input');
  if (colSearchInput) {
    colSearchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      updateCollectionsGridLive();
    };
    colSearchInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        state.searchQuery = colSearchInput.value;
        renderApp();
      }
    };
  }

  const btnClearColSearch = document.getElementById('btn-clear-collection-search');
  if (btnClearColSearch) {
    btnClearColSearch.onclick = () => {
      executeSearch('');
    };
  }

  const btnEmptyReset = document.getElementById('btn-empty-reset-search');
  if (btnEmptyReset) {
    btnEmptyReset.onclick = () => {
      executeSearch('');
    };
  }

  // Hero Slider Events (Audio 2)
  const btnHeroPrev = document.getElementById('btn-hero-prev');
  if (btnHeroPrev) {
    btnHeroPrev.onclick = () => prevHeroSlide();
  }

  const btnHeroNext = document.getElementById('btn-hero-next');
  if (btnHeroNext) {
    btnHeroNext.onclick = () => nextHeroSlide(true);
  }

  document.querySelectorAll('.slider-dot').forEach(dot => {
    dot.onclick = () => {
      const idx = parseInt(dot.getAttribute('data-dot-idx'), 10);
      setHeroSlide(idx);
    };
  });

  // Stock, Price & Sort Filters in Collections
  const stockFilter = document.getElementById('filter-stock-only');
  if (stockFilter) {
    stockFilter.onchange = (e) => {
      state.inStockOnly = e.target.checked;
      renderApp();
    };
  }

  const priceRange = document.getElementById('filter-price-range');
  if (priceRange) {
    priceRange.oninput = (e) => {
      state.priceFilter = parseFloat(e.target.value);
      renderApp();
    };
  }

  const sortSelect = document.getElementById('filter-sort-select');
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      state.sortBy = e.target.value;
      renderApp();
    };
  }

  const btnReset = document.getElementById('btn-reset-filters');
  if (btnReset) {
    btnReset.onclick = () => {
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.priceFilter = 3500;
      state.inStockOnly = false;
      renderApp();
    };
  }

  // Cart Drawer & Page Triggers
  const btnOpenCart = document.getElementById('btn-open-cart');
  if (btnOpenCart) {
    btnOpenCart.onclick = (e) => {
      e.preventDefault();
      openCartView();
    };
  }

  const btnCloseCart = document.getElementById('btn-close-cart');
  if (btnCloseCart) {
    btnCloseCart.onclick = () => {
      state.isCartOpen = false;
      renderApp();
    };
  }

  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  if (cartBackdrop) {
    cartBackdrop.onclick = (e) => {
      if (e.target === cartBackdrop) {
        state.isCartOpen = false;
        renderApp();
      }
    };
  }

  const btnCartContinue = document.getElementById('btn-cart-continue');
  if (btnCartContinue) {
    btnCartContinue.onclick = () => {
      state.isCartOpen = false;
      state.currentView = 'collections';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  // Wishlist Drawer & Page Triggers
  const btnOpenWishlist = document.getElementById('btn-open-wishlist');
  if (btnOpenWishlist) {
    btnOpenWishlist.onclick = (e) => {
      e.preventDefault();
      openWishlistView();
    };
  }

  const footerWishlist = document.getElementById('footer-link-wishlist');
  if (footerWishlist) {
    footerWishlist.onclick = (e) => {
      e.preventDefault();
      openWishlistView();
    };
  }

  const btnCloseWishlist = document.getElementById('btn-close-wishlist');
  if (btnCloseWishlist) {
    btnCloseWishlist.onclick = () => {
      state.isWishlistOpen = false;
      renderApp();
    };
  }

  const wishlistBackdrop = document.getElementById('wishlist-drawer-backdrop');
  if (wishlistBackdrop) {
    wishlistBackdrop.onclick = (e) => {
      if (e.target === wishlistBackdrop) {
        state.isWishlistOpen = false;
        renderApp();
      }
    };
  }

  // Mobile Navigation Drawer Events (Audio Request: 3-line hamburger menu)
  const btnToggleMobileMenu = document.getElementById('btn-mobile-menu-toggle');
  if (btnToggleMobileMenu) {
    btnToggleMobileMenu.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.isMobileNavOpen = true;
      renderApp();
    };
  }

  const btnCloseMobileNav = document.getElementById('btn-close-mobile-nav');
  if (btnCloseMobileNav) {
    btnCloseMobileNav.onclick = () => {
      state.isMobileNavOpen = false;
      renderApp();
    };
  }

  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  if (mobileNavBackdrop) {
    mobileNavBackdrop.onclick = (e) => {
      if (e.target === mobileNavBackdrop) {
        state.isMobileNavOpen = false;
        renderApp();
      }
    };
  }

  const btnMobileNavLogin = document.getElementById('btn-mobile-nav-login');
  if (btnMobileNavLogin) {
    btnMobileNavLogin.onclick = () => {
      state.isMobileNavOpen = false;
      state.isAuthModalOpen = true;
      state.authMode = 'signin';
      renderApp();
    };
  }

  const btnMobileNavWishlist = document.getElementById('btn-mobile-nav-wishlist');
  if (btnMobileNavWishlist) {
    btnMobileNavWishlist.onclick = (e) => {
      e.preventDefault();
      state.isMobileNavOpen = false;
      openWishlistView();
    };
  }

  const btnMobileNavCart = document.getElementById('btn-mobile-nav-cart');
  if (btnMobileNavCart) {
    btnMobileNavCart.onclick = (e) => {
      e.preventDefault();
      state.isMobileNavOpen = false;
      openCartView();
    };
  }

  // Mobile Bottom Navigation Bar Events (Audio Request: Full-screen mobile pages & Home reset)
  const btnMobileBottomProfile = document.getElementById('btn-mobile-bottom-profile');
  if (btnMobileBottomProfile) {
    btnMobileBottomProfile.onclick = () => {
      if (state.currentUser) {
        state.currentView = 'profile';
        state.isMobileNavOpen = false;
        state.isCartOpen = false;
        state.isWishlistOpen = false;
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        state.isAuthModalOpen = true;
        state.authMode = 'signin';
        renderApp();
      }
    };
  }

  const btnMobileBottomWishlist = document.getElementById('btn-mobile-bottom-wishlist');
  if (btnMobileBottomWishlist) {
    btnMobileBottomWishlist.onclick = (e) => {
      e.preventDefault();
      openWishlistView();
    };
  }

  const btnMobileBottomCart = document.getElementById('btn-mobile-bottom-cart');
  if (btnMobileBottomCart) {
    btnMobileBottomCart.onclick = (e) => {
      e.preventDefault();
      openCartView();
    };
  }

  // Mobile Dedicated Cart Page Events
  const btnProceedCheckoutPage = document.getElementById('btn-proceed-checkout-page');
  if (btnProceedCheckoutPage) {
    btnProceedCheckoutPage.onclick = initiateCheckout;
  }

  const btnApplyCouponPage = document.getElementById('btn-apply-cart-coupon-page');
  if (btnApplyCouponPage) {
    btnApplyCouponPage.onclick = () => {
      const inp = document.getElementById('cart-coupon-input-page');
      if (inp && inp.value) applyCoupon(inp.value);
    };
  }

  const btnRemoveCouponPage = document.getElementById('btn-remove-coupon-page');
  if (btnRemoveCouponPage) {
    btnRemoveCouponPage.onclick = removeCoupon;
  }

  document.querySelectorAll('[data-action="wishlist-move-bag"]').forEach(btn => {
    btn.onclick = () => moveToBagFromWishlist(btn.getAttribute('data-id'));
  });

  // Product Add to Bag & Wishlist
  document.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      addToCart(btn.getAttribute('data-id'), 1);
    };
  });

  document.querySelectorAll('[data-action="wishlist"]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleWishlist(btn.getAttribute('data-id'));
    };
  });

  // Product Detail Page Events
  const btnBackCatalog = document.getElementById('btn-back-to-catalog');
  if (btnBackCatalog) {
    btnBackCatalog.onclick = () => {
      state.currentView = 'collections';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  const btnDetailAddCart = document.getElementById('btn-detail-add-cart');
  if (btnDetailAddCart) {
    btnDetailAddCart.onclick = () => {
      const id = btnDetailAddCart.getAttribute('data-id');
      addToCart(id, 1);
    };
  }

  const btnDetailWishlist = document.getElementById('btn-detail-wishlist');
  if (btnDetailWishlist) {
    btnDetailWishlist.onclick = () => {
      const id = btnDetailWishlist.getAttribute('data-id');
      toggleWishlist(id);
      renderApp();
    };
  }

  // Desktop QuickView Center Sheet Modal Events (Audio Request)
  const qvBackdrop = document.getElementById('quick-view-backdrop');
  if (qvBackdrop) {
    qvBackdrop.onclick = (e) => {
      if (e.target === qvBackdrop) {
        closeQuickViewModal();
      }
    };
  }

  const btnCloseQv = document.getElementById('btn-close-quick-view');
  if (btnCloseQv) {
    btnCloseQv.onclick = () => {
      closeQuickViewModal();
    };
  }

  const modalAddCart = document.getElementById('modal-btn-add-cart');
  if (modalAddCart) {
    modalAddCart.onclick = () => {
      const id = modalAddCart.getAttribute('data-id');
      addToCart(id, 1);
    };
  }

  const modalWishlist = document.getElementById('modal-btn-wishlist');
  if (modalWishlist) {
    modalWishlist.onclick = () => {
      const id = modalWishlist.getAttribute('data-id');
      toggleWishlist(id);
      renderApp();
    };
  }

  const btnQvFull = document.getElementById('btn-quickview-view-full');
  if (btnQvFull) {
    btnQvFull.onclick = () => {
      const id = btnQvFull.getAttribute('data-id');
      openProductDetailPage(id);
    };
  }

  if (!window._caprioGlobalKeyBound) {
    window._caprioGlobalKeyBound = true;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.quickViewProduct) {
          closeQuickViewModal();
        } else if (state.isCartOpen) {
          state.isCartOpen = false;
          renderApp();
        } else if (state.isWishlistOpen) {
          state.isWishlistOpen = false;
          renderApp();
        } else if (state.isMobileNavOpen) {
          state.isMobileNavOpen = false;
          renderApp();
        } else if (state.isAuthModalOpen) {
          state.isAuthModalOpen = false;
          renderApp();
        } else if (state.isPrivacyModalOpen) {
          state.isPrivacyModalOpen = false;
          renderApp();
        }
      }
    });
  }

  // Cart Stepper
  document.querySelectorAll('[data-action="qty-plus"]').forEach(btn => {
    btn.onclick = () => updateCartQuantity(btn.getAttribute('data-id'), 1);
  });

  document.querySelectorAll('[data-action="qty-minus"]').forEach(btn => {
    btn.onclick = () => updateCartQuantity(btn.getAttribute('data-id'), -1);
  });

  document.querySelectorAll('[data-action="remove-item"]').forEach(btn => {
    btn.onclick = () => removeFromCart(btn.getAttribute('data-id'));
  });

  // Cart Coupon
  const btnApplyCoupon = document.getElementById('btn-apply-cart-coupon');
  if (btnApplyCoupon) {
    btnApplyCoupon.onclick = () => {
      const inp = document.getElementById('cart-coupon-input');
      if (inp && inp.value) applyCoupon(inp.value);
    };
  }

  const btnRemoveCoup = document.getElementById('btn-remove-coupon');
  if (btnRemoveCoup) {
    btnRemoveCoup.onclick = removeCoupon;
  }

  // Proceed to Checkout
  const btnProceedCheckout = document.getElementById('btn-proceed-checkout');
  if (btnProceedCheckout) {
    btnProceedCheckout.onclick = initiateCheckout;
  }

  // Auth Modal Triggers
  const btnOpenAuth = document.getElementById('btn-open-auth-modal');
  if (btnOpenAuth) {
    btnOpenAuth.onclick = () => {
      state.isAuthModalOpen = true;
      state.authMode = 'signin';
      renderApp();
    };
  }

  const btnCloseAuth = document.getElementById('btn-close-auth-modal');
  if (btnCloseAuth) {
    btnCloseAuth.onclick = () => {
      state.isAuthModalOpen = false;
      renderApp();
    };
  }

  const tabAuthSignIn = document.getElementById('tab-auth-signin');
  if (tabAuthSignIn) {
    tabAuthSignIn.onclick = () => {
      state.authMode = 'signin';
      renderApp();
    };
  }

  const tabAuthSignUp = document.getElementById('tab-auth-signup');
  if (tabAuthSignUp) {
    tabAuthSignUp.onclick = () => {
      state.authMode = 'signup';
      renderApp();
    };
  }

  // Google OAuth
  const btnGoogle = document.getElementById('btn-google-signin');
  if (btnGoogle) {
    btnGoogle.onclick = handleGoogleSignIn;
  }

  // Auth Unified Form (Email/Mobile/Username + Password) (Audio 1 & Audio 5)
  const authForm = document.getElementById('auth-unified-form');
  if (authForm) {
    authForm.onsubmit = (e) => {
      e.preventDefault();
      const pass = document.getElementById('auth-password').value;

      if (state.authMode === 'signin') {
        const id = document.getElementById('auth-identifier').value;
        handleLogin(id, pass);
      } else {
        const name = document.getElementById('auth-name').value;
        const phone = document.getElementById('auth-phone').value;
        const id = document.getElementById('auth-identifier').value;
        handleRegister(name, id, phone, pass);
      }
    };
  }

  // Footer Admin Link
  const footerAdmin = document.getElementById('footer-admin-link');
  if (footerAdmin) {
    footerAdmin.onclick = () => {
      if (state.currentUser?.role === 'admin') {
        state.currentView = 'admin';
        renderApp();
      } else {
        state.isAuthModalOpen = true;
        state.authMode = 'signin';
        renderApp();
      }
    };
  }

  // Profile Form Edit (Audio 1)
  const profileForm = document.getElementById('profile-edit-form');
  if (profileForm) {
    profileForm.onsubmit = (e) => {
      e.preventDefault();
      updateUserProfile({
        name: document.getElementById('prof-name').value,
        phone: document.getElementById('prof-phone').value,
        email: document.getElementById('prof-email').value,
        address: document.getElementById('prof-address').value,
        password: document.getElementById('prof-password').value
      });
    };
  }

  // Profile Logout
  document.querySelectorAll('#btn-logout, #btn-profile-logout').forEach(btn => {
    btn.onclick = handleLogout;
  });

  const btnProfile = document.getElementById('btn-profile-menu');
  if (btnProfile) {
    btnProfile.onclick = () => {
      if (state.currentUser?.role === 'admin') {
        state.currentView = 'admin';
      } else {
        state.currentView = 'profile';
      }
      renderApp();
    };
  }

  // Back to Store Buttons
  document.querySelectorAll('#btn-back-to-store, #btn-success-continue').forEach(btn => {
    btn.onclick = () => {
      state.currentView = 'store';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });

  // Privacy Policy Modal
  // Privacy & Return Policy Modal Triggers
  document.querySelectorAll('#footer-link-privacy, #footer-link-privacy-2, #footer-link-terms, #footer-link-returns, #footer-link-returns-2').forEach(btn => {
    btn.onclick = () => {
      state.isPrivacyModalOpen = true;
      renderApp();
    };
  });

  const btnClosePrivacy = document.getElementById('btn-close-privacy');
  if (btnClosePrivacy) {
    btnClosePrivacy.onclick = () => {
      state.isPrivacyModalOpen = false;
      renderApp();
    };
  }

  const btnAgreePrivacy = document.getElementById('btn-agree-privacy');
  if (btnAgreePrivacy) {
    btnAgreePrivacy.onclick = () => {
      state.isPrivacyModalOpen = false;
      renderApp();
    };
  }

  // Checkout Payment (100% Prepaid Delivery via Razorpay)
  let selectedMethod = 'Razorpay Secure Prepaid (UPI, Cards, NetBanking)';
  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.onclick = () => {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedMethod = card.getAttribute('data-method') || 'Razorpay Secure Prepaid (UPI, Cards, NetBanking)';
    };
  });

  // Checkout Submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.onsubmit = (e) => {
      e.preventDefault();
      submitOrder({
        fullName: document.getElementById('ship-name').value,
        phone: document.getElementById('ship-phone').value,
        street: document.getElementById('ship-street').value,
        city: document.getElementById('ship-city').value,
        state: 'Kerala',
        zip: document.getElementById('ship-zip').value,
        paymentMethod: selectedMethod
      });
    };
  }

  // Razorpay Modal Events
  const btnCloseRazorpay = document.getElementById('btn-close-razorpay');
  if (btnCloseRazorpay) {
    btnCloseRazorpay.onclick = () => {
      state.isRazorpayModalOpen = false;
      state.pendingRazorpayOrder = null;
      renderApp();
    };
  }

  const btnConfirmRazorpay = document.getElementById('btn-confirm-razorpay');
  if (btnConfirmRazorpay) {
    btnConfirmRazorpay.onclick = () => {
      if (state.pendingRazorpayOrder) {
        showToast('Razorpay payment verified!', 'success');
        finalizeOrder(state.pendingRazorpayOrder);
      }
    };
  }

  document.querySelectorAll('#btn-pay-upi, #btn-pay-card').forEach(btn => {
    btn.onclick = () => {
      if (state.pendingRazorpayOrder) {
        showToast('Processing Razorpay transaction...', 'info');
        setTimeout(() => finalizeOrder(state.pendingRazorpayOrder), 600);
      }
    };
  });

  // Admin Navigation Tabs
  document.querySelectorAll('[data-admin-tab]').forEach(tabBtn => {
    tabBtn.onclick = () => {
      state.adminTab = tabBtn.getAttribute('data-admin-tab');
      renderApp();
    };
  });

  // Admin Add / Edit Product
  document.querySelectorAll('#btn-admin-add-product-open, #btn-admin-add-product-open-2').forEach(btn => {
    btn.onclick = () => {
      state.editingProduct = null;
      state.isAddProductModalOpen = true;
      renderApp();
    };
  });

  const btnCloseProdModal = document.getElementById('btn-close-product-modal');
  if (btnCloseProdModal) {
    btnCloseProdModal.onclick = () => {
      state.isAddProductModalOpen = false;
      state.editingProduct = null;
      renderApp();
    };
  }

  const btnCancelProdModal = document.getElementById('btn-cancel-product-modal');
  if (btnCancelProdModal) {
    btnCancelProdModal.onclick = () => {
      state.isAddProductModalOpen = false;
      state.editingProduct = null;
      renderApp();
    };
  }

  const adminProdForm = document.getElementById('admin-product-form');
  if (adminProdForm) {
    adminProdForm.onsubmit = (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: document.getElementById('prod-price').value,
        originalPrice: document.getElementById('prod-original-price').value,
        stock: document.getElementById('prod-stock').value,
        badge: document.getElementById('prod-badge').value,
        image: document.getElementById('prod-image').value,
        description: document.getElementById('prod-desc').value
      };

      if (state.editingProduct) {
        adminUpdateProduct(state.editingProduct.id, payload);
      } else {
        adminAddProduct(payload);
      }
    };
  }

  document.querySelectorAll('[data-action="save-stock"]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const input = document.querySelector(`[data-inline-stock-id="${id}"]`);
      if (input) {
        const newStock = parseInt(input.value, 10);
        const prod = state.products.find(p => p.id === id);
        if (prod && !isNaN(newStock) && newStock >= 0) {
          prod.stock = newStock;
          saveStorage(STORAGE_KEYS.PRODUCTS, state.products);
          showToast(`Stock updated to ${newStock} for "${prod.name}"`, 'success');
          renderApp();
        }
      }
    };
  });

  document.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
    btn.onclick = () => {
      state.editingProduct = state.products.find(p => p.id === btn.getAttribute('data-id'));
      state.isAddProductModalOpen = false;
      renderApp();
    };
  });

  document.querySelectorAll('[data-action="delete-product"]').forEach(btn => {
    btn.onclick = () => adminDeleteProduct(btn.getAttribute('data-id'));
  });

  // Admin Coupon
  document.querySelectorAll('#btn-admin-add-coupon-open, #btn-admin-add-coupon-open-2').forEach(btn => {
    btn.onclick = () => {
      state.isAddCouponModalOpen = true;
      renderApp();
    };
  });

  const btnCloseCouponModal = document.getElementById('btn-close-coupon-modal');
  if (btnCloseCouponModal) {
    btnCloseCouponModal.onclick = () => {
      state.isAddCouponModalOpen = false;
      renderApp();
    };
  }

  const btnCancelCouponModal = document.getElementById('btn-cancel-coupon-modal');
  if (btnCancelCouponModal) {
    btnCancelCouponModal.onclick = () => {
      state.isAddCouponModalOpen = false;
      renderApp();
    };
  }

  const adminCouponForm = document.getElementById('admin-coupon-form');
  if (adminCouponForm) {
    adminCouponForm.onsubmit = (e) => {
      e.preventDefault();
      adminAddCoupon({
        code: document.getElementById('coup-code').value,
        type: document.getElementById('coup-type').value,
        value: document.getElementById('coup-value').value,
        minSpend: document.getElementById('coup-min-spend').value,
        expiresAt: document.getElementById('coup-expiry').value,
        description: document.getElementById('coup-desc').value
      });
    };
  }

  document.querySelectorAll('[data-action="toggle-coupon"]').forEach(btn => {
    btn.onclick = () => adminToggleCoupon(btn.getAttribute('data-id'));
  });

  document.querySelectorAll('[data-action="delete-coupon"]').forEach(btn => {
    btn.onclick = () => adminDeleteCoupon(btn.getAttribute('data-id'));
  });

  document.querySelectorAll('[data-action="change-order-status"]').forEach(select => {
    select.onchange = () => {
      adminUpdateOrderStatus(select.getAttribute('data-order-id'), select.value);
    };
  });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
renderApp();
