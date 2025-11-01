document.addEventListener("DOMContentLoaded", async function () {
<<<<<<< HEAD
    // Verificar que el usuario esté logueado
    if (!verificarUsuario()) return;
=======
    let usuSession = sessionStorage.getItem(STORAGE_KEYS.USUARIO);
    let usuLocal = localStorage.getItem(STORAGE_KEYS.USUARIO);
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c

    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const autos = document.getElementById("autos");
        const juguetes = document.getElementById("juguetes");
        const muebles = document.getElementById("muebles");

        if (autos) {
            autos.addEventListener("click", function () {
                localStorage.setItem(STORAGE_KEYS.CAT_ID, 101);
                window.location = "products.html";
            });
        }
        if (juguetes) {
            juguetes.addEventListener("click", function () {
                localStorage.setItem(STORAGE_KEYS.CAT_ID, 102);
                window.location = "products.html";
            });
        }
        if (muebles) {
            muebles.addEventListener("click", function () {
                localStorage.setItem(STORAGE_KEYS.CAT_ID, 103);
                window.location = "products.html";
            });
        }

        await initRelevantProductsCarousel();
    }
<<<<<<< HEAD
=======
    // Elegir usuario existente
    const savedUser = usuLocal || usuSession;

    // Agregar eventos a las categorías
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem(STORAGE_KEYS.CAT_ID, 101);
        window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem(STORAGE_KEYS.CAT_ID, 102);
        window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem(STORAGE_KEYS.CAT_ID, 103);
        window.location = "products.html";
    });
>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c

    initDarkMode();
    initLanguageSelector();
});

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

>>>>>>> 439a1e7417eefbe4ca7e3f1f56b5c18e097e7e8c
async function initRelevantProductsCarousel() {
    const carousel = document.getElementById("relevant-products-carousel");
    if (!carousel) return;

    const categoryIds = [101, 102, 103, 105];

    try {
        const promises = categoryIds.map(id => getJSONData(PRODUCTS_URL + id + EXT_TYPE));
        const results = await Promise.all(promises);

        let products = [];
        for (const result of results) {
            if (result.status === "ok" && result.data.products) {
                products.push(...result.data.products);
            }
        }

        products.sort(() => 0.5 - Math.random());

        if (products.length > 0) {
            renderCarouselProducts(carousel, products);

            new Swiper('.swiper', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 50,
                    },
                }
            });
        }

    } catch (error) {
        console.error("Error fetching relevant products:", error);
        carousel.innerHTML = '<p class="text-muted">No se pudieron cargar los productos relevantes.</p>';
    }
}

function renderCarouselProducts(container, products) {
    if (!products.length) {
        container.innerHTML = '<p class="text-muted">No hay productos para mostrar.</p>';
        return;
    }

    const productHtml = products.map(p => `
        <div class="swiper-slide product-card cursor-pointer" data-id="${p.id}">
            <div class="product-image-wrapper">
                <img src="${p.image || ''}" class="product-image">
            </div>
            <div class="product-content">
                <h5 class="product-title text-truncate">${p.name || ''}</h5>
                <p class="product-price">${p.currency ? p.currency + ' ' : ''}${p.cost !== undefined ? p.cost : ''}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = productHtml;

    container.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", function () {
            const id = this.dataset.id;
            localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
            window.location = "product-info.html";
        });
    });
}