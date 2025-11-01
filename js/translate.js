// === Inicializa el traductor de Google ===
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'es,en,fr,pt,de,it,ru,zh-CN,ja'
  }, 'google_translate_element');
}

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
      const interval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event('change'));
          clearInterval(interval);
        }
      }, 400);

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
