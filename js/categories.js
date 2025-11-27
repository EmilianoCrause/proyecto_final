/**
 * categories.js
 * Maneja el listado y filtrado de categorías:
 * - Carga y muestra categorías desde la API
 * - Filtros por cantidad de productos
 * - Ordenamiento (nombre, relevancia)
 */

let currentCategoriesArray = [];
let filteredCategoriesArray = [];
const SORT_MAP = { nameAsc: 'nameAsc', nameDesc: 'nameDesc', relevance: 'relevance' };

// Guarda el ID de categoría y navega a la página de productos
function setCatID(id) {
    localStorage.setItem(STORAGE_KEYS.CAT_ID, id);
    window.location = "products.html";
}

// Ordena las categorías según el criterio especificado (nombre ascendente/descendente o relevancia)
function sortCategories(criteria) {
    if (criteria === 'nameAsc') {
        filteredCategoriesArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'nameDesc') {
        filteredCategoriesArray.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === 'relevance') {
        filteredCategoriesArray.sort((a, b) => b.productCount - a.productCount);
    }
}

// Renderiza la lista de categorías filtradas en el DOM
function showCategoriesList() {
    const container = document.getElementById("cat-list-container");
    if (!container) return;

    let htmlContentToAppend = "";
    for (const category of filteredCategoriesArray) {
        htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="product-card">
                <div class="product-image-wrapper">
                    <img src="${category.imgSrc}" alt="${category.name}" class="product-image">
                    <div class="sold-badge">${category.productCount} artículos</div>
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <h4 class="product-title">${category.name}</h4>
                        <p class="product-description">${category.description}</p>
                    </div>
                    <div class="product-action">
                        <button class="product-btn">Ver categoría</button>
                    </div>
                </div>
            </div>
        `;
    }
    container.innerHTML = htmlContentToAppend;
}

// Aplica filtros por cantidad de productos y muestra los resultados ordenados
function filterAndShow() {
    const minCount = parseInt(document.getElementById('rangeFilterCountMin')?.value) || 0;
    const maxCount = parseInt(document.getElementById('rangeFilterCountMax')?.value) || Infinity;

    filteredCategoriesArray = currentCategoriesArray.filter(category =>
        category.productCount >= minCount && category.productCount <= maxCount
    );

    const sortOption = document.querySelector('input[name="sortOptions"]:checked')?.value || 'relevance';
    sortCategories(sortOption);
    showCategoriesList();
}

// Inicializa todos los event listeners para filtros y ordenamiento
function initEventListeners() {
    document.querySelectorAll('input[name="sortOptions"]').forEach(input => {
        input.addEventListener('change', filterAndShow);
    });

    const filterForm = document.getElementById('countFilterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterAndShow();
        });
    }

    const clearButton = document.getElementById('clearRangeFilter');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            document.getElementById('rangeFilterCountMin').value = '';
            document.getElementById('rangeFilterCountMax').value = '';
            filterAndShow();
        });
    }
}

// ===============================
// CARGA INICIAL DE LA PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    if (!verificarUsuario()) return;

    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            filterAndShow();
            initEventListeners();
        } else {
            alert("Error al cargar categorías. Por favor, intenta nuevamente.");
        }
    });

    initDarkMode();

    const breadcrumb = document.getElementById("breadcrumb-container");
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Categorías</li>
        `;
    }
});