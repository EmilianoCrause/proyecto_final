document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    if (!savedUser) return;

    const username = savedUser.split('@')[0];
    const userDisplay = document.getElementById("User-display");

    if (userDisplay) {
        userDisplay.textContent = username; 
    }
});
