<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function() {
    // Recuperar usuario de localStorage o sessionStorage
    const savedUser = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");

    // Si no hay usuario, redirigir al login
    if (!savedUser) {
=======
document.addEventListener("DOMContentLoaded", function(){
    let usuSession = sessionStorage.getItem("usuario");
    let usuLocal =localStorage.getItem("usuario");
    
    if (!usuSession && !usuLocal) {
>>>>>>> 5c7b9dbd01d921f54508c10161da1812947ba6f0
        window.location = "login.html";
        return;
    }

    // Mostrar usuario en la barra de navegación
    const userDisplay = document.getElementById("User-display");
    if (userDisplay) {
        userDisplay.textContent = savedUser;
    }

    // Agregar eventos a las categorías
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html";
    });
});