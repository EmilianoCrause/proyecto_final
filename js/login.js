// Traducciones disponibles
// Este objeto almacena todos los textos en diferentes idiomas
const translations = {
    es: { // Español
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
        "alert-message": "Por favor, completá usuario y contraseña"
    },
    en: { // Inglés
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
        "alert-message": "Please complete both email and password"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a elementos HTML usando sus IDs o clases
    const form = document.querySelector('.formulario'); // Formulario completo
    const usuario = document.getElementById('usuario'); // Campo de email
    const contrasena = document.getElementById('contrasena'); // Campo de contraseña
    const rememberCheckbox = document.getElementById('remember'); // Checkbox "recordarme"
    const darkToggle = document.querySelector('.light-btn'); // Botón modo oscuro/claro
    const langSelect = document.getElementById('idioma'); // Selector de idioma
    const langBtn = document.querySelector('.lang-btn'); // Botón del selector de idioma

    // ======== FUNCIÓN PARA CARGAR TRADUCCIONES ========
    function loadTranslations(lang) {
        // Actualizar textos en la página con las traducciones
        document.getElementById('login-title').textContent = translations[lang]['login-title'];
        document.getElementById('remember-text').textContent = translations[lang]['remember-text'];
        document.getElementById('btn-ingresar').textContent = translations[lang]['btn-ingresar'];
        
        // Actualizar enlaces con HTML (texto + enlace)
        document.getElementById('recover-text').innerHTML = translations[lang]['recover-text'] + 
            ' <a href="" id="recover-link">' + translations[lang]['recover-link'] + '</a>';
        document.getElementById('register-text').innerHTML = translations[lang]['register-text'] + 
            ' <a href="" id="register-link">' + translations[lang]['register-link'] + '</a>';
        
        // Texto de métodos alternativos
        document.getElementById('other-methods-text').textContent = translations[lang]['other-methods-text'];
        
        // Footer con enlace fijo (no se traduce "Jóvenes a Programar")
        document.getElementById('footer-text').innerHTML = translations[lang]['footer-text'] + 
            ' <a href="https://jovenesaprogramar.edu.uy/" target="_blank" class="resaltar">Jóvenes a Programar</a>';
        
        // Actualizar placeholders (textos dentro de los campos de entrada)
        usuario.placeholder = translations[lang]['email-placeholder'];
        contrasena.placeholder = translations[lang]['password-placeholder'];
    }

    // ======== SELECTOR DE IDIOMA ========
    // Cargar idioma guardado o usar español por defecto
    const savedLang = localStorage.getItem('language') || 'es';
    langSelect.value = savedLang; // Establecer el valor del select
    loadTranslations(savedLang); // Cargar traducciones

    // Mostrar/ocultar selector al hacer clic en el botón
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el clic se propague a otros elementos
        // Alternar entre mostrar y ocultar el selector
        langSelect.style.display = langSelect.style.display === "block" ? "none" : "block";
    });

    // Cambiar idioma cuando se selecciona una opción
    langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value; // Obtener el idioma seleccionado
        localStorage.setItem('language', selectedLang); // Guardar en localStorage
        loadTranslations(selectedLang); // Cargar nuevas traducciones
    });

    // Ocultar selector al hacer clic fuera de él
    document.addEventListener('click', () => {
        langSelect.style.display = 'none';
    });

    // Evitar que se oculte al hacer clic dentro del selector
    langSelect.addEventListener('click', (e) => {
        e.stopPropagation(); // Detener la propagación del evento
    });
    
    // ======== MODO OSCURO ========
    // Cargar preferencia de modo oscuro desde localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode'); // Aplicar modo oscuro
    }

    // Alternar modo oscuro/claro al hacer clic
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode'); // Alternar clase
        // Guardar preferencia en localStorage
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // ======== VALIDACIÓN DE FORMULARIO ========
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar envío tradicional del formulario

        // Quitar clases de error previas
        usuario.classList.remove('is-invalid');
        contrasena.classList.remove('is-invalid');

        // Obtener y limpiar valores
        const uservalido = usuario.value.trim();
        const passvalida = contrasena.value.trim();

        // Validar que ambos campos estén completos
        if (!uservalido || !passvalida) {
            // Marcar campos inválidos
            if (!uservalido) usuario.classList.add('is-invalid');
            if (!passvalida) contrasena.classList.add('is-invalid');
            
            // Mostrar mensaje de error en el idioma actual
            const currentLang = localStorage.getItem('language') || 'es';
            alert(translations[currentLang]['alert-message']);
            
            // Enfocar el primer campo vacío
            (!uservalido ? usuario : contrasena).focus();
            return; // Detener ejecución
        }

        // ======== GUARDAR SESIÓN ========
        // Guardar usuario según la preferencia "recordarme"
        if (rememberCheckbox.checked) {
            localStorage.setItem('usuario', uservalido); // Guardar permanentemente
        } else {
            sessionStorage.setItem('usuario', uservalido); // Guardar solo para esta sesión
        }

        // Redirigir a la página principal
        window.location.href = 'index.html';
    });

    // ======== CARGAR USUARIO GUARDADO ========
    // Verificar si hay un usuario guardado (en localStorage o sessionStorage)
    const savedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (savedUser) {
        usuario.value = savedUser; // Rellenar campo con usuario guardado
        rememberCheckbox.checked = !!localStorage.getItem('usuario'); // Marcar checkbox si está en localStorage
    }
});