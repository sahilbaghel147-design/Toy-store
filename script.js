document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartButton = document.querySelector('.cart-btn');
    
    // Global function to manage star rating HTML
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

    // --- Cart Functionality (Used across all pages) ---
    function updateCartDisplay() {
        cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cartCount})`;
    }
    
    // Add to Cart Listeners ko initialize/re-initialize karta hai
    function initializeCartListeners() {
        // Purane listeners hatane ke liye
        document.querySelectorAll('.add-to-cart, .add-to-cart-lg').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll('.add-to-cart, .add-to-cart-lg').forEach(button => {
            button.addEventListener('click', () => {
                if (button.disabled) return;

                cartCount++;
                updateCartDisplay();
                
                const originalText = button.textContent;
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);

                alert('Item successfully added to your cart!');
            });
        });
    }

    // --- Product Card Rendering Logic ---
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
        
        initializeCartListeners(); // Naye cards ke liye listeners lagayein
    }

    // --- NEW: Search, Filter, and Sort Master Function ---
    function filterAndRenderProducts() {
        if (!window.toyProducts) return; // Make sure data is loaded

        let filteredProducts = [...toyProducts]; // Ek copy banaein data ki

        // 1. **SEARCH Filter**
        const searchTerm = document.getElementById('search-input-listing')?.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // 2. **AGE & PRICE Filters** (Basic checkbox logic)
        const checkedAges = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]'))
            .filter(checkbox => checkbox.checked && checkbox.parentElement.parentElement.querySelector('h4').textContent.includes('Age'))
            .map(checkbox => checkbox.parentElement.textContent.trim());
        
        // Agar koi age filter selected hai toh products ko filter karein
        if (checkedAges.length > 0) {
            filteredProducts = filteredProducts.filter(product => checkedAges.includes(product.age));
        }
        
        // **********************************************
        // NOTE: Aap yahan Price, Brand, aur anya filters jodd sakte hain.
        // **********************************************


        // 3. **SORTING**
        const sortBy = document.getElementById('sort')?.value;

        filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':
                    return a.price - b.price; // Low to High
                case 'rating_desc':
                    return b.rating - a.rating; // High to Low
                case 'new':
                default:
                    return b.id - a.id; // Naye products pehle
            }
        });

        // 4. Render the final list
        renderProductCards(filteredProducts);
    }
    
    // --- Product Detail Page Logic (from previous step) ---
    function renderProductDetails() {
        if (!document.querySelector('.product-detail')) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1; 

        // NOTE: toyProducts variable data.js se aayega
        const product = window.toyProducts.find(p => p.id === productId);

        if (product) {
            document.title = `${product.title} - Product Details | ToyMart`;
            document.querySelector('.detail-info h2').textContent = product.title;
            
            // ... (baki detail page update logic) ...
            
            // Ye wala code product.html mein bhi update karna hoga
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

        // Attach event listeners for filtering
        const sidebar = document.querySelector('.sidebar');
        const sortDropdown = document.getElementById('sort');

        // Sidebar filters aur Apply button par listener
        sidebar.addEventListener('change', filterAndRenderProducts);
        sidebar.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.preventDefault();
            filterAndRenderProducts();
        });
        
        // Sorting dropdown par listener
        sortDropdown.addEventListener('change', filterAndRenderProducts);
        
        // Search bar (Global Header ka search bar) par listener
        const globalSearchInput = document.querySelector('.search-bar input');
        globalSearchInput.setAttribute('id', 'search-input-listing'); // ID assign karein
        globalSearchInput.addEventListener('keyup', filterAndRenderProducts);
        document.querySelector('.search-bar button').addEventListener('click', filterAndRenderProducts);

    } else if (document.querySelector('.product-detail')) {
        renderProductDetails();
    } else {
        // Index page par cart listeners
        initializeCartListeners();
    }
});
