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