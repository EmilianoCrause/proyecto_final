document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");

    if (!savedUser) return; // salir si no hay usuario

    const username = savedUser.split('@')[0]; // solo la parte antes del @
    const userDisplay = document.getElementById("User-display");

    if (userDisplay) {
        userDisplay.textContent = username; 
    }
});
