// Variable global donde vamos a guardar la lista de productos de la categoría actual
let currentProductsArray = [];
let filteredProductsArray = [];

// Función para redirigir a la página de detalles del producto
// Guardamos el id del producto en localStorage para que product-info.html sepa cuál mostrar
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

// Función para mostrar la lista de productos en la página
function showProductsList() {
  let htmlContentToAppend = "";

  // Recorremos cada producto del array filtrado
  for (let i = 0; i < filteredProductsArray.length; i++) {
    const product = filteredProductsArray[i];

    htmlContentToAppend += `
      <div onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
        <div class="row">
          <div class="col-12 col-md-3">
            <img src="${product.image}" alt="${product.name}" class="img-fluid img-thumbnail mb-3 mb-md-0">
          </div>
          <div class="col-12 col-md-9">
            <h4 class="mb-2">${product.name}</h4>
            <p class="mb-2">${product.description}</p>
            <p class="text-end text-md-start fw-bold">
              ${product.currency} ${product.cost}
            </p>
            <small class="text-muted d-block text-md-start text-end">
              ${product.soldCount} vendidos
            </small>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

// barra de busqueda

document.getElementById("btn-buscar").addEventListener("click", function() {
  const searchTerm = document.getElementById("search-bar").value.toLowerCase();
  filteredProductsArray = currentProductsArray.filter(product => product.name.toLowerCase().includes(searchTerm));
  showProductsList();
});

// --- Filtros y orden ---

function filtrarPorPrecio(minID, maxID) {
  let min = parseInt(document.getElementById(minID)?.value);
  let max = parseInt(document.getElementById(maxID)?.value);

  if (isNaN(min)) min = undefined;
  if (isNaN(max)) max = undefined;

  filteredProductsArray = currentProductsArray.filter(product => {
    return (min === undefined || product.cost >= min) && (max === undefined || product.cost <= max);
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

      // Títulos dinámicos (si existen)
      const categoryTitleMobile = document.getElementById("category-title-mobile");
      const categoryTitleDesktop = document.getElementById("category-title-desktop");
      const categorySubtitleDesktop = document.getElementById("category-subtitle-desktop");

      if (categoryTitleMobile) {
        categoryTitleMobile.textContent = resultObj.data.catName;
      }
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

  // --- Listeners escritorio ---
  addClick("rangeFilterPrice", () => filtrarPorPrecio("rangeFilterPriceMin", "rangeFilterPriceMax"));
  addClick("clearRangeFilter", () => limpiarFiltros("rangeFilterPriceMin", "rangeFilterPriceMax"));
  addClick("sortAsc", () => ordenarProductos("priceAsc"));
  addClick("sortDesc", () => ordenarProductos("priceDesc"));
  addClick("sortByCount", () => ordenarProductos("relevance"));

  // --- Listeners móvil (opcionales; solo se agregan si existen) ---
  addClick("rangeFilterPriceMobile", () => filtrarPorPrecio("rangeFilterPriceMinMobile", "rangeFilterPriceMaxMobile"));
  addClick("clearRangeFilterMobile", () => limpiarFiltros("rangeFilterPriceMinMobile", "rangeFilterPriceMaxMobile"));
  addClick("sortAscMobile", () => ordenarProductos("priceAsc"));
  addClick("sortDescMobile", () => ordenarProductos("priceDesc"));
  addClick("sortByCountMobile", () => ordenarProductos("relevance"));
});
