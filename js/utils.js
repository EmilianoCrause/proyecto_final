// Verifica si hay un usuario autenticado y un token válido
// Redirige a login si no hay sesión activa o token
function verificarUsuario() {
    const usuSession = sessionStorage.getItem(STORAGE_KEYS.USUARIO);
    const usuLocal = localStorage.getItem(STORAGE_KEYS.USUARIO);
    const tokenSession = sessionStorage.getItem('token');
    const tokenLocal = localStorage.getItem('token');

    // Verificar que exista usuario Y token
    if ((!usuSession && !usuLocal) || (!tokenSession && !tokenLocal)) {
        window.location = "login.html";
        return false;
    }
    return true;
}

// Cierra la sesión del usuario actual
function logout() {
    // Limpiar solo datos de sesión, mantener perfiles guardados por usuario
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Obtiene el carrito
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Guarda el carrito
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Agrega un evento click a un elemento por su ID de forma segura
function addClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
}

// Guarda el ID del producto seleccionado y navega a la página de detalles
function setProductID(id) {
    localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
    window.location = "product-info.html";
}

// Guarda el ID de categoría seleccionada y navega a la lista de productos
function setCatID(id) {
    localStorage.setItem(STORAGE_KEYS.CAT_ID, id);
    window.location = "products.html";
}

// Inicializa el modo oscuro: sincroniza el toggle con el estado guardado
// y agrega el listener para cambios de tema
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const themeToggleContainer = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        if (document.documentElement.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode");
            themeToggle.checked = true;
        }
        
        // Remover el atributo de carga y agregar ready después de un pequeño delay
        setTimeout(() => {
            document.documentElement.removeAttribute('data-theme-loading');
            if (themeToggleContainer) {
                themeToggleContainer.classList.add('ready');
            }
        }, 100);
        
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

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
});
