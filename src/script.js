document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle Logic
    const toggleBtn = document.getElementById('darkModeToggle');
    const body = document.body;

    const updateThemeUI = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        if (toggleBtn) {
            toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    updateThemeUI(savedTheme === 'dark');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            const newTheme = !isDark;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            updateThemeUI(newTheme);
        });
    }

    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const forgotLink = document.querySelector('.remember-forgot a'); // "Forgot Password?" link
    const backToLogin = document.querySelector('.back-to-login');
    const btnLoginPopup = document.querySelector('.btnLogin-popup');
    const btnRegisterPopup = document.querySelector('.btnRegister-popup');
    const iconClose = document.querySelector('.icon-close');
    const mainContainer = document.querySelector('.maincontainer');
    const startBtn = document.querySelector('.start');
    const navLinks = document.querySelectorAll('.navigation a');

    if (registerLink) registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
        wrapper.classList.remove('active-forgot');
    })

    if (loginLink) loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active');
        wrapper.classList.remove('active-forgot');
    })

    if (forgotLink) forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active-forgot');
        wrapper.classList.remove('active');
    })

    if (backToLogin) backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active-forgot');
    })

    if (btnLoginPopup) btnLoginPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.remove('active');
        wrapper.classList.remove('active-forgot');
        resetForgotForm();
        if (mainContainer) mainContainer.classList.add('hide');
    })

    if (btnRegisterPopup) btnRegisterPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.add('active');
        wrapper.classList.remove('active-forgot');
        resetForgotForm();
        if (mainContainer) mainContainer.classList.add('hide');
    })

    if (iconClose) iconClose.addEventListener('click', () => {
        if (wrapper) {
            wrapper.classList.remove('active-popup');
            wrapper.classList.remove('active');
            wrapper.classList.remove('active-forgot');
        }
        if (mainContainer) mainContainer.classList.remove('hide');
    })

    // Functionality for "Get Started" button
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            wrapper.classList.add('active-popup');
            wrapper.classList.add('active');
            wrapper.classList.remove('active-forgot');
            if (mainContainer) mainContainer.classList.add('hide');
        });
    }

    // Functionality for "Learn More" button
    const learnMoreBtn = document.querySelector('.secondary');
    const learnMoreModal = document.querySelector('.learn-more-modal');
    const learnMoreClose = document.querySelector('.learn-more-close');
    const modalGetStarted = document.querySelector('.modal-get-started');
    const modalCreateProfile = document.querySelector('.modal-create-profile');

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            if (learnMoreModal) {
                learnMoreModal.classList.add('active-popup');
                if (mainContainer) mainContainer.classList.add('hide');
            }
        });
    }

    if (learnMoreClose) {
        learnMoreClose.addEventListener('click', () => {
            if (learnMoreModal) {
                learnMoreModal.classList.remove('active-popup');
                if (mainContainer) mainContainer.classList.remove('hide');
            }
        });
    }

    if (modalGetStarted) {
        modalGetStarted.addEventListener('click', () => {
            if (learnMoreModal) learnMoreModal.classList.remove('active-popup');
            wrapper.classList.add('active-popup');
            wrapper.classList.add('active');
            if (mainContainer) mainContainer.classList.add('hide');
        });
    }

    if (modalCreateProfile) {
        modalCreateProfile.addEventListener('click', () => {
            if (learnMoreModal) learnMoreModal.classList.remove('active-popup');
            wrapper.classList.add('active-popup');
            wrapper.classList.add('active');
            if (mainContainer) mainContainer.classList.add('hide');
        });
    }

    // Functionality for "Home" navigation link removed as Home button is removed

    // Password Visibility Toggle
    const togglePasswords = document.querySelectorAll('.toggle-password');
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const icon = toggle.querySelector('ion-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('name', 'eye-outline');
            } else {
                input.type = 'password';
                icon.setAttribute('name', 'eye-off-outline');
            }
        });
    });

    // Handle Select label float
    const genderSelect = document.getElementById('reg-gender');
    if (genderSelect) {
        genderSelect.addEventListener('change', () => {
            if (genderSelect.value !== "") {
                genderSelect.classList.add('has-value');
            } else {
                genderSelect.classList.remove('has-value');
            }
        });
    }

    // --- BACKEND INTEGRATION ---

    const loginForm = document.querySelector('.form-box.login form');
    const registerForm = document.querySelector('.form-box.register form');
    const forgotForm = document.querySelector('.form-box.forgot-password form');

    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            const messageDiv = document.getElementById('forgot-message');
            const errorDiv = document.getElementById('forgot-error');
            const submitBtn = forgotForm.querySelector('button[type="submit"]');

            // Reset states
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
            messageDiv.style.display = 'none';

            if (!email) {
                errorDiv.textContent = 'Please enter your email address.';
                errorDiv.style.display = 'block';
                return;
            }

            try {
                // Disable button and show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';

                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    forgotForm.style.display = 'none';
                    messageDiv.textContent = data.message;
                    messageDiv.style.display = 'block';
                } else {
                    errorDiv.textContent = data.message || 'Something went wrong. Please try again later.';
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Reset Link';
                }
            } catch (error) {
                console.error('Error:', error);
                errorDiv.textContent = 'Something went wrong. Please try again later.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input.password-input').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login Successful!');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'afterlogin/dashboard.html';
                } else {
                    alert('Login Failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                
                // --- Mock Login Fallback for UI Testing ---
                console.log('Backend unreachable. Triggering Mock Login for UI verification...');
                const mockUser = {
                    fullname: "Test User",
                    email: email,
                    age: 25,
                    gender: "Others"
                };
                localStorage.setItem('user', JSON.stringify(mockUser));
                alert('Backend unreachable. Entering UI Mock Mode for verification...');
                window.location.href = 'afterlogin/dashboard.html';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('reg-fullname').value;
            const email = document.getElementById('reg-email').value;
            const age = document.getElementById('reg-age').value;
            const gender = document.getElementById('reg-gender').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (!isStrongPassword(password)) {
                alert('Password does not meet complexity requirements: min. 8 chars, including uppercase, lowercase, number, and special character.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullname, email, age, gender, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration Successful!');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'afterlogin/dashboard.html';
                } else {
                    alert('Registration Failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                
                // --- Mock Registration Fallback for UI Testing ---
                console.log('Backend unreachable. Triggering Mock Registration...');
                const mockUser = { fullname, email, age, gender };
                localStorage.setItem('user', JSON.stringify(mockUser));
                alert('Backend unreachable. Registration Mocked for UI verification...');
                window.location.href = 'afterlogin/dashboard.html';
            }
        });
    }

    function resetForgotForm() {
        const forgotForm = document.querySelector('.form-box.forgot-password form');
        const messageDiv = document.getElementById('forgot-message');
        const errorDiv = document.getElementById('forgot-error');
        if (forgotForm) {
            forgotForm.style.display = 'block';
            forgotForm.reset();
            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
            }
        }
        if (messageDiv) {
            messageDiv.style.display = 'none';
            messageDiv.textContent = '';
        }
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
    }
});

const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};
