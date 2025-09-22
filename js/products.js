// Variable global donde vamos a guardar la lista de productos de la categoría actual
let currentProductsArray = [];
let filteredProductsArray = [];

// Función para redirigir a la página de detalles del producto
function setProductID(id) {
  localStorage.setItem("productID", id); // guardamos el id del producto
  window.location = "product-info.html";
}

// Función para mostrar la lista de productos en la página
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

// --- Inicio ---
document.addEventListener("DOMContentLoaded", function () {
  // Obtenemos catID del localStorage
  const catID = localStorage.getItem("catID");
  const langBtn = document.querySelector('.lang-btn');
  const langSelect = document.getElementById('idioma');

  if (!catID) {
    document.getElementById("products-list-container").innerHTML = `
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

      // Guardamos nombre de categoría
      localStorage.setItem("catName", resultObj.data.catName);

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

    // --- BÚSQUEDA: botón "clear" aparece sólo cuando hay texto ---
  const searchBar = document.getElementById("search-bar");
  const clearBtn = document.getElementById("clear-search");

  if (searchBar && clearBtn) {
    // ocultamos al inicio
    clearBtn.style.display = "none";

    // evento input: filtra y muestra/oculta el botón
    searchBar.addEventListener("input", () => {
      const searchTerm = searchBar.value.trim().toLowerCase();

      // filtrar productos
      if (searchTerm === "") {
        // si no hay texto, mostramos todos
        filteredProductsArray = [...currentProductsArray];
      } else {
        filteredProductsArray = currentProductsArray.filter(product =>
          product.name.toLowerCase().includes(searchTerm)
        );
      }
      showProductsList();

      // mostrar u ocultar el botón limpiar
      clearBtn.style.display = searchTerm ? "block" : "none";
    });

    // clic en limpiar: vacía, restablece y oculta el botón
    clearBtn.addEventListener("click", () => {
      searchBar.value = "";
      filteredProductsArray = [...currentProductsArray];
      showProductsList();
      clearBtn.style.display = "none";
      searchBar.focus();
    });
  }

  if (langBtn && langSelect) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita propagación
      langSelect.style.display = langSelect.style.display === "block" ? "none" : "block";
    });
  }

      // Ocultar selector al hacer clic fuera de él
    document.addEventListener('click', () => {
        langSelect.style.display = 'none';
    });

    // Evitar que se oculte al hacer clic dentro del selector
    langSelect.addEventListener('click', (e) => {
        e.stopPropagation(); // Detener la propagación del evento
    });
    
  });

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
