document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global Storage Functions ---
    
    function getCart() {
        const cartJson = localStorage.getItem('toyMartCart');
        return cartJson ? JSON.parse(cartJson) : [];
    }
    function saveCart(cart) {
        localStorage.setItem('toyMartCart', JSON.stringify(cart));
    }
    
    // NEW: User list ko Local Storage se fetch karta hai
    function getUsers() {
        const usersJson = localStorage.getItem('toyMartUsers');
        return usersJson ? JSON.parse(usersJson) : [];
    }

    // NEW: User list ko Local Storage mein save karta hai
    function saveUsers(users) {
        localStorage.setItem('toyMartUsers', JSON.stringify(users));
    }

    // NEW: Check karta hai ki koi user logged in hai ya nahi
    function getLoggedInUser() {
        return localStorage.getItem('loggedInUser');
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

    // --- Header UI Update ---
    // NEW: Header mein Login/Signup button ko "Hello, User!" se replace karta hai
    function updateAuthHeader() {
        const userLink = document.querySelector('.user-auth-link');
        const loggedInEmail = getLoggedInUser();

        if (userLink) {
            if (loggedInEmail) {
                userLink.innerHTML = `<i class="fas fa-user"></i> Hello, ${loggedInEmail.split('@')[0]}!`;
                userLink.href = "#"; // Ya Account page ka link
                
                // Logout button jodein
                const logoutBtn = document.createElement('a');
                logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
                logoutBtn.href = "#";
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('loggedInUser');
                    updateAuthHeader();
                    alert("Logged out successfully!");
                    window.location.href = 'index.html';
                });
                
                // Agar Logout button pehle se maujood nahi hai toh jodein
                if (!document.querySelector('.nav-icons a[href="#"]:last-child').textContent.includes('Logout')) {
                    userLink.parentNode.insertBefore(logoutBtn, userLink.nextSibling);
                }
                
            } else {
                userLink.innerHTML = `<i class="fas fa-user"></i> Login`;
                userLink.href = "login.html";
                
                // Logout button ko hatayein agar woh maujood hai
                const existingLogout = document.querySelector('.nav-icons a[href="#"]:last-child');
                if (existingLogout && existingLogout.textContent.includes('Logout')) {
                    existingLogout.remove();
                }
            }
        }
    }
    
    // --- Authentication Functions ---
    
    function handleSignup() {
        const form = document.getElementById('signup-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            const users = getUsers();
            if (users.find(u => u.email === email)) {
                alert("Account with this email already exists!");
                return;
            }

            // Password ko bina hash kiye store kar rahe hain (Real-world mein hashing zaroori hai!)
            users.push({ name, email, password }); 
            saveUsers(users);
            
            alert("Account created successfully! Please log in.");
            window.location.href = 'login.html';
        });
    }

    function handleLogin() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', user.email);
                updateAuthHeader();
                alert("Login successful! Welcome back.");
                window.location.href = 'index.html'; 
            } else {
                alert("Invalid email or password.");
            }
        });
    }

    // --- Cart & Product Logic (Abhi ke liye yahan sirf references hain) ---
    // (Pichle steps ke saare functions jaise filterAndRenderProducts, renderCartPage, etc. yahan hone chahiye)
    
    // Main load function ke andar
    
    // ... (rest of the cart, filter, render functions from the previous step) ...
    // ... [Note: Baki pichle step ka script.js code yahan aana chahiye] ...
    
    // *** Aapko pichle step ke saare cart/filter/render functions yahan neeche jodne honge! ***
    // *** Kyunki pichle jawab mein unka pura code diya ja chuka hai, main unhe yahan nahi de raha ***
    // *** Magar aapko yeh zaroor confirm karna hai ki aapke script.js mein woh saare functions hain. ***
    
    // --- Initial Load Checks and Event Setup ---
    updateCartDisplay();
    updateAuthHeader(); // NEW: Header ko check karein
    
    // Handle specific page logic
    if (document.getElementById('signup-form')) {
        handleSignup();
    } else if (document.getElementById('login-form')) {
        handleLogin();
    }
    
    // ... (rest of the page logic like filterAndRenderProducts check from previous step) ...
    
    // Example: Agar aap listing page par hain
    if (document.getElementById('product-list-container')) {
        // filterAndRenderProducts() aur uske listeners yahan honge
    } 
    // Example: Agar aap cart page par hain
    else if (document.getElementById('cart-content-area')) {
        // renderCartPage() yahan hoga
    } 
    // Example: Agar aap product page par hain
    else if (document.querySelector('.product-detail')) {
        // renderProductDetails() yahan hoga
    } 
    else {
        initializeCartListeners();
    }
});
