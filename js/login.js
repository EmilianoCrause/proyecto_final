document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');
    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');
    const rememberCheckbox = document.getElementById('remember');
    const langBtn = document.querySelector('.lang-btn'); 

    // Usar funciones de utils.js
    initDarkMode();
    initLanguageSelector();

    function loadTranslations(lang) {
        // Verificar que los elementos existan antes de manipularlos
        const elements = {
            'login-title': document.getElementById('login-title'),
            'remember-text': document.getElementById('remember-text'),
            'btn-ingresar': document.getElementById('btn-ingresar'),
            'recover-text': document.getElementById('recover-text'),
            'register-text': document.getElementById('register-text'),
            'other-methods-text': document.getElementById('other-methods-text'),
            'footer-text': document.getElementById('footer-text')
        };

        // Solo actualizar elementos que existen
        if (elements['login-title']) elements['login-title'].textContent = translations[lang]['login-title'];
        if (elements['remember-text']) elements['remember-text'].textContent = translations[lang]['remember-text'];
        if (elements['btn-ingresar']) elements['btn-ingresar'].textContent = translations[lang]['btn-ingresar'];

        if (elements['recover-text']) {
            elements['recover-text'].innerHTML = translations[lang]['recover-text'] +
                ' <a href="" id="recover-link">' + translations[lang]['recover-link'] + '</a>';
        }

        if (elements['register-text']) {
            elements['register-text'].innerHTML = translations[lang]['register-text'] +
                ' <a href="" id="register-link">' + translations[lang]['register-link'] + '</a>';
        }

        if (elements['other-methods-text']) {
            elements['other-methods-text'].textContent = translations[lang]['other-methods-text'];
        }

        if (elements['footer-text']) {
            elements['footer-text'].innerHTML = translations[lang]['footer-text'] +
                ' <a href="https://jovenesaprogramar.edu.uy/" target="_blank" class="resaltar">Jóvenes a Programar</a>';
        }

        // Actualizar placeholders
        if (usuario) usuario.placeholder = translations[lang]['email-placeholder'];
        if (contrasena) contrasena.placeholder = translations[lang]['password-placeholder'];
    }

    // Cargar idioma guardado o usar español por defecto
    const savedLang = localStorage.getItem('language') || 'es';
    loadTranslations(savedLang);

    // Validar que el formulario existe antes de agregar event listener
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (usuario) usuario.classList.remove('is-invalid');
            if (contrasena) contrasena.classList.remove('is-invalid');

            const uservalido = usuario ? usuario.value.trim() : '';
            const passvalida = contrasena ? contrasena.value.trim() : '';

            if (!uservalido || !passvalida) {
                if (!uservalido && usuario) usuario.classList.add('is-invalid');
                if (!passvalida && contrasena) contrasena.classList.add('is-invalid');

                // Mostrar mensaje de error en el idioma actual
                const currentLang = localStorage.getItem('language') || 'es';
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'warning',
                    title: translations[currentLang]['alert-title'],
                    text: translations[currentLang]['alert-message'],
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });

                (usuario && !uservalido ? usuario : contrasena)?.focus();
                return;
            }

            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem('usuario', uservalido);
            } else {
                sessionStorage.setItem('usuario', uservalido);
            }

            window.location.href = 'index.html';
        });
    }

    // Cargar usuario guardado si existe
    const savedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (savedUser && usuario) {
        usuario.value = savedUser;
        if (rememberCheckbox) {
            rememberCheckbox.checked = !!localStorage.getItem('usuario');
        }
    }
});