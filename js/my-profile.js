document.addEventListener('DOMContentLoaded', function(){
    //Campos para mostrar informacion
    const infoNom = document.getElementById('info-nom') // Campo nombre
    const infoApell = document.getElementById('info-apell') // Campo apellido
    const infoEmail = document.getElementById('info-email') // Campos email
    const infoTel = document.getElementById('info-tel') // Campo telefono

    // Botones de edicion
    const btnEditar = document.getElementById('editar') // Boton para abrir edicion
    const formEditar = document.getElementById('form-edit') // Boton para guardar edicion

    // Campos del formualrio
    const nomPerfil = document.getElementById('input-nom') // Campo nombre
    const apellPerfil = document.getElementById('input-apell') // Campo apellido
    const emailPerfil = document.getElementById('input-email') // Campo email
    const telPerfil = document.getElementById('input-tel') // Campo telefono

    // Informacion guardada
    const nomSaved = localStorage.getItem('nombre') || sessionStorage.getItem('nombre') // Nombre guardado
    const apellSaved = localStorage.getItem('apellido') || sessionStorage.getItem('apellido') // Apellido guardado
    const emailSaved =  localStorage.getItem('usuario') || sessionStorage.getItem('usuario') // Email guardado
    const telSaved = localStorage.getItem('telefono') || sessionStorage.getItem('telefono') // Telefono guardado

    //Modo oscuro
    const darkToggle = document.getElementById('theme-toggle-checkbox');

    //Mostrar informacion del perfil
    infoEmail.textContent = emailSaved
    infoNom.textContent = nomSaved ?? '-'
    infoApell.textContent = apellSaved ?? '-'
    infoTel.textContent = telSaved ??     '-'

    // Mostrar y ocultar edicion de datos       
    btnEditar.addEventListener('click', function(){
        btnEditar.style.display = 'none'
        formEditar.style.display = 'block'
        nomPerfil.value = nomSaved
        apellPerfil.value = apellSaved
        emailPerfil.value = emailSaved
        telPerfil.value = telSaved
    })

    document.getElementById('btn-cerrar').addEventListener('click', () => {
        formEditar.style.display = 'none'
        btnEditar.style.display = 'block'
    })

    //Guardar informacion del perfil    
    document.getElementById('form-edit').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (localStorage.getItem('usuario') !== null) {
            localStorage.setItem('nombre', nomPerfil.value)
            localStorage.setItem('apellido', apellPerfil.value)
            localStorage.setItem('usuario', emailPerfil.value)
            localStorage.setItem('telefono', telPerfil.value)
        } else {
            sessionStorage.setItem('nombre', nomPerfil.value)
            sessionStorage.setItem('apellido', apellPerfil.value)
            sessionStorage.setItem('usuario', emailPerfil.value)
            sessionStorage.setItem('telefono', telPerfil.value)
        }
        formEditar.style.display = 'none'
        btnEditar.style.display = 'block'
        location.reload()
    })

    // ======== MODO OSCURO ========
    // Cargar preferencia inicial
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.checked = true; // Mantener el checkbox activado
}

// Alternar modo oscuro/claro
darkToggle.addEventListener('change', () => {
    if (darkToggle.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkToggle.checked);
});

})