document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartButton = document.querySelector('.cart-btn');
    const allAddToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-lg');

    // Update the cart button text on load (in case of cached cart)
    function updateCartDisplay() {
        cartButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cartCount})`;
    }

    // Add to Cart Functionality
    allAddToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            updateCartDisplay();
            
            // Simple visual confirmation
            button.textContent = 'Added!';
            setTimeout(() => {
                if(button.classList.contains('add-to-cart')) {
                    button.textContent = 'Add to Cart';
                } else {
                     button.textContent = 'Add to Cart'; // For the larger button
                }
            }, 1000);

            alert('Item successfully added to your cart!');
        });
    });

    updateCartDisplay();
});
