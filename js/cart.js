document.addEventListener('DOMContentLoaded', async function() {
    // ======== MODO OSCURO ========
    const darkToggle = document.getElementById('theme-toggle-checkbox');
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkToggle.checked = true;
    }
    darkToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkToggle.checked);
        localStorage.setItem('darkMode', darkToggle.checked);
    });

    // ======== CARRITO ========
    const contenedorLista = document.getElementById("lista-art");
    const inputSubtot = document.getElementById('input-subtot');

    // Obtener carrito del localStorage
    const listCarrito = JSON.parse(localStorage.getItem("carrito"));

    // Si el carrito está vacío
    if (!listCarrito || listCarrito.length === 0) {
        contenedorLista.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
                No hay artículos disponibles.
            </div>
        `;
        return;
    }

    // Crear lista de artículos
    const lista = document.createElement("ul");
    lista.classList.add("list-group", "mb-3");

    // Evita error si el spinner no existe en cart.html
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
        // Traer todos los productos en base a los productID del carrito
        const productos = await Promise.all(
            listCarrito.map(item => {
                const url = PRODUCT_INFO_URL + item.productID + EXT_TYPE;
                return fetch(url)
                    .then(r => r.json())
                    .then(data => ({ data, item }));
            })
        );
        
        let subTot = 0;

        // Mostrar productos en la lista
        productos.forEach(({ data: product, item }) => {
    const itemTot = product.cost * item.cantidad;
    subTot += itemTot;

    const li = document.createElement("li");
    li.classList.add(
        "list-group-item",
        "position-relative",  // necesario para que el botón absoluto se refiera a este li
        "d-flex",
        "align-items-center",
        "gap-3",
        "cart-item"
    );

    li.innerHTML = `
        <img src="${product.images[0]}" alt="${product.name}" 
            style="width:80px; height:80px; object-fit:cover; border-radius:4px; border:1px solid #ddd;">

        <div class="flex-grow-1 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
                <p class="mb-1">${product.name}</p>
                <p>Cantidad: x${item.cantidad}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0" style="max-width:280px;">
                    ${product.description.length > 40 ? product.description.slice(0, 40) + "…" : product.description}
                </p>
                <p>${product.currency} ${itemTot.toLocaleString()}</p>
            </div>
        </div>

        <button class="btn btn-sm btn-cerrar">
            <i class="bi bi-x-lg"></i>
        </button>
    `;

    lista.appendChild(li);
});


        // Insertar lista en el contenedor
        contenedorLista.appendChild(lista);

        // Mostrar subtotal
        inputSubtot.textContent = subTot.toLocaleString();

        // === Evento para eliminar producto ===
        document.querySelectorAll('.btn-cerrar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const nuevoCarrito = listCarrito.filter(p => p.productID != id);
                localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
                e.currentTarget.closest('li').remove();
                location.reload(); // refresca para recalcular subtotal
            });
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        contenedorLista.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                Ocurrió un error al cargar los productos.
            </div>
        `;
    } finally {
        safeHideSpinner();
    }
});
