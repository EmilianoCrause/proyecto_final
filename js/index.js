/**
 * index.js
 * Maneja la página principal:
 * - Enlaces directos a categorías principales
 * - Carousel de productos destacados usando Swiper.js
 * - Inicialización de modo oscuro e idioma
 */

document.addEventListener("DOMContentLoaded", async function () {
    if (!verificarUsuario()) return;

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

    initDarkMode();
});

async function initRelevantProductsCarousel() {
    const carousel = document.getElementById("relevant-products-carousel");
    if (!carousel) return;

    const categoryInfo = {
        101: "Autos",
        102: "Juguetes",
        103: "Muebles",
        105: "Computadoras"
    };

    const categoryIds = [101, 102, 103, 105];

    try {
        const promises = categoryIds.map(id => getJSONData(PRODUCTS_URL + id + EXT_TYPE));
        const results = await Promise.all(promises);

        let products = [];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const catId = categoryIds[i];
            if (result.status === "ok" && result.data.products) {
                const productsWithCategory = result.data.products.map(p => ({
                    ...p,
                    categoryId: catId,
                    categoryName: categoryInfo[catId]
                }));
                products.push(...productsWithCategory);
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
        carousel.innerHTML = '<p class="text-muted">No se pudieron cargar los productos relevantes.</p>';
    }
}

function renderCarouselProducts(container, products) {
    if (!products.length) {
        container.innerHTML = '<p class="text-muted">No hay productos para mostrar.</p>';
        return;
    }

    const productHtml = products.map(p => `
        <div class="swiper-slide product-card cursor-pointer" 
             data-id="${p.id}"
             data-category-id="${p.categoryId || ''}"
             data-category-name="${p.categoryName || ''}">
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
            const categoryId = this.dataset.categoryId;
            const categoryName = this.dataset.categoryName;
            
            localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
            if (categoryId) {
                localStorage.setItem(STORAGE_KEYS.CAT_ID, categoryId);
            }
            if (categoryName) {
                localStorage.setItem(STORAGE_KEYS.CAT_NAME, categoryName);
            }
            
            window.location = "product-info.html";
        });
    });
}