const translations = {
    es: {
        "index-h2": "Productos Destacados",
        "ver-mas": "Y mucho más!",
        "backToTop": "Volver arriba",
        "footerText": "Este sitio forma parte de",
        "search-placeholder": "Buscar productos...",
        products: [
            { 
                title: "Autos", 
                desc: "Los mejores precios en autos 0 kilómetro, de alta y media gama.", 
                btn: "Ver categoría" 
            },
            { 
                title: "Juguetes", 
                desc: "Encuentra aquí los mejores precios para niños/as de cualquier edad.", 
                btn: "Ver categoría" 
            },
            { 
                title: "Muebles", 
                desc: "Muebles antiguos, nuevos y para ser armados por uno mismo.", 
                btn: "Ver categoría" 
            }
        ],
    },
    en: {
        "index-h2": "Featured Products",
        "ver-mas": "See much more!",
        "backToTop": "Back to top",
        "footerText": "This site is part of",
        "search-placeholder": "Search products...",
        products: [
            { 
                title: "Cars", 
                desc: "Discover the best prices on brand new vehicles, high-end and mid-range.", 
                btn: "Explore category" 
            },
            { 
                title: "Toys", 
                desc: "The best toys and prices for children of all ages.", 
                btn: "Explore category" 
            },
            { 
                title: "Furniture", 
                desc: "Classic, modern and DIY furniture at the best prices.", 
                btn: "Explore category" 
            }
        ],
    }
};

function loadTranslations(lang) {
    const t = translations[lang] || translations["es"];

    Object.keys(t).forEach(key => {
        if (key === "products" || key === "search-placeholder") return;
        const elem = document.getElementById(key);
        if (elem) elem.textContent = t[key];
    });

    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.placeholder = t["search-placeholder"];
    }

    const mainCards = ["autos", "juguetes", "muebles"];
    const products = t.products;

    mainCards.forEach((cardId, i) => {
        const card = document.getElementById(cardId);
        if (card && products[i]) {
            const title = card.querySelector(".product-title");
            const description = card.querySelector(".product-description");
            const btn = card.querySelector(".product-btn");
            
            if (title) title.textContent = products[i].title;
            if (description) description.textContent = products[i].desc;
            if (btn) btn.textContent = products[i].btn;
        }
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