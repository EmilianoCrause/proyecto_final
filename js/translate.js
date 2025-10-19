const translations = {
  es: {
    //HOME
    "index-h2": "Productos Relevantes",
    "ver-mas": "Y mucho más!",
    "backToTop": "Volver arriba",
    "footerText": "Este sitio forma parte de ",
    products: [
      { title: "Autos", desc: "Los mejores precios en autos 0 kilómetro, de alta y media gama.", btn: "Ver categoría" },
      { title: "Juguetes", desc: "Encuentra aquí los mejores precios para niños/as de cualquier edad.", btn: "Ver categoría" },
      { title: "Muebles", desc: "Muebles antiguos, nuevos y para ser armados por uno mismo.", btn: "Ver categoría" }
    ],
  },
  en: {
    //HOME
    "index-h2": "Relevant Products",
    "ver-mas": "And much more!",
    "backToTop": "Back to top",
    "footerText": "This site is part of ",
    products: [
      { title: "Cars", desc: "The best prices on brand new, high- and mid-range cars.", btn: "See category" },
      { title: "Toys", desc: "Find the best prices for children of any age here.", btn: "See category" },
      { title: "Furniture", desc: "Antique, new, and do-it-yourself furniture.", btn: "See category" }
    ],
  }
};

// Función escalable
function loadTranslations(lang) {
  const t = translations[lang] || translations["es"]; // Idioma por defecto: español

  // Traducir todos los elementos que tengan un ID con traducción
  Object.keys(t).forEach(key => {
    if (key === "products") return; // Saltamos los productos aquí
    const elem = document.getElementById(key);
    if (elem) elem.textContent = t[key];
  });

 // Traducir cards existentes 
  const productTitles = document.querySelectorAll(".product-title");
  const productDescriptions = document.querySelectorAll(".product-description");
  const productBtns = document.querySelectorAll(".product-btn");
  const products = t.products;

  products.forEach((prod, i) => {
    if (productTitles[i]) productTitles[i].textContent = prod.title;
    if (productDescriptions[i]) productDescriptions[i].textContent = prod.desc;
    if (productBtns[i]) productBtns[i].textContent = prod.btn;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("idioma");
  const savedLang = localStorage.getItem("language") || "es";
  loadTranslations(savedLang);

  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener("change", e => {
      const selectedLang = e.target.value;
      localStorage.setItem("language", selectedLang);
      loadTranslations(selectedLang);
    });
  }
});