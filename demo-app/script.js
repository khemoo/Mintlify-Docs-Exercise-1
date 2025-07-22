// Global state
let currentUser = null;
let cart = [];
let products = [
    {
        id: 1,
        name: "MacBook Pro 16\"",
        price: 2499.99,
        category: "laptop",
        description: "Powerful laptop for professionals",
        image: "💻"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        price: 999.99,
        category: "phone",
        description: "Latest smartphone with advanced features",
        image: "📱"
    },
    {
        id: 3,
        name: "AirPods Pro",
        price: 249.99,
        category: "accessory",
        description: "Wireless earbuds with noise cancellation",
        image: "🎧"
    },
    {
        id: 4,
        name: "iPad Air",
        price: 599.99,
        category: "tablet",
        description: "Versatile tablet for work and play",
        image: "📱"
    },
    {
        id: 5,
        name: "Dell XPS 13",
        price: 1299.99,
        category: "laptop",
        description: "Compact and powerful ultrabook",
        image: "💻"
    },
    {
        id: 6,
        name: "Samsung Galaxy S24",
        price: 899.99,
        category: "phone",
        description: "Android flagship with great camera",
        image: "📱"
    },
    {
        id: 7,
        name: "Magic Mouse",
        price: 79.99,
        category: "accessory",
        description: "Wireless mouse with multi-touch surface",
        image: "🖱️"
    },
    {
        id: 8,
        name: "Surface Laptop 5",
        price: 1599.99,
        category: "laptop",
        description: "Microsoft's premium laptop",
        image: "💻"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartDisplay();
    updateAuthDisplay();
    
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthDisplay();
    }
    
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
});

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Special handling for checkout section
    if (sectionId === 'checkout') {
        populateCheckout();
    }
}

// Product functions
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredProducts(filteredProducts);
}

function filterProducts() {
    searchProducts(); // Reuse the search logic
}

function displayFilteredProducts(filteredProducts) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found matching your criteria.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showMessage(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartSection();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartDisplay();
        updateCartSection();
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    updateCartSection();
}

function updateCartSection() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        checkoutBtn.disabled = true;
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>Qty: ${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    checkoutBtn.disabled = false;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate login validation
    if (email && password) {
        // For demo purposes, accept any email/password combination
        // In real app, this would validate against a backend
        
        if (password.length < 3) {
            showMessage('Password must be at least 3 characters long', 'error');
            return;
        }
        
        currentUser = {
            email: email,
            name: email.split('@')[0], // Use email prefix as name
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthDisplay();
        showMessage('Login successful!', 'success');
        showSection('home');
    } else {
        showMessage('Please fill in all fields', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const phone = document.getElementById('reg-phone').value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showMessage('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Simulate registration
    currentUser = {
        name: name,
        email: email,
        phone: phone,
        registrationTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthDisplay();
    showMessage('Account created successfully!', 'success');
    showSection('home');
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    // Simulate sending reset email
    showMessage('Password reset link sent to your email!', 'success');
    setTimeout(() => {
        showSection('login');
    }, 2000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthDisplay();
    showMessage('Logged out successfully!', 'success');
    showSection('home');
}

function updateAuthDisplay() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userGreeting = document.getElementById('user-greeting');
    const username = document.getElementById('username');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userGreeting.style.display = 'inline';
        username.textContent = currentUser.name || currentUser.email;
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        userGreeting.style.display = 'none';
    }
}

// Checkout functions
function populateCheckout() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        showSection('cart');
        return;
    }
    
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.style.cssText = 'display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;';
        checkoutItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });
    
    checkoutTotal.textContent = total.toFixed(2);
    
    // Pre-fill user information if logged in
    if (currentUser) {
        document.getElementById('billing-name').value = currentUser.name || '';
        document.getElementById('billing-email').value = currentUser.email || '';
    }
}

function toggleShippingFields() {
    const sameAsBilling = document.getElementById('same-as-billing').checked;
    const shippingFields = document.getElementById('shipping-fields');
    const shippingInputs = shippingFields.querySelectorAll('input, select');
    
    if (sameAsBilling) {
        shippingFields.style.opacity = '0.5';
        shippingInputs.forEach(input => {
            input.disabled = true;
            input.removeAttribute('required');
        });
    } else {
        shippingFields.style.opacity = '1';
        shippingInputs.forEach(input => {
            input.disabled = false;
            if (input.id !== 'shipping-zip') {
                input.setAttribute('required', 'required');
            }
        });
    }
}

function handleCheckout(event) {
    event.preventDefault();
    
    // Validate required fields
    const requiredFields = [
        'billing-name', 'billing-email', 'billing-address', 'billing-city', 'billing-state', 'billing-zip',
        'card-number', 'expiry-date', 'cvv', 'cardholder-name'
    ];
    
    const sameAsBilling = document.getElementById('same-as-billing').checked;
    if (!sameAsBilling) {
        requiredFields.push('shipping-name', 'shipping-address', 'shipping-city', 'shipping-state', 'shipping-zip');
    }
    
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showMessage(`Please fill in the ${fieldId.replace('-', ' ')} field`, 'error');
            field.focus();
            return;
        }
    }
    
    // Validate card number (simple check)
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        showMessage('Please enter a valid card number', 'error');
        return;
    }
    
    // Validate expiry date
    const expiryDate = document.getElementById('expiry-date').value;
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showMessage('Please enter expiry date in MM/YY format', 'error');
        return;
    }
    
    // Validate CVV
    const cvv = document.getElementById('cvv').value;
    if (!/^\d{3,4}$/.test(cvv)) {
        showMessage('Please enter a valid CVV', 'error');
        return;
    }
    
    // Simulate payment processing
    showMessage('Processing payment...', 'success');
    
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'ORD-' + Date.now();
        document.getElementById('order-number').textContent = orderNumber;
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartDisplay();
        
        // Show confirmation
        showSection('order-confirmation');
        showMessage('Order placed successfully!', 'success');
    }, 2000);
}

// Contact form
function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !subject || !message) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate sending message
    showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
    document.getElementById('contact-form').reset();
}

// Utility functions
function showMessage(text, type) {
    const messageId = type === 'success' ? 'success-message' : 'error-message';
    const textId = type === 'success' ? 'success-text' : 'error-text';
    
    document.getElementById(textId).textContent = text;
    document.getElementById(messageId).style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideMessage(messageId);
    }, 5000);
}

function hideMessage(messageId) {
    document.getElementById(messageId).style.display = 'none';
}

// Add some demo data and behaviors for testing
function addDemoData() {
    // Add some items to cart for testing
    addToCart(1);
    addToCart(2);
}

// Simulate some realistic behaviors for testing
function simulateSlowLoading() {
    // Simulate slow product loading
    setTimeout(() => {
        loadProducts();
    }, 1000);
}

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close any open modals or go back to home
        showSection('home');
    }
});

// Add form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Add some error scenarios for testing
function triggerError() {
    throw new Error('This is a test error for QA.tech to detect');
}

// Add console logging for testing
console.log('TechStore Demo App initialized');
console.log('Available products:', products.length);

// Add some accessibility improvements
function addAccessibilityFeatures() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add focus management
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.setAttribute('tabindex', '-1');
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', addAccessibilityFeatures);