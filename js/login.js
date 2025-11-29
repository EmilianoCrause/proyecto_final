document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');
    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');
    const rememberCheckbox = document.getElementById('remember');
    const langBtn = document.querySelector('.lang-btn'); 

    initDarkMode();

    function loadTranslations(lang) {
        const elements = {
            'login-title': document.getElementById('login-title'),
            'remember-text': document.getElementById('remember-text'),
            'btn-ingresar': document.getElementById('btn-ingresar'),
            'recover-text': document.getElementById('recover-text'),
            'register-text': document.getElementById('register-text'),
            'other-methods-text': document.getElementById('other-methods-text'),
            'footer-text': document.getElementById('footer-text')
        };

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

        if (usuario) usuario.placeholder = translations[lang]['email-placeholder'];
        if (contrasena) contrasena.placeholder = translations[lang]['password-placeholder'];
    }

    const savedLang = localStorage.getItem('language') || 'es';
    loadTranslations(savedLang);

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (usuario) usuario.classList.remove('is-invalid');
            if (contrasena) contrasena.classList.remove('is-invalid');

            const uservalido = usuario ? usuario.value.trim() : '';
            const passvalida = contrasena ? contrasena.value.trim() : '';

            if (!uservalido || !passvalida) {
                if (!uservalido && usuario) usuario.classList.add('is-invalid');
                if (!passvalida && contrasena) contrasena.classList.add('is-invalid');

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

            // 🔥 HACER LOGIN AL BACKEND
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: uservalido,
                        password: passvalida
                    })
                });

                const result = await response.json();
                const currentLang = localStorage.getItem('language') || 'es';

                if (!response.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: translations[currentLang]['alert-title'],
                        text: result.error || translations[currentLang]['alert-message']
                    });
                    return;
                }

                // 🔒 Guardar TOKEN
                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('usuario', uservalido);
                } else {
                    sessionStorage.setItem('token', result.token);
                    sessionStorage.setItem('usuario', uservalido);
                }

                // Redirigir
                window.location.href = 'index.html';

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo conectar con el servidor.'
                });
            }
        });
    }

    // Cargar usuario guardado
    const savedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (savedUser && usuario) {
        usuario.value = savedUser;
        if (rememberCheckbox) {
            rememberCheckbox.checked = !!localStorage.getItem('usuario');
        }
    }
});
