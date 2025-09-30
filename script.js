document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartButton = document.querySelector('.cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Quick View Modal elements
    const modal = document.getElementById('quick-view-modal');
    const closeBtn = document.querySelector('.close-btn');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const modalBody = document.querySelector('.modal-body');

    // 1. Add to Cart Functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            // Update cart display (showing icon and count)
            cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cartCount})`;
            
            // Notification (can be replaced with a better toast/popup)
            button.textContent = 'Added!';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
            }, 1000);
        });
    });

    // 2. Quick View Modal Functionality
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Placeholder: Yahan aap AJAX se product details fetch kar sakte hain
            const productCard = e.target.closest('.product-card');
            const title = productCard.querySelector('.product-title').textContent;
            const price = productCard.querySelector('.current-price').textContent;
            const imgSrc = productCard.querySelector('.product-img').src;

            // Load content into modal
            modalBody.innerHTML = `
                <div style="display: flex; gap: 20px; align-items: center;">
                    <img src="${imgSrc}" alt="${title}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <h3>${title}</h3>
                        <p style="font-size: 1.5em; color: #b12704; font-weight: bold;">${price}</p>
                        <p>Availability: <span style="color: green;">In Stock</span></p>
                        <p style="margin-top: 10px;">Quick details: High quality, durable, recommended age 3+.</p>
                        <button class="add-to-cart-modal" style="background: #ff9900; padding: 10px; border: none; border-radius: 4px; margin-top: 15px; cursor: pointer;">Add to Cart</button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';

            // Modal specific 'Add to Cart'
            document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
                cartCount++;
                cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cartCount})`;
                alert(`${title} added to cart!`);
                modal.style.display = 'none';
            });
        });
    });

    // Close modal when user clicks on (x)
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
