/**
 * cart.js
 * Maneja toda la funcionalidad del carrito de compras:
 * - Visualización y edición de productos
 * - Proceso de checkout en 3 pasos (envío, pago, resumen)
 * - Cálculo de totales y conversión de monedas
 * - Validaciones de formularios
 */

document.addEventListener('DOMContentLoaded', async function () {
    const contenedorLista = document.getElementById("lista-art");
    const inputSubtot = document.getElementById("input-subtot");
    const badge = document.getElementById("cart-badge");
    const subtotalLinea = document.getElementById("subtot-lin");
    const btnComprar = document.getElementById("btn-comprar");
    const pedidoTitulo = document.getElementById("pedido-titulo");
    const subtotalSection = document.getElementById("subtotal-section");

    if (subtotalLinea) {
        subtotalLinea.style.display = "none";
        subtotalLinea.style.visibility = "hidden";
    }
    if (btnComprar) {
        btnComprar.style.display = "none";
        btnComprar.style.visibility = "hidden";
    }
    // Ocultar inicialmente título y subtotal
    if (pedidoTitulo) {
        pedidoTitulo.style.display = "none";
    }
    if (subtotalSection) {
        subtotalSection.style.display = "none";
    }

    let cart = getCart();

    const checkoutPanel = document.getElementById("checkout-panel");
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

    // Pasos del checkout
    const envioTab = document.getElementById("envioTab");
    const pagoTab = document.getElementById("pagoTab");
    const resumenTab = document.getElementById("resumenTab");

    // Breadcrumbs
    const breadcrumbEnvio = document.getElementById("breadcrumb-envio");
    const breadcrumbPago = document.getElementById("breadcrumb-pago");
    const breadcrumbResumen = document.getElementById("breadcrumb-resumen");

    // Estado actual del checkout
    let currentStep = 'envio';

    // Feedback en el paso Resumen
    const feedbackDiv = document.createElement("div");
    feedbackDiv.id = "checkout-feedback";
    feedbackDiv.className = "mt-3";
    resumenTab.insertBefore(feedbackDiv, resumenTab.firstChild);

    function showFeedback(type, msg) {
        feedbackDiv.innerHTML = "";
        const alert = document.createElement("div");
        alert.className = "alert alert-" + type;
        alert.textContent = msg;
        feedbackDiv.appendChild(alert);
    }

    // Cambia entre los diferentes pasos del checkout (envío, pago, resumen)
    function showStep(step) {
        // Ocultar todos los pasos
        envioTab.style.display = 'none';
        pagoTab.style.display = 'none';
        resumenTab.style.display = 'none';

        // Resetear breadcrumbs
        breadcrumbEnvio.classList.remove('active');
        breadcrumbPago.classList.remove('active');
        breadcrumbResumen.classList.remove('active');

        // Mostrar el paso correspondiente
        if (step === 'envio') {
            envioTab.style.display = 'block';
            breadcrumbEnvio.classList.add('active');
            currentStep = 'envio';
        } else if (step === 'pago') {
            pagoTab.style.display = 'block';
            breadcrumbPago.classList.add('active');
            currentStep = 'pago';
        } else if (step === 'resumen') {
            resumenTab.style.display = 'block';
            breadcrumbResumen.classList.add('active');
            currentStep = 'resumen';
            calcularEnvioYTotal();
        }
    }

    // Carga los datos guardados del formulario desde localStorage
    function loadFormData() {
        const savedData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
        
        if (savedData.shipping) shippingSelect.value = savedData.shipping;
        if (savedData.dep) depInput.value = savedData.dep;
        if (savedData.loc) locInput.value = savedData.loc;
        if (savedData.calle) calleInput.value = savedData.calle;
        if (savedData.numero) numeroInput.value = savedData.numero;
        if (savedData.esquina) esquinaInput.value = savedData.esquina;
        if (savedData.paymentMethod) paymentMethod.value = savedData.paymentMethod;
    }

    // Guarda todos los datos del formulario en localStorage para persistencia
    function saveFormData() {
        const formData = {
            shipping: shippingSelect.value,
            dep: depInput.value,
            loc: locInput.value,
            calle: calleInput.value,
            numero: numeroInput.value,
            esquina: esquinaInput.value,
            paymentMethod: paymentMethod.value
        };

        // Guardar campos de pago según el método
        const paymentInputs = paymentFieldsBox.querySelectorAll('input');
        paymentInputs.forEach(input => {
            formData[input.id] = input.value;
        });

        localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }

    // Auto-guardar cuando cambian los campos
    [shippingSelect, depInput, locInput, calleInput, numeroInput, esquinaInput].forEach(input => {
        if (input) {
            input.addEventListener('input', saveFormData);
            input.addEventListener('change', saveFormData);
        }
    });

    // Valida un campo individual y actualiza clases de Bootstrap
    function validateField(field) {
        if (!field.value || field.value.trim() === '') {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        }
    }

    function renderPaymentFields() {
        paymentFieldsBox.innerHTML = "";

        const savedData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');

        if (paymentMethod.value === "card") {
            paymentFieldsBox.innerHTML = `
                <div class="mb-2">
                    <input id="card-name" class="form-control" placeholder="Nombre completo" required 
                           value="${savedData['card-name'] || ''}">
                    <div class="invalid-feedback">
                        El nombre es requerido.
                    </div>
                </div>
                <div class="mb-2">
                    <input id="card-number" class="form-control" placeholder="Número de tarjeta" required
                           value="${savedData['card-number'] || ''}">
                    <div class="invalid-feedback">
                        El número de tarjeta es requerido.
                    </div>
                </div>
                <div class="d-flex gap-2 mb-2">
                    <div class="flex-fill">
                        <input id="card-cvv" class="form-control" placeholder="CVV" required
                               value="${savedData['card-cvv'] || ''}">
                        <div class="invalid-feedback">
                            CVV requerido.
                        </div>
                    </div>
                    <div class="flex-fill">
                        <input id="card-exp" class="form-control" placeholder="Vencimiento (MM/AA)" required
                               value="${savedData['card-exp'] || ''}">
                        <div class="invalid-feedback">
                            Vencimiento requerido.
                        </div>
                    </div>
                </div>
            `;
        } else {
            paymentFieldsBox.innerHTML = `
                <div class="mb-2">
                    <input id="transfer-name" class="form-control" placeholder="Titular de la cuenta" required
                           value="${savedData['transfer-name'] || ''}">
                    <div class="invalid-feedback">
                        El titular es requerido.
                    </div>
                </div>
                <div class="mb-2">
                    <input id="transfer-bank" class="form-control" placeholder="Banco" required
                           value="${savedData['transfer-bank'] || ''}">
                    <div class="invalid-feedback">
                        El banco es requerido.
                    </div>
                </div>
                <div class="mb-2">
                    <input id="transfer-cbu" class="form-control" placeholder="Número de cuenta / CBU" required
                           value="${savedData['transfer-cbu'] || ''}">
                    <div class="invalid-feedback">
                        El número de cuenta es requerido.
                    </div>
                </div>
            `;
        }

        // Agregar listeners de auto-guardado a los nuevos campos
        paymentFieldsBox.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', saveFormData);
        });
    }

    // Listener para cambio de método de pago
    paymentMethod.addEventListener("change", () => {
        renderPaymentFields();
        saveFormData();
    });
    
    // Cargar datos guardados e inicializar campos de pago
    loadFormData();
    renderPaymentFields();
    
    // Valida que todos los campos de dirección estén completos
    function validateAddress() {
        const campos = [
            { field: depInput, name: 'Departamento' },
            { field: locInput, name: 'Localidad' },
            { field: calleInput, name: 'Calle' },
            { field: numeroInput, name: 'Número' },
            { field: esquinaInput, name: 'Esquina' }
        ];
        
        let allValid = true;
        campos.forEach(({ field }) => {
            if (!validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }

    // Valida que se haya seleccionado un tipo de envío válido
    function validateShipping() {
        const isValid = shippingSelect.value && !isNaN(Number(shippingSelect.value));
        shippingSelect.classList.toggle('is-invalid', !isValid);
        shippingSelect.classList.toggle('is-valid', isValid);
        return isValid;
    }

    // Valida que todas las cantidades sean válidas y mayores a 0
    function validateQuantities() {
        const ctnInputs = listaArt.querySelectorAll("input[type='number']");

        if (ctnInputs.length === 0) {
            return { ok: false, msg: "Tu carrito está vacío. Agregá productos antes de finalizar la compra." };
        }

        const invalidQuantity = Array.from(ctnInputs).some(input => {
            const val = Number(input.value);
            return !val || val <= 0;
        });

        if (invalidQuantity) {
            return { ok: false, msg: "La cantidad para cada producto debe estar definida y ser mayor a 0." };
        }

        return { ok: true };
    }

    // Valida que se haya seleccionado un método de pago y todos sus campos estén completos
    function validatePayment() {
        if (!paymentMethod.value) {
            return { ok: false, msg: "Seleccioná una forma de pago." };
        }
        
        const inputs = paymentFieldsBox.querySelectorAll("input");
        if (inputs.length === 0) {
            return { ok: false, msg: "Completá los datos de la forma de pago seleccionada." };
        }
        
        const allValid = Array.from(inputs).every(input => validateField(input));
        
        if (!allValid) {
            return { ok: false, msg: "Completá todos los campos de la forma de pago seleccionada." };
        }
        
        return { ok: true };
    }

    // Botón continuar de Envío
    const btnEnvioContinuar = document.getElementById("btn-envio-continuar");
    if (btnEnvioContinuar) {
        btnEnvioContinuar.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const errores = [];

            // Validar cantidades primero
            const qtyCheck = validateQuantities();
            if (!qtyCheck.ok) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Carrito vacío',
                    text: qtyCheck.msg,
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#F09100'
                });
                return;
            }

            // Validar tipo de envío
            if (!validateShipping()) {
                errores.push("Seleccioná un tipo de envío.");
            }

            // Validar dirección
            if (!validateAddress()) {
                errores.push("Completá todos los campos de la dirección de envío.");
            }

            if (errores.length > 0) {
                return;
            }

            // Todo válido, pasar al siguiente paso
            saveFormData();
            showStep('pago');
        });
    }

    // Botón volver de Pago
    const btnPagoVolver = document.getElementById("btn-pago-volver");
    if (btnPagoVolver) {
        btnPagoVolver.addEventListener("click", (e) => {
            e.preventDefault();
            saveFormData();
            showStep('envio');
        });
    }

    // Botón continuar de Pago
    const btnPagoContinuar = document.getElementById("btn-pago-continuar");
    if (btnPagoContinuar) {
        btnPagoContinuar.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const payCheck = validatePayment();
            if (!payCheck.ok) {
                return;
            }

            // Todo válido, pasar al resumen
            saveFormData();
            showStep('resumen');
        });
    }

    // Botón volver de Resumen
    const btnResumenVolver = document.getElementById("btn-resumen-volver");
    if (btnResumenVolver) {
        btnResumenVolver.addEventListener("click", (e) => {
            e.preventDefault();
            feedbackDiv.innerHTML = "";
            showStep('pago');
        });
    }

    // Botón finalizar compra - valida todo y procesa la orden
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", async () => {
            // Validar todas las secciones del checkout
            const validations = [
                { check: validateAddress(), msg: "Los campos asociados a la dirección no pueden estar vacíos." },
                { check: validateShipping(), msg: "Debe estar seleccionada la forma de envío." },
                validateQuantities(),
                validatePayment()
            ];

            // Recolectar errores
            const errores = validations
                .filter(v => v && !v.ok && v.check === false)
                .map(v => v.msg);

            if (errores.length > 0) {
                return;
            }

            // Preparar datos del carrito para enviar al backend
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
                
                if (!token || !usuario) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: 'Necesitás iniciar sesión para completar la compra.',
                        confirmButtonColor: '#dc3545'
                    });
                    return;
                }

                // Obtener el ID del usuario decodificando el token JWT
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const userId = tokenPayload.id;

                // Preparar items del carrito
                const items = cart.map(item => ({
                    productId: item.id,
                    quantity: item.count
                }));

                // Enviar carrito al backend
                const response = await fetch('http://localhost:3000/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        items: items
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al guardar el carrito');
                }

                const data = await response.json();
                console.log('Carrito guardado exitosamente:', data);

                // Limpiar carrito y datos del formulario ANTES de mostrar el mensaje
                localStorage.removeItem('cart');
                localStorage.removeItem("checkoutFormData");

                // Mostrar confirmación de compra exitosa
                Swal.fire({
                    icon: 'success',
                    title: '¡Compra realizada con éxito!',
                    text: 'Tu pedido ha sido procesado correctamente.',
                    confirmButtonText: 'Continuar comprando',
                    confirmButtonColor: '#198754',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    // Redirigir a la página principal
                    window.location.href = 'index.html';
                });

            } catch (error) {
                console.error('Error al procesar la compra:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar la compra',
                    text: 'Hubo un problema al guardar tu pedido. Por favor, intentá de nuevo.',
                    confirmButtonColor: '#dc3545'
                });
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
                    <i class="bi bi-arrow-left me-2"></i>Empezar a comprar
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
        // Ocultar el panel de checkout
        if (checkoutPanel) {
            checkoutPanel.style.display = "none";
        }
        // Ocultar título y sección de subtotal
        if (pedidoTitulo) {
            pedidoTitulo.style.display = "none";
        }
        if (subtotalSection) {
            subtotalSection.style.display = "none";
        }
        return;
    }

    // Mostrar el panel de checkout si hay productos
    if (checkoutPanel) {
        checkoutPanel.style.display = "block";
    }
    // Mostrar título y sección de subtotal
    if (pedidoTitulo) {
        pedidoTitulo.style.display = "block";
    }
    if (subtotalSection) {
        subtotalSection.style.display = "flex";
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
        // Obtener token para autenticación
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const detalles = await Promise.all(
            cart.map(item => {
                const url = PRODUCT_INFO_URL + item.id + EXT_TYPE;
                return fetch(url, { headers })
                    .then(r => {
                        if (r.status === 401 || r.status === 403) {
                            localStorage.removeItem('token');
                            sessionStorage.removeItem('token');
                            window.location.href = 'login.html';
                            throw new Error('Sesión expirada');
                        }
                        return r.json();
                    })
                    .then(data => ({ info: data }));
            })
        );

        const lista = document.createElement("ul");
        lista.classList.add("list-group", "mb-3");

        // Tasa de cambio para conversión de monedas
        const EXCHANGE_RATE_UYU_TO_USD = 40;
        const MAX_DESCRIPTION_LENGTH = 80;
        let subtotalNumerico = 0;
        let esMonedaUSD = false;

        function convertirADolares(precio, moneda) {
            if (moneda === "UYU") {
                return precio / EXCHANGE_RATE_UYU_TO_USD;
            }
            return precio;
        }

        // Recalcula el subtotal sumando todos los productos del carrito
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
                    const precioEnDolares = convertirADolares(prodInfo.cost, prodInfo.currency);
                    totalCarrito += precioEnDolares * cantidad;
                } else {
                    totalCarrito += prodInfo.cost * cantidad;
                }
            });

            subtotalNumerico = totalCarrito;
            esMonedaUSD = hayDolares;

            if (hayDolares) {
                inputSubtot.textContent = `USD ${totalCarrito.toFixed(2)}`;
            } else {
                inputSubtot.textContent = `UYU ${Math.round(totalCarrito).toLocaleString()}`;
            }
            if (badge) {
                badge.textContent = totalCantidad;
            }
        }

        // Calcula el costo de envío y el total final en base al tipo de envío
        function calcularEnvioYTotal() {
            if (!subtotalNumerico) return;

            let costoEnvio = 0;
            const shippingRate = parseFloat(shippingSelect.value);
            
            if (!isNaN(shippingRate)) {
                costoEnvio = subtotalNumerico * shippingRate;
            }

            const total = subtotalNumerico + costoEnvio;

            if (esMonedaUSD) {
                document.getElementById("resumen-subtotal").textContent = `USD ${subtotalNumerico.toFixed(2)}`;
                document.getElementById("resumen-envio").textContent = `USD ${costoEnvio.toFixed(2)}`;
                document.getElementById("resumen-total").textContent = `USD ${total.toFixed(2)}`;
            } else {
                document.getElementById("resumen-subtotal").textContent = `UYU ${Math.round(subtotalNumerico).toLocaleString()}`;
                document.getElementById("resumen-envio").textContent = `UYU ${Math.round(costoEnvio).toLocaleString()}`;
                document.getElementById("resumen-total").textContent = `UYU ${Math.round(total).toLocaleString()}`;
            }
        }

        cart.forEach((cartItem, index) => {
            const prodInfo = detalles[index].info;
            const itemSubtotal = prodInfo.cost * cartItem.count;

            const descripcionCorta =
                prodInfo.description.length > MAX_DESCRIPTION_LENGTH
                    ? prodInfo.description.slice(0, MAX_DESCRIPTION_LENGTH) + "…"
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
                    style="width:100px; height:100px; object-fit:cover; border-radius:8px; border:1px solid #ddd;">

                <div class="flex-grow-1 d-flex flex-column justify-content-between w-100">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 product-name">${prodInfo.name}</h6>
                            <p class="mb-0 text-muted small product-description">${descripcionCorta}</p>
                        </div>
                        <div class="text-end ms-3" style="min-width: 120px;">
                            <p class="mb-1 text-muted" style="font-size: 0.85rem;">Unidad: ${prodInfo.currency} ${prodInfo.cost.toLocaleString()}</p>
                            <p class="mb-0 fw-bold item-subtotal" data-index="${index}" style="font-size: 1rem;">
                                ${prodInfo.currency} ${itemSubtotal.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                            <label class="mb-0 small text-muted">Cantidad:</label>
                            <input
                                type="number"
                                min="1"
                                value="${cartItem.count}"
                                class="form-control form-control-sm cantidad-input"
                                style="width:60px"
                                data-index="${index}">
                        </div>
                        <button class="btn btn-sm btn-danger btn-cerrar d-flex align-items-center gap-1" data-index="${index}" title="Eliminar producto">
                            <i class="bi bi-x-lg"></i>
                            <span class="d-none d-sm-inline">Eliminar</span>
                        </button>
                    </div>
                </div>
            `;

            lista.appendChild(li);
        });

        contenedorLista.innerHTML = "";
        contenedorLista.appendChild(lista);

        recalcularTotales();
        calcularEnvioYTotal();

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
            saveCart(cart);

            const prodInfo = detalles[ids].info;
            const nuevoSubtotal = prodInfo.cost * nuevaCantidad;
            const subElem = lista.querySelector(`.item-subtotal[data-index="${ids}"]`);
            if (subElem) {
                subElem.textContent = `${prodInfo.currency} ${nuevoSubtotal.toLocaleString()}`;
            }

            recalcularTotales();
            calcularEnvioYTotal();
        });

        lista.addEventListener("click", async (e) => {
            const btn = e.target.closest(".btn-cerrar");
            if (!btn) return;

            const ids = parseInt(btn.dataset.index, 10);
            const prodInfo = detalles[ids].info;

            // Confirmar eliminación
            const result = await Swal.fire({
                title: '¿Eliminar producto?',
                html: `<p>¿Estás seguro de que querés eliminar <strong>${prodInfo.name}</strong> del carrito?</p>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                reverseButtons: true
            });

            if (!result.isConfirmed) return;

            // Eliminar producto del carrito y de los detalles
            cart.splice(ids, 1);
            detalles.splice(ids, 1);
            saveCart(cart);
            btn.closest("li").remove();
            
            Swal.fire({
				toast: true,
				position: 'top-end',
				icon: 'success',
				title: 'El producto ha sido eliminado del carrito.',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				background: getComputedStyle(document.documentElement)
					.getPropertyValue('--card-bg'),
				color: getComputedStyle(document.documentElement)
					.getPropertyValue('--font-color')
			});

            if (!cart.length) {
                contenedorLista.innerHTML = `
                    <div class="text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-muted mb-3" viewBox="0 0 256 256">
                            <path d="M241.55,64.74A12,12,0,0,0,232,60H60.23L51.56,28.79A12,12,0,0,0,40,20H20a12,12,0,0,0,0,24H30.88l34.3,123.49a28.09,28.09,0,0,0,27,20.51H191a28.09,28.09,0,0,0,27-20.51l25.63-92.28A12,12,0,0,0,241.55,64.74ZM194.8,161.07A4,4,0,0,1,191,164H92.16a4,4,0,0,1-3.85-2.93L66.9,84H216.21ZM108,220a20,20,0,1,1-20-20A20,20,0,0,1,108,220Zm104,0a20,20,0,1,1-20-20A20,20,0,0,1,212,220Z"></path>
                        </svg>
                        <h4 class="mb-2">Tu carrito está vacío</h4>
                        <p class="text-muted mb-4">¡Agrega productos para comenzar tu compra!</p>
                        <a href="index.html" class="btn btn-buy">
                            <i class="bi bi-arrow-left me-2"></i>Empezar a comprar
                        </a>
                    </div>
                `;
                if (badge) badge.textContent = "0";
                if (inputSubtot) inputSubtot.textContent = "";
                // Ocultar subtotal y botón de comprar
                if (subtotalLinea) {
                    subtotalLinea.style.display = "none";
                    subtotalLinea.style.visibility = "hidden";
                }
                if (btnComprar) {
                    btnComprar.style.display = "none";
                    btnComprar.style.visibility = "hidden";
                }
                // Ocultar el panel de checkout
                if (checkoutPanel) {
                    checkoutPanel.style.display = "none";
                }
                // Ocultar título y sección de subtotal
                if (pedidoTitulo) {
                    pedidoTitulo.style.display = "none";
                }
                if (subtotalSection) {
                    subtotalSection.style.display = "none";
                }
                return;
            }

            // Reindexar todos los elementos después de eliminar un producto
            // Esto mantiene la consistencia de los índices en el DOM
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
            calcularEnvioYTotal();
        });

        // Cambio de tipo de envío
        shippingSelect.addEventListener("change", () => {
            saveFormData();
            calcularEnvioYTotal();
        });

    } catch (error) {
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