document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
    const savedUser = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    if (!savedUser) return;
=======
    const savedUser = localStorage.getItem(STORAGE_KEYS.USUARIO) || sessionStorage.getItem("usuario");
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c

    const username = savedUser.split('@')[0];
    const userDisplay = document.getElementById("User-display");

    if (userDisplay) {
        userDisplay.textContent = username; 
    }
});
