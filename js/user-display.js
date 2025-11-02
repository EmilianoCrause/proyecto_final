document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USUARIO) || sessionStorage.getItem(STORAGE_KEYS.USUARIO);

    const username = savedUser.split('@')[0];
    const userDisplay = document.getElementById("User-display");

    if (userDisplay) {
        userDisplay.textContent = username; 
    }
});
