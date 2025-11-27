const translations = {
    es: {
        "login-title": "Iniciar sesión",
        "email-placeholder": "Correo electrónico",
        "password-placeholder": "Contraseña",
        "remember-text": "Mantener la sesión iniciada",
        "btn-ingresar": "Ingresar",
        "recover-text": "No recuerdas tu contraseña?",
        "recover-link": "Recuperar mi cuenta",
        "register-text": "No tienes cuenta?",
        "register-link": "Regístrate aquí",
        "other-methods-text": "Otras formas de inicio de sesión",
        "footer-text": "Este sitio forma parte de",
        "alert-message": "Por favor, completá usuario y contraseña con datos válidos",
        "alert-title": "Atención",
    },
    en: {
        "login-title": "Log in",
        "email-placeholder": "Email",
        "password-placeholder": "Password",
        "remember-text": "Keep me logged in",
        "btn-ingresar": "Log in",
        "recover-text": "Forgot your password?",
        "recover-link": "Recover my account",
        "register-text": "Don't have an account?",
        "register-link": "Sign up here",
        "other-methods-text": "Other login methods",
        "footer-text": "This site is part of",
        "alert-message": "Please complete both email and password fields with valid data",
        "alert-title": "Warning",
    }
};

// === Inicializa el traductor de Google ===
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'es,en,fr,pt,de,it,ru,zh-CN,ja'
  }, 'google_translate_element');
}

// === Función global para cambiar idioma (usada por mobile-menu.js) ===
window.changeLanguage = function(lang) {
  // Si selecciona español (idioma original), recarga la página sin traducción
  if (lang === 'es') {
    // Elimina las cookies de Google Translate
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    
    // Recarga la página limpiando parámetros
    const url = window.location.href.split('#')[0].split('?')[0];
    window.location.href = url;
    return;
  }
  
  // Para otros idiomas, espera a que Google Translate esté listo
  const interval = setInterval(() => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 100);
};

// === Espera a que el DOM esté listo ===
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnIdioma');
  const dropdown = document.getElementById('langDropdown');

  if (!btn || !dropdown) return;

  // --- Mostrar/Ocultar menú desplegable ---
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // evita que se cierre de inmediato
    dropdown.parentElement.classList.toggle('show');
  });

  // --- Cerrar menú al hacer clic fuera ---
  document.addEventListener('click', (e) => {
    if (!dropdown.parentElement.contains(e.target)) {
      dropdown.parentElement.classList.remove('show');
    }
  });

  // --- Selección de idioma ---
  dropdown.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      window.changeLanguage(lang);
      dropdown.parentElement.classList.remove('show');
    });
  });

  // --- Elimina la barra molesta de Google Translate ---
  (function removeGoogleBanner() {
    const observer = new MutationObserver((mutations) => {
      let removed = false;
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;

          const selectors = [
            'iframe.goog-te-banner-frame',
            '.goog-te-banner-frame.skiptranslate',
            '.goog-tooltip',
            '.goog-te-balloon-frame'
          ];

          if (selectors.some(sel => node.matches?.(sel))) {
            node.remove();
            removed = true;
          }

          // Busca dentro del nodo también
          selectors.forEach(sel => {
            node.querySelectorAll?.(sel).forEach(el => el.remove());
          });
        });
      });

      if (removed && document.body.style.top) {
        document.body.style.top = '0px';
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remueve si ya están presentes
    setTimeout(() => {
      document.querySelectorAll('iframe.goog-te-banner-frame, .goog-tooltip, .goog-te-balloon-frame')
        .forEach(el => el.remove());
      document.body.style.top = '0px';
    }, 200);
  })();
});
