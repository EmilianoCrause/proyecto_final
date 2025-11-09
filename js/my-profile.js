document.addEventListener('DOMContentLoaded', function(){
    if (!verificarUsuario()) return;
    
    const infoNom = document.getElementById('info-nom')
    const infoApell = document.getElementById('info-apell')
    const infoEmail = document.getElementById('info-email')
    const infoTel = document.getElementById('info-tel')

    const btnEditar = document.getElementById('editar')
    const formEditar = document.getElementById('form-edit')

    const nomPerfil = document.getElementById('input-nom')
    const apellPerfil = document.getElementById('input-apell')
    const emailPerfil = document.getElementById('input-email')
    const telPerfil = document.getElementById('input-tel')

    const nomSaved = localStorage.getItem('nombre') || sessionStorage.getItem('nombre')
    const apellSaved = localStorage.getItem('apellido') || sessionStorage.getItem('apellido')
    const emailSaved =  localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
    const telSaved = localStorage.getItem('telefono') || sessionStorage.getItem('telefono')

    infoEmail.textContent = emailSaved
    infoNom.textContent = nomSaved ?? '-'
    infoApell.textContent = apellSaved ?? '-'
    infoTel.textContent = telSaved ??     '-'

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

    document.getElementById('btn-borrar-img').addEventListener('click', ()=>{
        localStorage.removeItem('profileImage')
    })

})

const profileImg = document.getElementById('profile-img');
const imgInput = document.getElementById('img-input');

window.addEventListener('DOMContentLoaded', () => {
  const savedImg = localStorage.getItem('profileImage');
  if (savedImg && profileImg) {
    profileImg.src = savedImg;
  }
});

if (imgInput) {
  imgInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        profileImg.src = evt.target.result;
        localStorage.setItem('profileImage', evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
}

// Inicializar dark mode y selector de idioma
initDarkMode();
initLanguageSelector();
