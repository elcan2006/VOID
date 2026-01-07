document.addEventListener('DOMContentLoaded', () => {
    requireGuest(); // Redirect if already logged in

    // Entry Animation
    const authContainer = document.getElementById('authContainer');
    const mainLogo = document.querySelector('.main-logo');

    if (authContainer) {
        authContainer.style.display = 'block';
        setTimeout(() => {
            authContainer.classList.add('show');
            if (mainLogo) mainLogo.classList.add('show');
        }, 100);
    }

    // Google Auth Init
    window.handleCredentialResponse = function (response) {
        console.log("Encoded JWT ID token: " + response.credential);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'app.html';
    }

    // Tab switching
    window.switchTab = function (tab) {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const loginContent = document.getElementById('loginContent');
        const registerContent = document.getElementById('registerContent');

        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginContent.classList.add('active');
            registerContent.classList.remove('active');
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerContent.classList.add('active');
            loginContent.classList.remove('active');
        }
    }

    // Forms
    window.handleLogin = function (event) {
        event.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'app.html';
    }

    window.handleRegister = function (event) {
        event.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'app.html';
    }

    window.startGoogleLogin = function () {
        if (window.google) {
            google.accounts.id.prompt();
        }
    }
});
