document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartButton = document.querySelector('.cart-btn');
    // We select all possible 'add to cart' buttons across all pages
    const allAddToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-lg');

    function updateCartDisplay() {
        cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cartCount})`;
    }

    // Cart Functionality
    function initializeCartListeners() {
        // We need to re-select buttons because they are added dynamically
        document.querySelectorAll('.add-to-cart, .add-to-cart-lg').forEach(button => {
            // Remove previous listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
        });

        document.querySelectorAll('.add-to-cart, .add-to-cart-lg').forEach(button => {
            button.addEventListener('click', () => {
                if (button.disabled) return; // Agar Out of Stock hai to kuch na kare

                cartCount++;
                updateCartDisplay();
                
                // Simple visual confirmation
                const originalText = button.textContent;
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);

                alert('Item successfully added to your cart!');
            });
        });
    }

    // Function to generate Star Rating HTML
    function getStarRatingHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>'; // Filled star
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>'; // Half star
            } else {
                stars += '<i class="far fa-star"></i>'; // Empty star
            }
        }
        return stars;
    }


    // === Product Listing Logic (for listing.html) ===
    function renderProductCards(products) {
        const container = document.getElementById('product-list-container');
        if (!container) return; 

        container.innerHTML = ''; 

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
        
        // Dynamic elements banne ke baad, listeners ko dobara initialize karein
        initializeCartListeners();
    }


    // === Product Detail Page Logic (for product.html) ===
    function renderProductDetails() {
        if (!document.querySelector('.product-detail')) return;

        // 1. Get Product ID from the URL (e.g., product.html?id=2)
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1; 

        // 2. Find the product in our data
        // NOTE: toyProducts variable data.js se aayega
        const product = toyProducts.find(p => p.id === productId);

        if (product) {
            // 3. Update the page content dynamically
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

            // Update Add to Cart button
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
            
             // Re-initialize cart listeners for the large button
             initializeCartListeners(); 
             
        } else {
            document.querySelector('main').innerHTML = '<h2 style="text-align:center; padding: 50px;">Product Not Found!</h2>';
        }
    }
    
    // --- Initial Load Checks ---
    updateCartDisplay();
    
    // Check which page we are on and run the correct function
    if (document.getElementById('product-list-container')) {
        renderProductCards(toyProducts); 
    } else if (document.querySelector('.product-detail')) {
        renderProductDetails();
    } else {
        // If on index.html, initialize cart listeners for static cards
        initializeCartListeners();
    }
});
