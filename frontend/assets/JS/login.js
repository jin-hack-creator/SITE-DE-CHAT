function setupDeviceDetection() {
  const updateOrientation = () => {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    document.body.classList.toggle('landscape', isLandscape);
  };

  window.addEventListener('resize', updateOrientation);
  window.addEventListener('orientationchange', updateOrientation);
  updateOrientation();
}

function validateForm(email, username) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
  const existingError = document.querySelector('.error-message');
  if (existingError) existingError.remove();

  if (!email) {
    showError('L\'email est requis');
    document.getElementById('email').classList.add('input-error');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError('Veuillez entrer un email valide');
    document.getElementById('email').classList.add('input-error');
    isValid = false;
  }

  if (!username) {
    showError('Le pseudonyme est requis');
    document.getElementById('username').classList.add('input-error');
    isValid = false;
  } else if (username.length < 3) {
    showError('Le pseudonyme doit contenir au moins 3 caractères');
    document.getElementById('username').classList.add('input-error');
    isValid = false;
  }

  return isValid;
}

function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  const form = document.getElementById('login-form');
  form.insertBefore(errorElement, form.firstChild);
  

  const firstErrorField = document.querySelector('.input-error');
  if (firstErrorField) firstErrorField.focus();
}


async function sendConfirmationEmail(email, username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
    
      if (Math.random() < 0.2) {
        reject(new Error('Échec de l\'envoi. Veuillez réessayer.'));
      } else {
        resolve();
      }
    }, 1500);
  });
}


async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const loginBtn = document.getElementById('login-btn');

  if (!validateForm(email, username)) return;

  try {
    
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

  
    await sendConfirmationEmail(email, username);

  
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('lastLogin', new Date().toISOString());

    
    window.location.href = 'index.html';
  } catch (error) {
    showError(error.message);
  } finally {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  setupDeviceDetection();
  

  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        window.scrollTo(0, 0);
      });
    });
  }
  
  
  document.getElementById('email').focus();
});