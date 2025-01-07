// Backend URL Constant
const BACKEND_URL = 'https://debuilder.vercel.app/';

// Authentication Logic for Login and Register

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    /** ==========================
     * 📌 User Login
     * ========================== */
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('role', result.role); // Store user role

                    alert('Login successful!');
                    if (result.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    /** ==========================
     * 📌 User Registration
     * ========================== */
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    window.location.href = 'login.html';
                } else {
                    alert(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    /** ==========================
     * 📌 Auto Logout on Token Expiry
     * ========================== */
    function isTokenExpired() {
        const token = localStorage.getItem('token');
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch (error) {
            console.error('Token Parsing Error:', error);
            return true;
        }
    }

    function autoLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
    }

    // Check Token Expiry on Page Load
    if (isTokenExpired()) {
        autoLogout();
    }

    /** ==========================
     * 📌 Periodic Token Validation
     * ========================== */
    async function validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            autoLogout();
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/validate-token`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                autoLogout();
            }
        } catch (error) {
            console.error('Token Validation Error:', error);
            autoLogout();
        }
    }

    // Periodically Check Token Validity Every 5 Minutes
    setInterval(validateToken, 5 * 60 * 1000);
});

/** ==========================
 * 📌 Logout Functionality
 * ========================== */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
}