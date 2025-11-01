let currentCategoriesArray = [];
let filteredCategoriesArray = [];
const SORT_MAP = { nameAsc: 'nameAsc', nameDesc: 'nameDesc', relevance: 'relevance' };

<<<<<<< HEAD
=======
function setCatID(id) {
    localStorage.setItem(STORAGE_KEYS.CAT_ID, id);
    window.location = "products.html";
}

>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c
function sortCategories(criteria) {
    if (criteria === 'nameAsc') {
        filteredCategoriesArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'nameDesc') {
        filteredCategoriesArray.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === 'relevance') {
        filteredCategoriesArray.sort((a, b) => b.productCount - a.productCount);
    }
}

function showCategoriesList() {
    const container = document.getElementById("cat-list-container");
    if (!container) return;

    let htmlContentToAppend = "";
    for (const category of filteredCategoriesArray) {
        htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="product-card"> <!-- Usamos la clase de producto -->
                <div class="product-image-wrapper">
                    <img src="${category.imgSrc}" alt="${category.name}" class="product-image">
                    <!-- Usamos el "sold-badge" para la cantidad de productos -->
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

function filterAndShow() {
    const minCount = parseInt(document.getElementById('rangeFilterCountMin').value) || 0;
    const maxCount = parseInt(document.getElementById('rangeFilterCountMax').value) || Infinity;

    filteredCategoriesArray = currentCategoriesArray.filter(category =>
        category.productCount >= minCount && category.productCount <= maxCount
    );

    const sortOption = document.querySelector('input[name="sortOptions"]:checked')?.value || 'relevance';
    sortCategories(sortOption);
    showCategoriesList();
}
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

<<<<<<< HEAD
=======
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        // Sincronizar estado inicial
        if (document.documentElement.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode");
            themeToggle.checked = true;
        }
        // Escuchar cambios
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

initLanguageSelector();

document.addEventListener("DOMContentLoaded", function () {
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            filterAndShow();
            initEventListeners();
        } else {
            console.error("Error al cargar categorías:", resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
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

function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        // Sincronizar estado inicial
        if (document.documentElement.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode");
            themeToggle.checked = true;
        }
        // Escuchar cambios
        themeToggle.addEventListener("change", () => {
            const isDark = themeToggle.checked;
            if (isDark) {
                document.documentElement.classList.add("dark-mode");
                document.body.classList.add("dark-mode");
            } else {
                document.documentElement.classList.remove("dark-mode");
                document.body.classList.remove("dark-mode");
            }
            localStorage.setItem("darkMode", isDark);
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

initLanguageSelector();

>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c
document.addEventListener("DOMContentLoaded", function () {
    if (!verificarUsuario()) return;
    
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            filterAndShow();
            initEventListeners();
        } else {
            console.error("Error al cargar categorías:", resultObj.data);
        }
    });

    initDarkMode();
    initLanguageSelector();

    const breadcrumb = document.getElementById("breadcrumb-container");
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item" > <a href="index.html">Home</a></li >
            <li class="breadcrumb-item active" aria-current="page">Categorías</li>
        `;
    }
});