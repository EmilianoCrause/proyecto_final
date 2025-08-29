document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");

    if (savedUser) {
        const userDisplay = document.getElementById("User-display");
        if (userDisplay) {
            userDisplay.textContent = savedUser;
        }
    }
});