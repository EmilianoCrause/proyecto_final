document.addEventListener('DOMContentLoaded', async function () {
    const contenedorLista = document.getElementById("lista-art");
    const inputSubtot = document.getElementById("input-subtot");
    const badge = document.getElementById("cart-badge");
    const subtotalLinea = document.getElementById("subtot-lin");
    const btnComprar = document.getElementById("btn-comprar");

    if (subtotalLinea) {
        subtotalLinea.style.display = "none";
        subtotalLinea.style.visibility = "hidden";
    }
    if (btnComprar) {
        btnComprar.style.display = "none";
        btnComprar.style.visibility = "hidden";
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const shippingSelect = document.getElementById("shipping-type");
    const depInput = document.getElementById("dep");
    const locInput = document.getElementById("loc");
    const calleInput = document.getElementById("calle");
    const numeroInput = document.getElementById("numero");
    const esquinaInput = document.getElementById("esquina");

    const paymentMethod = document.getElementById("payment-method");
    const paymentFieldsBox = document.getElementById("payment-fields");
    const btnFinalizar = document.getElementById("btn-finalizar");
    const listaArt = document.getElementById("lista-art");

    // Feedback en el Tab Resumen
    const resumenTab = document.getElementById("resumenTab");
    const feedbackDiv = document.createElement("div");
    feedbackDiv.id = "checkout-feedback";
    feedbackDiv.className = "mt-3";
    resumenTab.appendChild(feedbackDiv);

    function showFeedback(type, msg) {
        feedbackDiv.innerHTML = "";
        const alert = document.createElement("div");
        alert.className = "alert alert-" + type;
        alert.textContent = msg;
        feedbackDiv.appendChild(alert);
    }

    function renderPaymentFields() {
        paymentFieldsBox.innerHTML = "";

        if (paymentMethod.value === "card") {
            paymentFieldsBox.innerHTML = `
                <input id="card-name"   class="form-control mb-2" placeholder="Nombre completo">
                <input id="card-number" class="form-control mb-2" placeholder="Número de tarjeta">
                <div class="d-flex gap-2 mb-2">
                    <input id="card-cvv"  class="form-control" placeholder="CVV">
                    <input id="card-exp"  class="form-control" placeholder="Vencimiento">
                </div>
            `;
        } else {
            paymentFieldsBox.innerHTML = `
                <input id="transfer-name" class="form-control mb-2" placeholder="Titular de la cuenta">
                <input id="transfer-bank" class="form-control mb-2" placeholder="Banco">
                <input id="transfer-cbu"  class="form-control mb-2" placeholder="Número de cuenta / CBU">
            `;
        }
    }

    paymentMethod.addEventListener("change", renderPaymentFields);
    renderPaymentFields(); 

    // 1) Dirección no vacía
    function validateAddress() {
        const campos = [depInput, locInput, calleInput, numeroInput, esquinaInput];
        return campos.every(input => input && input.value.trim() !== "");
    }

    // 2) Forma de envío seleccionada
    function validateShipping() {
        return shippingSelect.value !== "" && !isNaN(Number(shippingSelect.value));
    }

    // 3) Cantidad para cada producto definida y > 0
    function validateQuantities() {
        const ctnInputs = listaArt.querySelectorAll("input[type='number']");

        if (ctnInputs.length === 0) {
            return { ok: false, msg: "Tu carrito está vacío. Agregá productos antes de finalizar la compra." };
        }

        for (const input of ctnInputs) {
            const val = Number(input.value);
            if (!val || val <= 0) {
                return { ok: false, msg: "La cantidad para cada producto debe estar definida y ser mayor a 0." };
            }
        }

        return { ok: true };
    }

    // 4 y 5) Forma de pago seleccionada + campos llenos
    function validatePayment() {
        if (!paymentMethod.value) {
            return { ok: false, msg: "Seleccioná una forma de pago." };
        }
        const inputs = paymentFieldsBox.querySelectorAll("input");
        if (inputs.length === 0) {
            return { ok: false, msg: "Completá los datos de la forma de pago seleccionada." };
        }
        for (const input of inputs) {
            if (input.value.trim() === "") {
                return { ok: false, msg: "Completá todos los campos de la forma de pago seleccionada." };
            }
        }
        return { ok: true };
    }
   //  Botones "Continuar" de Envío y Pago
  const btnEnvioContinuar = document.getElementById("btn-envio-continuar");
  const btnPagoContinuar  = document.getElementById("btn-pago-continuar");

  if (btnEnvioContinuar) {
    btnEnvioContinuar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const errores = [];

      if (!validateAddress()) {
        errores.push("Completá todos los campos de la dirección de envío.");
      }

      if (!validateShipping()) {
        errores.push("Seleccioná un tipo de envío.");
      }

      const qtyCheck = validateQuantities();
      if (!qtyCheck.ok) {
        errores.push(qtyCheck.msg);
      }

      if (errores.length > 0) {
        alert(errores.join("\n"));
        return;
      }

      const pagoTabBtn = document.querySelector('button[data-bs-target="#pagoTab"]');
      if (pagoTabBtn) {
        const tab = new bootstrap.Tab(pagoTabBtn);
        tab.show();
      }
    });
  }

  if (btnPagoContinuar) {
    btnPagoContinuar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const payCheck = validatePayment();
      if (!payCheck.ok) {
        alert(payCheck.msg);
        return;
      }

      const resumenTabBtn = document.querySelector('button[data-bs-target="#resumenTab"]');
      if (resumenTabBtn) {
        const tab = new bootstrap.Tab(resumenTabBtn);
        tab.show();
      }
    });
  }

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        const errores = [];

        if (!validateAddress()) {
            errores.push("Los campos asociados a la dirección no pueden estar vacíos.");
        }

        if (!validateShipping()) {
            errores.push("Debe estar seleccionada la forma de envío.");
        }

        const ctnCheck = validateQuantities();
        if (!ctnCheck.ok) {
            errores.push(ctnCheck.msg);
        }

        const payCheck = validatePayment();
        if (!payCheck.ok) {
            errores.push(payCheck.msg);
        }

        if (errores.length > 0) {
            showFeedback("danger", errores.join(" "));
        } else {
            showFeedback("success", "¡Compra realizada con éxito!");

            cart = [];

            localStorage.removeItem("cart");

            if (badge) badge.textContent = "0";
            if (inputSubtot) inputSubtot.textContent = "";

            if (contenedorLista) {
                contenedorLista.innerHTML = `
                    <div class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-muted mb-3" viewBox="0 0 256 256">
                            <path d="M241.55,64.74A12,12,0,0,0,232,60H60.23L51.56,28.79A12,12,0,0,0,40,20H20a12,12,0,0,0,0,24H30.88l34.3,123.49a28.09,28.09,0,0,0,27,20.51H191a28.09,28.09,0,0,0,27-20.51l25.63-92.28A12,12,0,0,0,241.55,64.74ZM194.8,161.07A4,4,0,0,1,191,164H92.16a4,4,0,0,1-3.85-2.93L66.9,84H216.21ZM108,220a20,20,0,1,1-20-20A20,20,0,0,1,108,220Zm104,0a20,20,0,1,1-20-20A20,20,0,0,1,212,220Z"></path>
                        </svg>
                        <h4 class="mb-2">Tu carrito está vacío</h4>
                        <p class="text-muted mb-4">¡Agrega productos para comenzar tu compra!</p>
                        <a href="index.html" class="btn btn-buy">
                            <i class="bi bi-arrow-left me-2"></i>Continuar comprando
                        </a>
                    </div>
                `;
            }

            if (subtotalLinea) {
                subtotalLinea.style.display = "none";
                subtotalLinea.style.visibility = "hidden";
            }
            if (btnComprar) {
                btnComprar.style.display = "none";
                btnComprar.style.visibility = "hidden";
            }
        }
    });
}


    if (!cart.length) {
        contenedorLista.innerHTML = `
            <div class="text-center py-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-muted mb-3" viewBox="0 0 256 256">
                    <path d="M241.55,64.74A12,12,0,0,0,232,60H60.23L51.56,28.79A12,12,0,0,0,40,20H20a12,12,0,0,0,0,24H30.88l34.3,123.49a28.09,28.09,0,0,0,27,20.51H191a28.09,28.09,0,0,0,27-20.51l25.63-92.28A12,12,0,0,0,241.55,64.74ZM194.8,161.07A4,4,0,0,1,191,164H92.16a4,4,0,0,1-3.85-2.93L66.9,84H216.21ZM108,220a20,20,0,1,1-20-20A20,20,0,0,1,108,220Zm104,0a20,20,0,1,1-20-20A20,20,0,0,1,212,220Z"></path>
                </svg>
                <h4 class="mb-2">Tu carrito está vacío</h4>
                <p class="text-muted mb-4">¡Agrega productos para comenzar tu compra!</p>
                <a href="index.html" class="btn btn-buy">
                    <i class="bi bi-arrow-left me-2"></i>Continuar comprando
                </a>
            </div>
        `;
        if (badge) badge.textContent = "0";
        if (subtotalLinea) {
            subtotalLinea.style.display = "none";
            subtotalLinea.style.visibility = "hidden";
        }
        if (btnComprar) {
            btnComprar.style.display = "none";
            btnComprar.style.visibility = "hidden";
        }
        return;
    }

    if (subtotalLinea) {
        subtotalLinea.style.display = "flex";
        subtotalLinea.style.visibility = "visible";
    }
    if (btnComprar) {
        btnComprar.style.display = "block";
        btnComprar.style.visibility = "visible";
    }

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

        const TASA_CAMBIO_UYU_A_USD = 40;

        function convertirADolares(precio, moneda) {
            if (moneda === "UYU") {
                return precio / TASA_CAMBIO_UYU_A_USD;
            }
            return precio;
        }

        function recalcularTotales() {
            let totalCarrito = 0;
            let totalCantidad = 0;
            let hayDolares = false;

            cart.forEach((cartItem, ids) => {
                const prodInfo = detalles[ids].info;
                if (prodInfo.currency === "USD") {
                    hayDolares = true;
                }
            });

            cart.forEach((cartItem, ids) => {
                const prodInfo = detalles[ids].info;
                const cantidad = cartItem.count;
                totalCantidad += cantidad;
                
                if (hayDolares) {
                    // Si hay dólares, convertir todo a USD
                    const precioEnDolares = convertirADolares(prodInfo.cost, prodInfo.currency);
                    totalCarrito += precioEnDolares * cantidad;
                } else {
                    // Si solo hay pesos, sumar en pesos
                    totalCarrito += prodInfo.cost * cantidad;
                }
            });

            if (hayDolares) {
                inputSubtot.textContent = `USD ${totalCarrito.toFixed(2)}`;
            } else {
                inputSubtot.textContent = `UYU ${totalCarrito.toLocaleString()}`;
            }
            if (badge) {
                badge.textContent = totalCantidad;
            }
        }

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
                    <div class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-muted mb-3" viewBox="0 0 256 256">
                            <path d="M241.55,64.74A12,12,0,0,0,232,60H60.23L51.56,28.79A12,12,0,0,0,40,20H20a12,12,0,0,0,0,24H30.88l34.3,123.49a28.09,28.09,0,0,0,27,20.51H191a28.09,28.09,0,0,0,27-20.51l25.63-92.28A12,12,0,0,0,241.55,64.74ZM194.8,161.07A4,4,0,0,1,191,164H92.16a4,4,0,0,1-3.85-2.93L66.9,84H216.21ZM108,220a20,20,0,1,1-20-20A20,20,0,0,1,108,220Zm104,0a20,20,0,1,1-20-20A20,20,0,0,1,212,220Z"></path>
                        </svg>
                        <h4 class="mb-2">Tu carrito está vacío</h4>
                        <p class="text-muted mb-4">¡Agrega productos para comenzar tu compra!</p>
                        <a href="index.html" class="btn btn-buy">
                            <i class="bi bi-arrow-left me-2"></i>Continuar comprando
                        </a>
                    </div>
                `;
                if (badge) badge.textContent = "0";
                // Ocultar subtotal y botón de comprar
                if (subtotalLinea) {
                    subtotalLinea.style.display = "none";
                    subtotalLinea.style.visibility = "hidden";
                }
                if (btnComprar) {
                    btnComprar.style.display = "none";
                    btnComprar.style.visibility = "hidden";
                }
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
        // Ocultar subtotal y botón de comprar en caso de error
        if (subtotalLinea) {
            subtotalLinea.style.display = "none";
            subtotalLinea.style.visibility = "hidden";
        }
        if (btnComprar) {
            btnComprar.style.display = "none";
            btnComprar.style.visibility = "hidden";
        }
    } finally {
        safeHideSpinner();
    }

});



