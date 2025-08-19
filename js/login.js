document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.formulario');
    const usuario = document.getElementById('usuario');
    const contrasena = document.getElementById('contrasena');

    form.addEventListener('submit', (e) => {
        e.preventDefault()

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
        sessionStorage.setItem('usuario', uservalido);

        window.location.href = 'index.html'
    });

});