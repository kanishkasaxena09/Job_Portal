/* ==========================================================================
   Job & Placement Portal - Auth Module
   Handles login, registration, and session state (client-side demo).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAuthForms();
  updateAuthUI();
});

/* ==========================================================================
   Session Management
   ========================================================================== */
const Auth = {
  /* Store current user session */
  setSession(user) {
    localStorage.setItem('portalUser', JSON.stringify(user));
    updateAuthUI();
  },

  /* Retrieve current user session */
  getSession() {
    const raw = localStorage.getItem('portalUser');
    return raw ? JSON.parse(raw) : null;
  },

  /* Clear current user session */
  logout() {
    localStorage.removeItem('portalUser');
    updateAuthUI();
  },

  /* Check if user is logged in */
  isAuthenticated() {
    return this.getSession() !== null;
  },
};

/* ==========================================================================
   Auth Form Handlers
   ========================================================================== */
function initAuthForms() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

/* ==========================================================================
   Login Handler
   ========================================================================== */
function handleLogin(e) {
  e.preventDefault();

  const email = document.querySelector('#loginEmail').value;
  const password = document.querySelector('#loginPassword').value;
  const remember = document.querySelector('#rememberMe')?.checked || false;

  // Basic client-side validation
  if (!email || !password) {
    showAuthError('Please fill in all fields.');
    return;
  }

  if (!isValidEmail(email)) {
    showAuthError('Please enter a valid email address.');
    return;
  }

  // Demo session (no real backend)
  const user = {
    name: email.split('@')[0].replace(/[._-]/g, ' '),
    email,
    role: 'candidate',
    loginTime: new Date().toISOString(),
  };

  Auth.setSession(user);
  showAuthSuccess('Login successful! Redirecting...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

/* ==========================================================================
   Register Handler
   ========================================================================== */
function handleRegister(e) {
  e.preventDefault();

  const fullName = document.querySelector('#registerName').value;
  const email = document.querySelector('#registerEmail').value;
  const password = document.querySelector('#registerPassword').value;
  const confirmPassword = document.querySelector('#registerConfirmPassword').value;

  // Basic client-side validation
  if (!fullName || !email || !password || !confirmPassword) {
    showAuthError('Please fill in all fields.');
    return;
  }

  if (!isValidEmail(email)) {
    showAuthError('Please enter a valid email address.');
    return;
  }

  if (password.length < 8) {
    showAuthError('Password must be at least 8 characters long.');
    return;
  }

  if (password !== confirmPassword) {
    showAuthError('Passwords do not match.');
    return;
  }

  // Demo registration (no real backend)
  const user = {
    name: fullName,
    email,
    role: 'candidate',
    registerTime: new Date().toISOString(),
  };

  Auth.setSession(user);
  showAuthSuccess('Registration successful! Redirecting...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

/* ==========================================================================
   Update UI based on Auth State
   ========================================================================== */
function updateAuthUI() {
  const user = Auth.getSession();
  const authLinks = document.querySelectorAll('[data-auth-links]');
  const userInfo = document.querySelectorAll('[data-user-info]');

  if (user) {
    // Show user in dropdown / hide login buttons
    authLinks.forEach(link => {
      if (link.hasAttribute('data-auth-links')) {
        link.style.display = 'none';
      }
    });

    userInfo.forEach(el => {
      el.style.display = 'flex';
      const nameEl = el.querySelector('[data-user-name]');
      if (nameEl) {
        nameEl.textContent = user.name;
      }
    });
  } else {
    authLinks.forEach(link => {
      link.style.display = 'flex';
    });
    userInfo.forEach(el => {
      el.style.display = 'none';
    });
  }
}

/* ==========================================================================
   Utility: Email Validation
   ========================================================================== */
function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

/* ==========================================================================
   Utility: Show Error Message
   ========================================================================== */
function showAuthError(message) {
  const container = document.querySelector('#authMessage');
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert--danger">
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    </div>
  `;
}

/* ==========================================================================
   Utility: Show Success Message
   ========================================================================== */
function showAuthSuccess(message) {
  const container = document.querySelector('#authMessage');
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert--success">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
}

/* ==========================================================================
   Logout Handler (bound dynamically by main.js or inline onclick)
   ========================================================================== */
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-logout]')) {
    e.preventDefault();
    Auth.logout();
    window.location.reload();
  }
});