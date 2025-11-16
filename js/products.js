/**
 * products.js
 * Maneja el listado y filtrado de productos de una categoría:
 * - Carga y muestra productos desde la API
 * - Filtros por precio
 * - Ordenamiento (precio, relevancia)
 * - Búsqueda en tiempo real
 */

let currentProductsArray = [];
let filteredProductsArray = [];
const SORT_MAP = { asc: "priceAsc", desc: "priceDesc", count: "relevance" };

// Renderiza la lista de productos en el DOM
function showProductsList() {
    const productList = document.getElementById("products-list-container");
    if (!productList) return;

    let htmlContentToAppend = "";

    for (const product of filteredProductsArray) {
        htmlContentToAppend += `
      <div class="product-card" onclick="setProductID(${product.id})">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="sold-badge">${product.soldCount} vendidos</div>
        </div>
        <div class="product-content">
          <div class="product-header">
            <h4 class="product-title">${product.name}</h4>
            <p class="product-description">${product.description}</p>
          </div>
          <div class="product-price">${product.currency} ${product.cost}</div>
          <div class="product-action">
            <button class="product-btn">Ver detalles</button>
          </div>
        </div>
      </div>
    `;
    }
    productList.innerHTML = htmlContentToAppend;
}

// Ordena los productos según el criterio especificado
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

// Filtra productos por rango de precio mínimo y máximo
function filtrarPorPrecio(minID, maxID) {
    let min = parseInt(document.getElementById(minID)?.value);
    let max = parseInt(document.getElementById(maxID)?.value);

    if (isNaN(min)) min = undefined;
    if (isNaN(max)) max = undefined;

    filteredProductsArray = currentProductsArray.filter(product => {
        return (min === undefined || product.cost >= min) &&
            (max === undefined || product.cost <= max);
    });

    const sortOption = document.querySelector('input[name="options"]:checked');
    if (sortOption) {
        ordenarProductos(SORT_MAP[sortOption.value] || "relevance");
    } else {
        showProductsList();
    }
}

// Limpia los filtros de precio y resetea la lista de productos
function limpiarFiltros(minID, maxID) {
    const minEl = document.getElementById(minID);
    const maxEl = document.getElementById(maxID);
    if (minEl) minEl.value = "";
    if (maxEl) maxEl.value = "";

    filteredProductsArray = [...currentProductsArray];
    ordenarProductos("relevance");
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

function loadProducts() {
    const catID = localStorage.getItem(STORAGE_KEYS.CAT_ID);
    const productListContainer = document.getElementById("products-list-container");
    function fetchProductsForCatId(resolvedCatId) {
        const API_URL = PRODUCTS_URL + resolvedCatId + EXT_TYPE;
        getJSONData(API_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentProductsArray = resultObj.data.products;
                filteredProductsArray = [...currentProductsArray];

                if (resultObj.data && resultObj.data.catName) {
                    localStorage.setItem(STORAGE_KEYS.CAT_NAME, resultObj.data.catName);
                }

                const categoryTitleMobile = document.getElementById("category-title-mobile");
                const categoryTitleDesktop = document.getElementById("category-title-desktop");
                const categorySubtitleDesktop = document.getElementById("category-subtitle-desktop");

                const catNameFromApi = resultObj.data.catName || localStorage.getItem(STORAGE_KEYS.CAT_NAME) || '';
                if (categoryTitleMobile) categoryTitleMobile.textContent = catNameFromApi;
                if (categoryTitleDesktop) categoryTitleDesktop.textContent = catNameFromApi;
                if (categorySubtitleDesktop) {
                    categorySubtitleDesktop.textContent = `Verás aquí todos los ${catNameFromApi.toLowerCase()} del sitio.`;
                }

                const breadcrumb = document.getElementById("breadcrumb-container");
                if (breadcrumb) {
                    breadcrumb.innerHTML = `
                    <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${catNameFromApi}</li>`;
                }

                ordenarProductos("relevance");
                initSort();
            } else {
                productListContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error al cargar los productos. Intente nuevamente.
                </div>`;
            }
        });
    }

    if (!catID) {
        productListContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error: No se seleccionó ninguna categoría.
            </div>`;
        return;
    }

    const maybeNumeric = Number(catID);
    if (!isNaN(maybeNumeric) && String(maybeNumeric).trim() !== '') {
        fetchProductsForCatId(maybeNumeric);
        return;
    }

    const storedCatName = localStorage.getItem(STORAGE_KEYS.CAT_NAME) || catID;
    getJSONData(CATEGORIES_URL).then(function (catRes) {
        if (catRes.status === 'ok' && Array.isArray(catRes.data)) {
            const found = catRes.data.find(c => {
                const name = (c.name || c.catName || '').toString().toLowerCase();
                return name === storedCatName.toString().toLowerCase();
            });
            if (found && (found.id !== undefined)) {
                localStorage.setItem(STORAGE_KEYS.CAT_ID, String(found.id));
                fetchProductsForCatId(found.id);
                return;
            }
        }

        productListContainer.innerHTML = `
            <div class="alert alert-warning" role="alert">
                No se pudo cargar la categoría seleccionada. Serás redirigido a la página de categorías.
            </div>`;
        setTimeout(() => { window.location.href = 'categories.html'; }, 1800);
    }).catch(err => {
        productListContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error al cargar los productos. Intente nuevamente.
            </div>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (!verificarUsuario()) return;

    loadProducts();
    initFilters();
    initSearchBar();
    initDarkMode();
});