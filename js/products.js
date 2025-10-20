// Variables Globales
let currentProductsArray = [];
let filteredProductsArray = [];
const SORT_MAP = { asc: "priceAsc", desc: "priceDesc", count: "relevance" };

// Mapeo de opciones de ordenamiento
const SORT_MAP = {
    "priceAsc": "priceAsc",
    "priceDesc": "priceDesc", 
    "relevance": "relevance"
};

// Función para redirigir a la página de detalles del producto
function setProductID(id) {
    localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
    window.location = "product-info.html";
}

// Muestra la lista de productos en el contenedor principal
function showProductsList() {
    const productList = document.getElementById("products-list-container");
    let htmlContentToAppend = "";

    for (let i = 0; i < filteredProductsArray.length; i++) {
        const product = filteredProductsArray[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action cursor-active" onclick="setProductID(${product.id})">
            <div class="row">
                <div class="col-12 col-md-3">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid img-thumbnail mb-3 mb-md-0">
                </div>
                <div class="col-12 col-md-9">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-2">${product.name} - ${product.currency} ${product.cost}</h4>
                        <small class="text-muted">${product.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1">${product.description}</p>
                </div>
            </div>
        </div>
        `;
    }

    productList.innerHTML = htmlContentToAppend;
}

// --- Filtros y orden ---
function filtrarPorPrecio(minID, maxID) {
    let min = parseInt(document.getElementById(minID)?.value);
    let max = parseInt(document.getElementById(maxID)?.value);

    if (isNaN(min)) min = undefined;
    if (isNaN(max)) max = undefined;

    filteredProductsArray = currentProductsArray.filter(product => {
        return (min === undefined || product.cost >= min) &&
               (max === undefined || product.cost <= max);
    });

    showProductsList();
}

function ordenarProductos(criterio) {
    if (criterio === "priceAsc") {
        filteredProductsArray.sort((a, b) => a.cost - b.cost);
    } else if (criterio === "priceDesc") {
        filteredProductsArray.sort((a, b) => b.cost - a.cost);
    } else if (criterio === "relevance") {
        filteredProductsArray.sort((a, b) => b.soldCount - a.soldCount);
    }
    showProductsList();
}

function limpiarFiltros(minID, maxID) {
    const minEl = document.getElementById(minID);
    const maxEl = document.getElementById(maxID);
    if (minEl) minEl.value = "";
    if (maxEl) maxEl.value = "";
    filteredProductsArray = [...currentProductsArray];
    showProductsList();
}

// Helper para agregar listeners solo si el elemento existe
function addClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
}

function initSort() {
    const sortOptions = document.querySelector(".sort-options");
    if (sortOptions) {
        const radioInputs = sortOptions.querySelectorAll('input[name="options"]');
        radioInputs.forEach(input => {
            input.addEventListener("change", () => {
                ordenarProductos(SORT_MAP[input.value] || "relevance");
            });
        });
    }
}

function initFilters() {
    const priceFilterForm = document.getElementById("priceFilterForm");
    if (priceFilterForm) {
        priceFilterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            filtrarPorPrecio("rangeFilterPriceMin", "rangeFilterPriceMax");
        });
    }

    addClick("clearRangeFilter", () => limpiarFiltros("rangeFilterPriceMin", "rangeFilterPriceMax"));
}

function initSearchBar() {
    const searchBar = document.getElementById("search-bar");
    const clearBtn = document.getElementById("clear-search");
    if (searchBar && clearBtn) {
        clearBtn.style.display = "none";

        searchBar.addEventListener("input", () => {
            const searchTerm = searchBar.value.trim().toLowerCase();
            clearBtn.style.display = searchTerm ? "block" : "none";

            filteredProductsArray = currentProductsArray.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            ordenarProductos("relevance");
        });

        clearBtn.addEventListener("click", () => {
            searchBar.value = "";
            filteredProductsArray = [...currentProductsArray];
            ordenarProductos("relevance");
            clearBtn.style.display = "none";
            searchBar.focus();
        });
    }
}

function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
        if (savedDarkMode) {
            document.documentElement.classList.add("dark-mode");
            document.body.classList.add("dark-mode");
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener("change", () => {
            const isDark = themeToggle.checked;
            if (isDark) {
                document.documentElement.classList.add("dark-mode");
                document.body.classList.add("dark-mode");
            } else {
                document.documentElement.classList.remove("dark-mode");
                document.body.classList.remove("dark-mode");
            }
            localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark);
        });
    }
}

function initLanguageSelector() {
    const langBtn = document.querySelector(".lang-btn");
    const langSelect = document.getElementById("idioma");
    if (langBtn && langSelect) {
        langBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            langSelect.style.display = langSelect.style.display === "block" ? "none" : "block";
        });

        langSelect.addEventListener("click", (e) => e.stopPropagation());
        document.addEventListener("click", () => {
            langSelect.style.display = "none";
        });
    }
}

// Carga de productos
function loadProducts() {
    const catID = localStorage.getItem(STORAGE_KEYS.CAT_ID);
    const productListContainer = document.getElementById("products-list-container");

    if (!catID) {
        productListContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Error: No se seleccionó ninguna categoría.
        </div>
        `;
        return;
    }

    // Armamos la URL de la API
    const API_URL = PRODUCTS_URL + catID + EXT_TYPE;

    // Traemos los datos
    getJSONData(API_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data.products;
            filteredProductsArray = [...currentProductsArray];
            localStorage.setItem(STORAGE_KEYS.CAT_NAME, resultObj.data.catName);

            // Títulos dinámicos (si existen)
            const categoryTitleMobile = document.getElementById("category-title-mobile");
            const categoryTitleDesktop = document.getElementById("category-title-desktop");
            const categorySubtitleDesktop = document.getElementById("category-subtitle-desktop");

            if (categoryTitleMobile) categoryTitleMobile.textContent = resultObj.data.catName;
            if (categoryTitleDesktop && categorySubtitleDesktop) {
                categoryTitleDesktop.textContent = resultObj.data.catName;
                categorySubtitleDesktop.textContent =
                `Verás aquí todos los ${resultObj.data.catName.toLowerCase()} del sitio.`;
            }

            // Render inicial
            showProductsList();
        } else {
            console.error('Error al cargar productos:', resultObj.data);
            document.getElementById("products-list-container").innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error al cargar los productos. Intente nuevamente.
            </div>
            `;
        }
    });
}

// --- Inicio ---
document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    initSort();
    initFilters();
    initSearchBar();
    initDarkMode();
    initLanguageSelector();

    // --- Listeners escritorio ---
    addClick("rangeFilterPrice", () => filtrarPorPrecio("rangeFilterPriceMin", "rangeFilterPriceMax"));
    addClick("clearRangeFilter", () => limpiarFiltros("rangeFilterPriceMin", "rangeFilterPriceMax"));
    addClick("sortAsc", () => ordenarProductos("priceAsc"));
    addClick("sortDesc", () => ordenarProductos("priceDesc"));
    addClick("sortByCount", () => ordenarProductos("relevance"));

    // --- Listeners móvil ---
    addClick("rangeFilterPriceMobile", () => filtrarPorPrecio("rangeFilterPriceMinMobile", "rangeFilterPriceMaxMobile"));
    addClick("clearRangeFilterMobile", () => limpiarFiltros("rangeFilterPriceMinMobile", "rangeFilterPriceMaxMobile"));
    addClick("sortAscMobile", () => ordenarProductos("priceAsc"));
    addClick("sortDescMobile", () => ordenarProductos("priceDesc"));
    addClick("sortByCountMobile", () => ordenarProductos("relevance"));
});

// --- Barra de búsqueda ---
document.getElementById("btn-buscar")?.addEventListener("click", function () {
    const searchTerm = document.getElementById("search-bar")?.value.toLowerCase();
    filteredProductsArray = currentProductsArray.filter(product => product.name.toLowerCase().includes(searchTerm));
    showProductsList();
});