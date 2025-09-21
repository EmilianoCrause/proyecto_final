
document.addEventListener("DOMContentLoaded", function(){
    let usuSession = sessionStorage.getItem("usuario");
    let usuLocal =localStorage.getItem("usuario");
    
    if (!usuSession && !usuLocal) {
        window.location = "login.html";
        return;
    }
     // Elegir usuario existente
     const savedUser = usuLocal || usuSession;

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