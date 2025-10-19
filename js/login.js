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
    const darkToggle = document.querySelector('.light-btn');
    const langSelect = document.getElementById('idioma');
    const langBtn = document.querySelector('.lang-btn');

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
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'es';
    langSelect.value = savedLang; // Establecer el valor del select
    loadTranslations(savedLang); // Cargar traducciones

    // Mostrar/ocultar selector al hacer clic en el botón
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el clic se propague a otros elementos
        // Alternar entre mostrar y ocultar el selector
        langSelect.style.display = langSelect.style.display === "block" ? "none" : "block";
    });

    langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('language', selectedLang);
        loadTranslations(selectedLang);
    });

    document.addEventListener('click', () => {
        langSelect.style.display = 'none';
    });

    langSelect.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

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
            localStorage.setItem('usuario', uservalido);
        } else {
            sessionStorage.setItem('usuario', uservalido);
        }

        window.location.href = 'index.html';
    });

    const savedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (savedUser) {
        usuario.value = savedUser;
        rememberCheckbox.checked = !!localStorage.getItem('usuario');
    };
});