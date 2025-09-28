// Variables Globales
let currentProductsArray = [];
let filteredProductsArray = [];
const SORT_MAP = { asc: "priceAsc", desc: "priceDesc", count: "relevance" };

// Funciones Principales

// Guarda el ID de un producto en localStorage y redirige a la página de product-info
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

// Muestra la lista de productos en el contenedor principal
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

// Ordena los productos según un criterio y actualiza la vista
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

// Filtra los productos por un rango de precio
function filtrarPorPrecio(minID, maxID) {
  let min = parseInt(document.getElementById(minID)?.value);
  let max = parseInt(document.getElementById(maxID)?.value);

  if (isNaN(min)) min = undefined;
  if (isNaN(max)) max = undefined;

  filteredProductsArray = currentProductsArray.filter(product => {
    return (min === undefined || product.cost >= min) &&
      (max === undefined || product.cost <= max);
  });

  // Re-aplica el orden seleccionado
  const sortOption = document.querySelector('input[name="options"]:checked');
  if (sortOption) {
    ordenarProductos(SORT_MAP[sortOption.value] || "relevance");
  } else {
    showProductsList();
  }
}

// Limpia los filtros de precio y muestra todos los productos
function limpiarFiltros(minID, maxID) {
  const minEl = document.getElementById(minID);
  const maxEl = document.getElementById(maxID);
  if (minEl) minEl.value = "";
  if (maxEl) maxEl.value = "";

  filteredProductsArray = [...currentProductsArray];
  ordenarProductos("relevance");
}

function addClick(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", handler);
}

// Inicializaciones

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
  const catID = localStorage.getItem("catID");
  const productListContainer = document.getElementById("products-list-container");

  if (!catID) {
    productListContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Error: No se seleccionó ninguna categoría.
      </div>`;
    return;
  }

  const API_URL = PRODUCTS_URL + catID + EXT_TYPE;
  getJSONData(API_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsArray = resultObj.data.products;
      filteredProductsArray = [...currentProductsArray];

      localStorage.setItem("catName", resultObj.data.catName);

      const categoryTitleMobile = document.getElementById("category-title-mobile");
      const categoryTitleDesktop = document.getElementById("category-title-desktop");
      const categorySubtitleDesktop = document.getElementById("category-subtitle-desktop");

      if (categoryTitleMobile) categoryTitleMobile.textContent = resultObj.data.catName;
      if (categoryTitleDesktop) categoryTitleDesktop.textContent = resultObj.data.catName;
      if (categorySubtitleDesktop) {
        categorySubtitleDesktop.textContent = `Verás aquí todos los ${resultObj.data.catName.toLowerCase()} del sitio.`;
      }

      const breadcrumb = document.getElementById("breadcrumb-container");
      if (breadcrumb) {
        breadcrumb.innerHTML = `
          <li class="breadcrumb-item"><a href="index.html">Home</a></li>
          <li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
          <li class="breadcrumb-item active" aria-current="page">${resultObj.data.catName}</li>`;
      }

      ordenarProductos("relevance");
      initSort();
    } else {
      console.error("Error al cargar productos:", resultObj.data);
      productListContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Error al cargar los productos. Intente nuevamente.
        </div>`;
    }
  });
}

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  initFilters();
  initSearchBar();
  initDarkMode();
  initLanguageSelector();
});
