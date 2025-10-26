document.addEventListener('DOMContentLoaded', async function () {
    // ======== MODO OSCURO ========
    const darkToggle = document.getElementById('theme-toggle-checkbox');
    if (darkToggle && localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkToggle.checked = true;
    }
    if (darkToggle) {
        darkToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', darkToggle.checked);
            localStorage.setItem('darkMode', darkToggle.checked);
        });
    }

    // ======== ELEMENTOS DEL DOM ========
    const contenedorLista = document.getElementById("lista-art");
    const inputSubtot = document.getElementById("input-subtot");
    const badge = document.getElementById("cart-badge");

    // ======== LEER CARRITO DEL STORAGE ========
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Carrito vacío
    if (!cart.length) {
        contenedorLista.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
                No hay artículos disponibles.
            </div>
        `;
        if (badge) badge.textContent = "0";
        if (inputSubtot) inputSubtot.textContent = "0";
        return;
    }

    // ======== SPINNER SEGURO ========
    const safeShowSpinner = () => {
        const spinner = document.getElementById("spinner-wrapper");
        if (spinner) spinner.style.display = "block";
    };
    const safeHideSpinner = () => {
        const spinner = document.getElementById("spinner-wrapper");
        if (spinner) spinner.style.display = "none";
    };

    safeShowSpinner();

    try {
        const detalles = await Promise.all(
            cart.map(item => {
                const url = PRODUCT_INFO_URL + item.id + EXT_TYPE;
                return fetch(url)
                    .then(r => r.json())
                    .then(data => ({ info: data }));
            })
        );

      
        const lista = document.createElement("ul");
        lista.classList.add("list-group", "mb-3");

        // Función para recalcular totales generales
        function recalcularTotales() {
            let totalCarrito = 0;
            let totalCantidad = 0;

            cart.forEach((cartItem, ids) => {
                const prodInfo = detalles[ids].info;
                const cantidad = cartItem.count;
                totalCantidad += cantidad;
                totalCarrito += prodInfo.cost * cantidad;
            });

            inputSubtot.textContent = totalCarrito.toLocaleString();
            if (badge) {
                badge.textContent = totalCantidad;
            }
        }

        //Render de cada producto en el carrito
        cart.forEach((cartItem, index) => {
            const prodInfo = detalles[index].info;
            const itemSubtotal = prodInfo.cost * cartItem.count;

            const descripcionCorta =
                prodInfo.description.length > 40
                    ? prodInfo.description.slice(0, 40) + "…"
                    : prodInfo.description;

            const li = document.createElement("li");
            li.classList.add(
                "list-group-item",
                "position-relative",
                "d-flex",
                "align-items-center",
                "gap-3",
                "cart-item"
            );

            li.innerHTML = `
                <img src="${prodInfo.images[0]}" alt="${prodInfo.name}"
                    style="width:80px; height:80px; object-fit:cover; border-radius:4px; border:1px solid #ddd;">

                <div class="flex-grow-1 d-flex flex-column w-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <p class="mb-1">${prodInfo.name}</p>

                        <div class="d-flex align-items-center gap-2">
                            <label class="mb-0 small">Cant:</label>
                            <input
                                type="number"
                                min="1"
                                value="${cartItem.count}"
                                class="form-control form-control-sm cantidad-input"
                                style="width:70px"
                                data-index="${index}">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <p class="mb-0" style="max-width:280px;">${descripcionCorta}</p>
                        <p class="mb-0 item-subtotal" data-index="${index}">
                            ${prodInfo.currency} ${itemSubtotal.toLocaleString()}
                        </p>
                    </div>
                </div>

                <button class="btn btn-sm btn-cerrar" data-index="${index}">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;

            lista.appendChild(li);
        });

        contenedorLista.innerHTML = "";
        contenedorLista.appendChild(lista);

        recalcularTotales();

        //Cambiar cantidad en vivo
        lista.addEventListener("input", (e) => {
            if (!e.target.classList.contains("cantidad-input")) return;

            const ids = parseInt(e.target.dataset.index, 10);
            let nuevaCantidad = parseInt(e.target.value, 10);

            if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                nuevaCantidad = 1;
            }
            e.target.value = nuevaCantidad;

            // actualizar carrito en memoria
            cart[ids].count = nuevaCantidad;

            // guardar carrito actualizado en localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            const prodInfo = detalles[ids].info;
            const nuevoSubtotal = prodInfo.cost * nuevaCantidad;
            const subElem = lista.querySelector(`.item-subtotal[data-index="${ids}"]`);
            if (subElem) {
                subElem.textContent = `${prodInfo.currency} ${nuevoSubtotal.toLocaleString()}`;
            }

            recalcularTotales();
        });

        // ======== Eliminar producto ========
        lista.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-cerrar");
            if (!btn) return;

            const ids = parseInt(btn.dataset.index, 10);

            cart.splice(ids, 1);

            detalles.splice(ids, 1);

            //guardar carrito actualizado
            localStorage.setItem("cart", JSON.stringify(cart));

            btn.closest("li").remove();

            if (!cart.length) {
                contenedorLista.innerHTML = `
                    <div class="alert alert-info text-center" role="alert">
                        No hay artículos disponibles.
                    </div>
                `;
                if (badge) badge.textContent = "0";
                inputSubtot.textContent = "0";
                return;
            }

            //reindexar todos los data-index de inputs / subtotales / botones
            lista.querySelectorAll(".cantidad-input").forEach((input, newIds) => {
                input.dataset.index = newIds;
            });
            lista.querySelectorAll(".item-subtotal").forEach((p, newIds) => {
                p.dataset.index = newIds;
            });
            lista.querySelectorAll(".btn-cerrar").forEach((b, newIds) => {
                b.dataset.index = newIds;
            });

            recalcularTotales();
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        contenedorLista.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                Ocurrió un error al cargar los productos.
            </div>
        `;
        if (badge) badge.textContent = "0";
        if (inputSubtot) inputSubtot.textContent = "0";
    } finally {
        safeHideSpinner();
    }
});
