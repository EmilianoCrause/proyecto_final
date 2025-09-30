
document.addEventListener("DOMContentLoaded", function () {
    let usuSession = sessionStorage.getItem("usuario");
    let usuLocal = localStorage.getItem("usuario");

    if (!usuSession && !usuLocal) {
        window.location = "login.html";
        return;
    }
    // Elegir usuario existente
    const savedUser = usuLocal || usuSession;

    // Agregar eventos a las categorías
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html";
    });

    initDarkMode();

    const breadcrumb = document.getElementById("breadcrumb-container");
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item active" aria-current="page">Home</li>
        `;
    }
});

function initDarkMode() {
  const darkModeBtn = document.querySelector('.light-btn[aria-label="Cambiar modo claro/oscuro"]');
  if (darkModeBtn) {
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "true" || (!savedTheme && prefersDark)) {
      document.body.classList.add("dark-mode");
    }

    darkModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDark);
      darkModeBtn.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    });
  }
}