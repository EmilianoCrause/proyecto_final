// Variable global donde vamos a guardar la lista de productos de la categoría actual
let currentProductsArray = [];
let filteredProductsArray = [];

// Función para redirigir a la página de detalles del producto
// Guardamos el id del producto en localStorage para que product-info.html sepa cuál mostrar
function setProductID(id) {
    localStorage.setItem("productID", id); // guardamos el id
    window.location = "product-info.html"; // redirigimos a la página de detalles
}

// Función para mostrar la lista de productos en la página
function showProductsList() {
    let htmlContentToAppend = ""; // acá vamos a ir armando todo el HTML

    // Recorremos cada producto del array global
    for (let i = 0; i < filteredProductsArray.length; i++) {
        let product = filteredProductsArray[i];

        // Agregamos un bloque de HTML por cada producto
        // Uso template literals para insertar datos dinámicos
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

    // Insertamos todo el HTML generado dentro del contenedor de productos
    document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
}

// Filtrar productos por rango de precio
function filtrarPorPrecio(minID, maxID) {
    let min = parseInt(document.getElementById(minID).value);
    let max = parseInt(document.getElementById(maxID).value);

    if (isNaN(min)) min = undefined;
    if (isNaN(max)) max = undefined;

    filteredProductsArray = currentProductsArray.filter(product => {
        return (min === undefined || product.cost >= min) && (max === undefined || product.cost <= max);
    });
    showProductsList();
}

// Ordenar productos según criterio (precio asc/desc o relevancia)
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

// Limpiar filtros
function limpiarFiltros(minID, maxID) {
    document.getElementById(minID).value = "";
    document.getElementById(maxID).value = "";
    filteredProductsArray = [...currentProductsArray];
    showProductsList();
}

// Esperamos a que todo el DOM esté cargado antes de ejecutar nuestro código
document.addEventListener("DOMContentLoaded", function (e) {
    // Obtenemos catID del localStorage, que se guardó cuando el usuario seleccionó una categoría
    const catID = localStorage.getItem("catID");

    // Si no hay catID, mostramos un mensaje de error y salimos de la función
    if (!catID) {
        document.getElementById("products-list-container").innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error: No se seleccionó ninguna categoría.
            </div>
        `;
        return; // salimos para que no siga el resto del código
    }

    // Armamos la URL de la API usando la constante PRODUCTS_URL + catID + EXT_TYPE
    const API_URL = PRODUCTS_URL + catID + EXT_TYPE;

    // Usamos la función getJSONData (que viene de init.js) para traer los datos de la API
    getJSONData(API_URL).then(function (resultObj) {
        // Verificamos si la API respondió correctamente
        if (resultObj.status === "ok") {
            // Guardamos los productos en la variable global
            currentProductsArray = resultObj.data.products;
            filteredProductsArray = [...currentProductsArray];

            // Títulos dinámicos: actualizamos tanto móvil como escritorio
            const categoryTitleMobile = document.getElementById("category-title-mobile");
            const categoryTitleDesktop = document.getElementById("category-title-desktop");
            const categorySubtitleDesktop = document.getElementById("category-subtitle-desktop");

            if (categoryTitleMobile) {
                categoryTitleMobile.textContent = resultObj.data.catName; // título para móvil
            }
            
            if (categoryTitleDesktop && categorySubtitleDesktop) {
                categoryTitleDesktop.textContent = resultObj.data.catName; // título escritorio
                categorySubtitleDesktop.textContent = 
                    `Verás aquí todos los ${resultObj.data.catName.toLowerCase()} del sitio.`; // subtítulo escritorio
            }

            // Mostramos la lista de productos usando la función que creamos antes
            showProductsList();
        } else {
            // Si hubo error en la API, lo mostramos en consola y también un mensaje de error en la página
            console.error('Error al cargar productos:', resultObj.data);
            document.getElementById("products-list-container").innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error al cargar los productos. Intente nuevamente.
                </div>
            `;
        }
    });

    // Listeners escritorio
    document.getElementById("rangeFilterPrice").addEventListener("click", () => filtrarPorPrecio("rangeFilterPriceMin", "rangeFilterPriceMax"));
    document.getElementById("clearRangeFilter").addEventListener("click", () => limpiarFiltros("rangeFilterPriceMin", "rangeFilterPriceMax"));

    document.getElementById("sortAsc").addEventListener("click", () => ordenarProductos("priceAsc"));
    document.getElementById("sortDesc").addEventListener("click", () => ordenarProductos("priceDesc"));
    document.getElementById("sortByCount").addEventListener("click", () => ordenarProductos("relevance"));

});
