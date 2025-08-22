document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');
    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');
    const rememberCheckbox = document.getElementById('remember'); // checkbox "Recordarme"
    const darkToggle = document.querySelector('.light-btn'); // botón de modo oscuro
    const selector = document.getElementById("idioma");
    const langBtn = document.querySelector('.lang-btn'); // tu botón
    const langSelect = document.getElementById('idioma'); // tu select

    // ======== Selector de idioma ========
    // Toggle del select al hacer click en el botón
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se cierre inmediatamente al hacer click fuera
        langSelect.style.display = langSelect.style.display === "block" ? "none" : "block";
    });

    // Cierra el select si haces click fuera
    document.addEventListener('click', () => {
        langSelect.style.display = 'none';
    });

    // Evita que el click dentro del select cierre el desplegable
    langSelect.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // ======== Modo oscuro: cargar estado desde localStorage ========
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Toggle modo oscuro
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // ======== Formulario ========
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        usuario.classList.remove('is-invalid');
        contrasena.classList.remove('is-invalid');

        const uservalido = usuario.value.trim();
        const passvalida = contrasena.value.trim();

        if (!uservalido || !passvalida) {
            if (!uservalido) usuario.classList.add('is-invalid');
            if (!passvalida) contrasena.classList.add('is-invalid');
            alert('Por favor, completá usuario y contraseña');
            (!uservalido ? usuario : contrasena).focus();
            return;
        }

        // ======== Guardar sesión ========
        if (rememberCheckbox.checked) {
            localStorage.setItem('usuario', uservalido); // guarda permanentemente
        } else {
            sessionStorage.setItem('usuario', uservalido); // guarda solo esta sesión
        }

        window.location.href = 'index.html';
    });

    // ======== Si ya hay usuario guardado ========
    const savedUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    if (savedUser) {
        usuario.value = savedUser; // rellena automáticamente el input
        rememberCheckbox.checked = !!localStorage.getItem('usuario');
    }
});