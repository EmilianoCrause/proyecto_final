// ===========================
// UTILIDADES COMPARTIDAS
// ===========================

// Verificación de usuario logueado - Redirige a login si no hay sesión
function verificarUsuario() {
    const usuSession = sessionStorage.getItem(STORAGE_KEYS.USUARIO);
    const usuLocal = localStorage.getItem(STORAGE_KEYS.USUARIO);

    if (!usuSession && !usuLocal) {
        window.location = "login.html";
        return false;
    }
    return true;
}

// Función compartida para agregar event listeners de manera segura
function addClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
}

// Función compartida para guardar el ID de un producto y redirigir
function setProductID(id) {
    localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
    window.location = "product-info.html";
}

// Función compartida para guardar el ID de una categoría y redirigir
function setCatID(id) {
    localStorage.setItem(STORAGE_KEYS.CAT_ID, id);
    window.location = "products.html";
}

// Funciones de Dark Mode e idioma compartidas entre páginas
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        if (document.documentElement.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode");
            themeToggle.checked = true;
        }
        themeToggle.addEventListener("change", () => {
            const isDark = themeToggle.checked;
            if (isDark) {
                document.documentElement.classList.add("dark-mode");
                document.body.classList.add("dark-mode");
            } else {
                document.documentElement.classList.remove("dark-mode");
                document.body.classList.remove("dark-mode");
            }
            localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark);
        });
    }
}

function initLanguageSelector() {
    const langBtn = document.querySelector(".lang-btn");
    const langSelect = document.getElementById("idioma");
    if (langBtn && langSelect) {
        langBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            langSelect.style.display = langSelect.style.display === "block" ? "none" : "block";
        });

        langSelect.addEventListener("click", (e) => e.stopPropagation());
        document.addEventListener("click", () => {
            langSelect.style.display = "none";
        });
    }
}
