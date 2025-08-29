document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
      const username = savedUser.split('@')[0]; 

    if (username) {
        const userDisplay = document.getElementById("User-display");
        if (userDisplay) {
            userDisplay.textContent = username;
        }
    }
});