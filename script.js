document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartButton = document.querySelector('.cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Cart mein item jodne ka function
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            cartButton.textContent = `Cart (${cartCount})`;
            alert('Item successfully added to cart!');
            // Yahan aur functionality jodi ja sakti hai, jaise ki item ko local storage mein save karna.
        });
    });

    // Aap yahan aur bhi interactive functionality jodd sakte hain
});
