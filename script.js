document.addEventListener('DOMContentLoaded', () => {
    
    // Function to initialize cart from Local Storage or return an empty array
    function getCart() {
        const cartJson = localStorage.getItem('toyMartCart');
        return cartJson ? JSON.parse(cartJson) : [];
    }

    // Function to save cart to Local Storage
    function saveCart(cart) {
        localStorage.setItem('toyMartCart', JSON.stringify(cart));
    }

    // --- Global Cart State and Initialization ---
    let cart = getCart();
    const cartButton = document.querySelector('.cart-btn');

    // Function to generate Star Rating HTML (copied from previous step)
    function getStarRatingHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // --- Cart Display and Main Logic ---

    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${totalItems})`;
    }

    // Function to handle Add to Cart logic
    function addToCart(productId) {
        const product_id = parseInt(productId);
        const existingItem = cart.find(item => item.id === product_id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: product_id, quantity: 1 });
        }
        
        saveCart(cart);
        updateCartDisplay();
    }
    
    // Function to remove an item from cart
    function removeFromCart(productId) {
        const product_id = parseInt(productId);
        cart = cart.filter(item => item.id !== product_id);
        saveCart(cart);
        updateCartDisplay();
        renderCartPage(); // Agar cart page par hain to dobara render karein
    }
    
    // Function to update item quantity
    function updateQuantity(productId, newQuantity) {
        const product_id = parseInt(productId);
        const item = cart.find(item => item.id === product_id);
        
        const quantity = parseInt(newQuantity);
        
        if (item && quantity > 0 && quantity < 100) {
            item.quantity = quantity;
        } else if (item && quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        saveCart(cart);
        updateCartDisplay();
        if (document.getElementById('cart-content-area')) {
            renderCartPage(); // Cart totals ko update karein
        }
    }


    // Add to Cart Listeners (Ab yeh naye 'addToCart' function ko call karega)
    function initializeCartListeners() {
        document.querySelectorAll('.add-to-cart, .add-to-cart-lg').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll('.add-to-cart, .add-to-cart-lg').forEach(button => {
            button.addEventListener('click', () => {
                if (button.disabled) return;
                
                const productId = button.getAttribute('data-id');
                addToCart(productId);

                // Visual confirmation
                const originalText = button.textContent;
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);

                alert('Item successfully added to your cart!');
            });
        });
    }

    // --- NEW: Cart Page Rendering ---
    function renderCartPage() {
        const cartArea = document.getElementById('cart-content-area');
        if (!cartArea) return;

        if (cart.length === 0) {
            cartArea.innerHTML = `
                <div class="empty-cart-message">
                    <h3>Your cart is empty!</h3>
                    <p>It looks like you haven't added any toys yet.</p>
                    <a href="listing.html">Start Shopping Now</a>
                </div>
            `;
            return;
        }

        let totalSubtotal = 0;
        let itemsHtml = '';

        cart.forEach(cartItem => {
            const product = window.toyProducts.find(p => p.id === cartItem.id);
            if (!product) return; // Agar product data mein nahi mila

            const itemTotal = product.price * cartItem.quantity;
            totalSubtotal += itemTotal;
            
            itemsHtml += `
                <div class="cart-item" data-id="${product.id}">
                    <div class="item-image">
                        <img src="${product.image.split(',')[0]}" alt="${product.title}">
                    </div>
                    <div class="item-details">
                        <h4><a href="product.html?id=${product.id}">${product.title}</a></h4>
                        <div class="item-quantity">
                            <label for="qty-${product.id}">Qty:</label>
                            <input type="number" id="qty-${product.id}" class="quantity-input" value="${cartItem.quantity}" min="1" max="99" data-id="${product.id}">
                        </div>
                        <span class="remove-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Remove</span>
                    </div>
                    <div class="item-price">
                        ₹ ${itemTotal.toLocaleString('en-IN')}
                    </div>
                </div>
            `;
        });
        
        // --- Summary Calculation ---
        const shipping = totalSubtotal < 1000 ? 100 : 0;
        const totalPayable = totalSubtotal + shipping;

        const summaryHtml = `
            <div class="cart-items-section">
                <h3>Items (${cart.length})</h3>
                <div id="cart-items-list">
                    ${itemsHtml}
                </div>
            </div>
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="summary-row"><span>Subtotal:</span><span>₹ ${totalSubtotal.toLocaleString('en-IN')}</span></div>
                <div class="summary-row"><span>Shipping:</span><span>${shipping > 0 ? `₹ ${shipping}` : 'FREE'}</span></div>
                <div class="summary-row" style="font-size: 1.3em; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">
                    <span>Total:</span><span>₹ ${totalPayable.toLocaleString('en-IN')}</span>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;

        cartArea.innerHTML = summaryHtml;
        
        // --- Attach Cart Page Event Listeners ---
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                removeFromCart(e.currentTarget.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                updateQuantity(e.target.getAttribute('data-id'), e.target.value);
            });
        });
        
        document.querySelector('.checkout-btn').addEventListener('click', () => {
             alert("Thank you for your order! Checkout functionality is under development.");
        });

    }
    
    // --- Listing/Search/Detail Logic (Copied from previous step) ---
    
    function filterAndRenderProducts() {
        if (!window.toyProducts) return; 

        let filteredProducts = [...toyProducts]; 

        // 1. **SEARCH Filter**
        const searchTerm = document.getElementById('search-input-listing')?.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // 2. **AGE & PRICE Filters**
        const checkedAges = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]'))
            .filter(checkbox => checkbox.checked && checkbox.parentElement.parentElement.querySelector('h4').textContent.includes('Age'))
            .map(checkbox => checkbox.parentElement.textContent.trim());
        
        if (checkedAges.length > 0) {
            filteredProducts = filteredProducts.filter(product => checkedAges.includes(product.age));
        }

        // 3. **SORTING**
        const sortBy = document.getElementById('sort')?.value;

        filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':
                    return a.price - b.price; 
                case 'rating_desc':
                    return b.rating - a.rating; 
                case 'new':
                default:
                    return b.id - a.id;
            }
        });

        renderProductCards(filteredProducts);
    }
    
    function renderProductCards(products) {
        const container = document.getElementById('product-list-container');
        if (!container) return; 

        container.innerHTML = ''; 

        if (products.length === 0) {
            container.innerHTML = '<h3 style="width: 100%; text-align: center; margin: 50px 0;">Koi khilone nahi mile, kripya filters badlein.</h3>';
            return;
        }

        products.forEach(product => {
            const imageSrc = product.image.split(',')[0];
            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            
            const cardHTML = `
                <div class="product-card">
                    <img src="${imageSrc}" alt="${product.title}" class="product-img">
                    <div class="card-details">
                        <a href="product.html?id=${product.id}" class="product-title">${product.title}</a>
                        <div class="rating">
                            ${getStarRatingHTML(product.rating)} (${product.rating})
                        </div>
                        <span class="current-price">₹ ${product.price}</span>
                        <span class="original-price">₹ ${product.mrp}</span>
                        <p style="font-size:0.9em; color: ${discount > 0 ? 'green' : '#666'}; margin-top: 5px;">
                            ${discount > 0 ? `${discount}% OFF` : 'Best Price'}
                        </p>
                        
                        <button class="add-to-cart" data-id="${product.id}" ${product.stock ? '' : 'disabled'} style="${product.stock ? '' : 'background: #ccc; cursor: not-allowed;'}">
                            ${product.stock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
        
        initializeCartListeners(); 
    }
    
    function renderProductDetails() {
        if (!document.querySelector('.product-detail')) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1; 

        const product = window.toyProducts.find(p => p.id === productId);

        if (product) {
            document.title = `${product.title} - Product Details | ToyMart`;
            document.querySelector('.detail-info h2').textContent = product.title;
            
            document.querySelector('.detail-price').innerHTML = 
                `₹ ${product.price} <span class="price-small"> (M.R.P.: ₹ ${product.mrp})</span>`;
            document.querySelector('.detail-info .rating').innerHTML = 
                `${getStarRatingHTML(product.rating)} (${product.rating} | ${product.reviews.toLocaleString()} Reviews)`;
            
            document.querySelector('.stock-status').textContent = 
                product.stock ? 'In Stock. Ships in 1-2 days.' : 'Out of Stock.';
            document.querySelector('.stock-status').style.color = 
                product.stock ? 'green' : 'red';

            document.querySelector('.main-image').src = product.image.split(',')[0];
            document.querySelector('.product-description p').textContent = product.description;

            const addToCartBtn = document.querySelector('.add-to-cart-lg');
            addToCartBtn.setAttribute('data-id', product.id);
            if (!product.stock) {
                addToCartBtn.textContent = 'Out of Stock';
                addToCartBtn.style.background = '#ccc';
                addToCartBtn.disabled = true;
            } else {
                 addToCartBtn.textContent = 'Add to Cart';
                 addToCartBtn.style.background = '#ff9900';
                 addToCartBtn.disabled = false;
            }
            initializeCartListeners(); 
             
        } else {
            document.querySelector('main').innerHTML = '<h2 style="text-align:center; padding: 50px;">Product Not Found!</h2>';
        }
    }
    
    // --- Initial Load Checks and Event Setup ---
    updateCartDisplay();
    
    if (document.getElementById('product-list-container')) {
        // Listing Page Setup
        filterAndRenderProducts(); 

        const sidebar = document.querySelector('.sidebar');
        const sortDropdown = document.getElementById('sort');

        sidebar.addEventListener('change', filterAndRenderProducts);
        sidebar.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.preventDefault();
            filterAndRenderProducts();
        });
        
        sortDropdown.addEventListener('change', filterAndRenderProducts);
        
        const globalSearchInput = document.querySelector('.search-bar input');
        globalSearchInput.setAttribute('id', 'search-input-listing'); 
        globalSearchInput.addEventListener('keyup', filterAndRenderProducts);
        document.querySelector('.search-bar button').addEventListener('click', filterAndRenderProducts);

    } else if (document.querySelector('.product-detail')) {
        renderProductDetails();
    } else if (document.getElementById('cart-content-area')) {
        // Cart Page Setup
        renderCartPage();
    } else {
        // Index page par cart listeners
        initializeCartListeners();
    }
});
                
