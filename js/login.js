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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');
    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');
    const rememberCheckbox = document.getElementById('remember');
    const langSelect = document.getElementById('idioma');
    const langBtn = document.querySelector('.lang-btn');

    // Usar funciones de utils.js
    initDarkMode();
    initLanguageSelector();

    function loadTranslations(lang) {
        document.getElementById('login-title').textContent = translations[lang]['login-title'];
        document.getElementById('remember-text').textContent = translations[lang]['remember-text'];
        document.getElementById('btn-ingresar').textContent = translations[lang]['btn-ingresar'];

        document.getElementById('recover-text').innerHTML = translations[lang]['recover-text'] +
            ' <a href="" id="recover-link">' + translations[lang]['recover-link'] + '</a>';
        document.getElementById('register-text').innerHTML = translations[lang]['register-text'] +
            ' <a href="" id="register-link">' + translations[lang]['register-link'] + '</a>';

        document.getElementById('other-methods-text').textContent = translations[lang]['other-methods-text'];

        document.getElementById('footer-text').innerHTML = translations[lang]['footer-text'] +
            ' <a href="https://jovenesaprogramar.edu.uy/" target="_blank" class="resaltar">Jóvenes a Programar</a>';

        usuario.placeholder = translations[lang]['email-placeholder'];
        contrasena.placeholder = translations[lang]['password-placeholder'];
    }
    // Cargar idioma guardado o usar español por defecto
<<<<<<< HEAD
    const savedLang = localStorage.getItem('language') || 'es';
    langSelect.value = savedLang;
    loadTranslations(savedLang);
=======
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'es';
    langSelect.value = savedLang; // Establecer el valor del select
    loadTranslations(savedLang); // Cargar traducciones
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c

    // Manejar cambio de idioma
    langSelect.addEventListener('change', (e) => {
<<<<<<< HEAD
        const selectedLang = e.target.value;
        localStorage.setItem('language', selectedLang);
        loadTranslations(selectedLang);
    });

=======
        const selectedLang = e.target.value; // Obtener el idioma seleccionado
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, selectedLang); // Guardar en localStorage
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
    if (localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true') {
        document.body.classList.add('dark-mode'); // Aplicar modo oscuro
    }

    // Alternar modo oscuro/claro al hacer clic
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode'); // Alternar clase
        // Guardar preferencia en localStorage
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, document.body.classList.contains('dark-mode'));
    });

    // ======== VALIDACIÓN DE FORMULARIO ========
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        usuario.classList.remove('is-invalid');
        contrasena.classList.remove('is-invalid');

        const uservalido = usuario.value.trim();
        const passvalida = contrasena.value.trim();

        if (!uservalido || !passvalida) {
            if (!uservalido) usuario.classList.add('is-invalid');
            if (!passvalida) contrasena.classList.add('is-invalid');

            // Mostrar mensaje de error en el idioma actual
            const currentLang = localStorage.getItem('language') || 'es';
            Swal.fire({
                toast: true,                           // alerta tipo notificación
                position: 'bottom-end',                    // esquina superior derecha
                icon: 'warning',
                title: translations[currentLang]['alert-title'],
                text: translations[currentLang]['alert-message'],
                showConfirmButton: false,              // sin botón, no bloquea
                timer: 3000,
                timerProgressBar: true
            });

            (!uservalido ? usuario : contrasena).focus();
            return;
        }

        if (rememberCheckbox.checked) {
<<<<<<< HEAD
            localStorage.setItem('usuario', uservalido);
        } else {
            sessionStorage.setItem('usuario', uservalido);
=======
            localStorage.setItem(STORAGE_KEYS.USUARIO, uservalido); // Guardar permanentemente
        } else {
            sessionStorage.setItem(STORAGE_KEYS.USUARIO, uservalido); // Guardar solo para esta sesión
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c
        }

        window.location.href = 'index.html';
    });

<<<<<<< HEAD
    const savedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (savedUser) {
        usuario.value = savedUser;
        rememberCheckbox.checked = !!localStorage.getItem('usuario');
=======
    // ======== CARGAR USUARIO GUARDADO ========
    // Verificar si hay un usuario guardado (en localStorage o sessionStorage)
    const savedUser = localStorage.getItem(STORAGE_KEYS.USUARIO) || sessionStorage.getItem(STORAGE_KEYS.USUARIO);
    if (savedUser) {
        usuario.value = savedUser; // Rellenar campo con usuario guardado
        rememberCheckbox.checked = !!localStorage.getItem(STORAGE_KEYS.USUARIO); // Marcar checkbox si está en localStorage
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c
    };
});