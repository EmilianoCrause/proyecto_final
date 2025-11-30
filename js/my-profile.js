/**
 * my-profile.js
 * Maneja la página de perfil del usuario:
 * - Visualización de datos del usuario
 * - Edición de información personal
 * - Carga y eliminación de imagen de perfil
 * - Persistencia en localStorage/sessionStorage
 */

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

    const currentUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
    const userKey = `profile_${currentUser}`
    
    // Cargar perfil específico del usuario actual
    const userProfile = JSON.parse(localStorage.getItem(userKey) || sessionStorage.getItem(userKey) || '{}')
    
    const nomSaved = userProfile.nombre || ''
    const apellSaved = userProfile.apellido || ''
    const emailSaved = currentUser
    const telSaved = userProfile.telefono || ''

    let tempImageData = null;
    let imageToDelete = false;

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
        
        tempImageData = null;
        imageToDelete = false;
    })

    document.getElementById('btn-cerrar').addEventListener('click', () => {
        formEditar.style.display = 'none'
        btnEditar.style.display = 'block'
        
        const savedImg = userProfile.profileImage;
        const profileImg = document.getElementById('profile-img');
        if (savedImg && profileImg) {
            profileImg.src = savedImg;
        } else if (profileImg) {
            profileImg.src = 'img/extra/icono-perfil.png';
        }
        
        tempImageData = null;
        imageToDelete = false;
    })

    document.getElementById('form-edit').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Guardar perfil del usuario actual
        const profileData = {
            nombre: nomPerfil.value,
            apellido: apellPerfil.value,
            telefono: telPerfil.value,
            profileImage: imageToDelete ? null : (tempImageData || userProfile.profileImage || null)
        };
        
        if (localStorage.getItem('usuario') !== null) {
            localStorage.setItem(userKey, JSON.stringify(profileData));
        } else {
            sessionStorage.setItem(userKey, JSON.stringify(profileData));
        }
        
        formEditar.style.display = 'none'
        btnEditar.style.display = 'block'
        
        tempImageData = null;
        imageToDelete = false;
        
        location.reload()
    })

    document.getElementById('btn-borrar-img').addEventListener('click', (e) => {
        e.preventDefault();
        imageToDelete = true;
        tempImageData = null;
        const profileImg = document.getElementById('profile-img');
        if (profileImg) {
            profileImg.src = 'img/extra/icono-perfil.png';
        }
    })

    const imgInput = document.getElementById('img-input');
    if (imgInput) {
        imgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const profileImg = document.getElementById('profile-img');
                    if (profileImg) {
                        profileImg.src = evt.target.result;
                        tempImageData = evt.target.result;
                        imageToDelete = false;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

})

const profileImg = document.getElementById('profile-img');

window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  if (currentUser) {
    const userKey = `profile_${currentUser}`;
    const userProfile = JSON.parse(localStorage.getItem(userKey) || sessionStorage.getItem(userKey) || '{}');
    const savedImg = userProfile.profileImage;
    if (savedImg && profileImg) {
      profileImg.src = savedImg;
    }
  }
});

initDarkMode();
