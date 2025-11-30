# 🛒 Documentación del Sistema de Carrito

> Documentación técnica del sistema de carrito de compras de eMercado, describiendo las funcionalidades implementadas, flujo de checkout, validaciones y gestión de datos.

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Proceso de Checkout](#-proceso-de-checkout)
- [Gestión de Monedas](#-gestión-de-monedas)
- [Aislamiento de Datos por Usuario](#-aislamiento-de-datos-por-usuario)
- [Validaciones](#-validaciones)
- [Persistencia de Datos](#-persistencia-de-datos)
- [Estructura de Datos](#-estructura-de-datos)

---

## 🎯 Descripción General

El sistema de carrito de eMercado permite a los usuarios:
- Ver productos agregados al carrito
- Modificar cantidades y eliminar productos
- Realizar un proceso de compra en 3 pasos (Envío, Pago, Resumen)
- Visualizar costos de envío y totales
- Gestionar carritos independientes por usuario

### Características Implementadas
- ✅ **Aislamiento por usuario**: Cada usuario tiene su carrito en `localStorage`
- ✅ **Conversión de monedas**: Calcula totales en UYU o USD según productos
- ✅ **Checkout en 3 pasos**: Envío → Pago → Resumen
- ✅ **Validaciones**: Campos de formulario con feedback visual
- ✅ **Persistencia**: Guardado automático de datos del formulario
- ✅ **Integración JWT**: Carga de productos requiere autenticación

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
cart.html (Vista)
    ↓
cart.js (Controlador)
    ↓
utils.js (Funciones auxiliares)
    ↓
localStorage (Persistencia)
```

### Archivos Involucrados

| Archivo | Responsabilidad |
|---------|-----------------|
| `cart.html` | Estructura HTML y layout del carrito |
| `cart.css` | Estilos específicos del carrito |
| `cart.js` | Lógica principal del carrito y checkout |
| `utils.js` | Funciones `getCart()` y `saveCart()` |
| `init.js` | Configuración de API y JWT |

### Flujo de Datos

```
Usuario agrega producto
    ↓
product-info.js → getCart()
    ↓
localStorage: cart_<email>
    ↓
cart.js → renderiza lista
    ↓
Usuario modifica/elimina
    ↓
saveCart() → actualiza localStorage
```

---

## ✨ Funcionalidades Implementadas

### 1. Visualización del Carrito

Al cargar `cart.html`, el sistema:
- Obtiene el carrito del usuario con `getCart()`
- Muestra mensaje si el carrito está vacío
- Si hay productos, realiza fetch de los detalles completos desde el backend
- Renderiza cada producto con imagen, nombre, descripción, precio y cantidad

**Carrito vacío:**
```javascript
if (!cart.length) {
    contenedorLista.innerHTML = `
        <div class="text-center py-5">
            <svg>...</svg>
            <h4 class="mb-2">Tu carrito está vacío</h4>
            <a href="index.html" class="btn btn-buy">Empezar a comprar</a>
        </div>
    `;
}
```

### 2. Modificar Cantidades

Cada producto tiene un input numérico que permite cambiar la cantidad:

```javascript
lista.addEventListener("input", (e) => {
    if (!e.target.classList.contains("cantidad-input")) return;
    
    const ids = parseInt(e.target.dataset.index, 10);
    const nuevaCantidad = parseInt(e.target.value, 10) || 1;
    
    if (nuevaCantidad < 1) {
        e.target.value = 1;
        return;
    }
    
    cart[ids].count = nuevaCantidad;
    saveCart(cart);
    
    // Actualizar subtotal del producto
    const prodInfo = detalles[ids].info;
    const nuevoSubtotal = prodInfo.cost * nuevaCantidad;
    // ... actualizar en el DOM
    
    recalcularTotales();
    calcularEnvioYTotal();
});
```

**Funcionamiento:**
- Mínimo: 1 unidad
- Actualiza el subtotal del producto instantáneamente
- Recalcula el total general del carrito
- Guarda cambios en localStorage automáticamente

### 3. Eliminar Productos

Botón "Eliminar" en cada producto:

```javascript
lista.addEventListener("click", (e) => {
    if (!e.target.closest(".btn-cerrar")) return;
    
    const btn = e.target.closest(".btn-cerrar");
    const ids = parseInt(btn.dataset.index, 10);
    const nombreProd = detalles[ids].info.name;
    
    Swal.fire({
        title: "¿Eliminar producto?",
        text: nombreProd,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            cart.splice(ids, 1);
            saveCart(cart);
            btn.closest("li").remove();
            // Actualizar totales y badge
        }
    });
});
```

**Características:**
- Confirmación con SweetAlert2 antes de eliminar
- Remueve del array `cart` y del DOM
- Actualiza el badge del carrito
- Recalcula totales

---

## 🛍️ Proceso de Checkout

El checkout está dividido en 3 pasos que se muestran/ocultan dinámicamente:

### Navegación entre Pasos

```javascript
function showStep(step) {
    // Ocultar todos los tabs
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
    }
    // ... similar para 'pago' y 'resumen'
}
```

Breadcrumbs clicables permiten navegar entre pasos.

### Paso 1: Información de Envío

**Campos del formulario:**
- Select de tipo de envío (con porcentaje de costo)
- Departamento (text input)
- Localidad (text input)
- Calle (text input)
- Número (text input)
- Esquina (text input)

**Costos de envío implementados:**
| Tipo | Porcentaje |
|------|------------|
| Premium | 15% |
| Express | 7% |
| Standard | 5% |

Botón "Continuar a Pago" valida que todos los campos estén completos antes de avanzar.

### Paso 2: Método de Pago

**Select con 2 opciones:**
1. **Tarjeta de crédito/débito** (`value="card"`)
2. **Transferencia bancaria** (`value="transfer"`)

**Campos dinámicos según selección:**

**Si elige Tarjeta:**
- Número de tarjeta (input)
- Código de seguridad / CVV (input)
- Vencimiento (input)

**Si elige Transferencia:**
- Titular de la cuenta (input)
- Banco (input)
- Número de cuenta / CBU (input)

```javascript
function renderPaymentFields() {
    const savedData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
    
    if (paymentMethod.value === "card") {
        paymentFieldsBox.innerHTML = `
            <input id="card-number" class="form-control" 
                   placeholder="Número de tarjeta" 
                   value="${savedData['card-number'] || ''}">
            // ... más campos
        `;
    } else if (paymentMethod.value === "transfer") {
        paymentFieldsBox.innerHTML = `
            <input id="transfer-name" class="form-control" 
                   placeholder="Titular de la cuenta">
            // ... más campos
        `;
    }
}
```

Los campos se regeneran cuando cambia la selección del método de pago.

### Paso 3: Resumen

Muestra el resumen de la compra con 3 valores:

```javascript
function calcularEnvioYTotal() {
    if (!subtotalNumerico) return;
    
    let costoEnvio = 0;
    const shippingRate = parseFloat(shippingSelect.value);
    
    if (!isNaN(shippingRate)) {
        costoEnvio = subtotalNumerico * shippingRate;
    }
    
    const total = subtotalNumerico + costoEnvio;
    
    // Actualizar elementos del DOM
    document.getElementById("resumen-subtotal").textContent = 
        `${moneda} ${subtotal}`;
    document.getElementById("resumen-envio").textContent = 
        `${moneda} ${envio}`;
    document.getElementById("resumen-total").textContent = 
        `${moneda} ${total}`;
}
```

**Información del resumen:**
- Subtotal de productos
- Costo de envío (calculado según el tipo)
- Total final

### Finalizar Compra

Botón "Finalizar Compra" que ejecuta todas las validaciones:

```javascript
btnFinalizar.addEventListener("click", () => {
    let errores = [];
    
    // Validar envío
    if (!validateShipping()) {
        errores.push("Seleccioná un tipo de envío.");
    }
    if (!validateAddress()) {
        errores.push("Completá todos los datos de envío.");
    }
    
    // Validar cantidades
    const ctnCheck = validateQuantities();
    if (!ctnCheck.ok) {
        errores.push(ctnCheck.msg);
    }
    
    // Validar pago
    const payCheck = validatePayment();
    if (!payCheck.ok) {
        errores.push(payCheck.msg);
    }
    
    if (errores.length > 0) {
        return; // No procede
    }
    
    // Si todo es válido, muestra éxito
    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        text: 'Tu pedido ha sido procesado correctamente.'
    }).then(() => {
        // Limpiar carrito y redirigir
        cart = [];
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutFormData");
        window.location.href = 'index.html';
    });
});
```

## 💱 Gestión de Monedas

El carrito soporta dos monedas: **USD** y **UYU** con un tipo de cambio fijo.

**Tipo de cambio:**
```javascript
const DOLAR_VALUE = 40.5; // 1 USD = 40.5 UYU
```

**Conversión de precios:**

```javascript
function convertirAUYU(precio, moneda) {
    if (moneda === 'USD') {
        return precio * DOLAR_VALUE;
    }
    return precio; // Ya está en UYU
}
```

Todos los productos se convierten a UYU para el cálculo del subtotal:

```javascript
cart.forEach(producto => {
    const precioEnUYU = convertirAUYU(producto.unitCost, producto.currency);
    const subtotalProducto = precioEnUYU * producto.count;
    subtotalTotal += subtotalProducto;
});
```

La moneda mostrada en el carrito es siempre `UYU $`.

## ✅ Validaciones

### Validación de Cantidades

```javascript
function validateQuantities() {
    let allValid = true;
    document.querySelectorAll(".quantity-input").forEach(input => {
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 1) {
            allValid = false;
            input.classList.add("is-invalid");
        } else {
            input.classList.remove("is-invalid");
        }
    });
    
    return {
        ok: allValid,
        msg: "Hay cantidades inválidas (menores a 1)."
    };
}
```

### Validación de Dirección

```javascript
function validateAddress() {
    const dep = document.getElementById("departamento").value.trim();
    const loc = document.getElementById("localidad").value.trim();
    const street = document.getElementById("calle").value.trim();
    const number = document.getElementById("numero").value.trim();
    
    return dep && loc && street && number;
}
```

### Validación de Tipo de Envío

```javascript
function validateShipping() {
    return shippingSelect.value !== "";
}
```

### Validación de Pago

```javascript
function validatePayment() {
    const method = paymentMethod.value;
    if (!method) {
        return { ok: false, msg: "Seleccioná un método de pago." };
    }
    
    if (method === "card") {
        const cardNum = document.getElementById("card-number")?.value.trim();
        const cardCvv = document.getElementById("card-cvv")?.value.trim();
        const cardExp = document.getElementById("card-exp")?.value.trim();
        
        if (!cardNum || !cardCvv || !cardExp) {
            return { ok: false, msg: "Completá todos los datos de la tarjeta." };
        }
    } else if (method === "transfer") {
        const transferName = document.getElementById("transfer-name")?.value.trim();
        const transferBank = document.getElementById("transfer-bank")?.value.trim();
        const transferCbu = document.getElementById("transfer-cbu")?.value.trim();
        
        if (!transferName || !transferBank || !transferCbu) {
            return { ok: false, msg: "Completá todos los datos de transferencia." };
        }
    }
    
    return { ok: true };
}
```

## 💾 Persistencia de Datos

### LocalStorage - Datos del Carrito

El carrito se guarda por usuario usando la clave `cart_<email>`:

```javascript
// utils.js
export function getCart() {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return [];
    
    const key = `cart_${userEmail}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

export function saveCart(cartArray) {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;
    
    const key = `cart_${userEmail}`;
    localStorage.setItem(key, JSON.stringify(cartArray));
}
```

### Guardado de Datos del Formulario

Los datos del checkout se persisten en `checkoutFormData`:

```javascript
function saveFormData() {
    const formData = {};
    
    // Guardar datos de envío
    formData['departamento'] = document.getElementById("departamento")?.value || '';
    formData['localidad'] = document.getElementById("localidad")?.value || '';
    formData['calle'] = document.getElementById("calle")?.value || '';
    formData['numero'] = document.getElementById("numero")?.value || '';
    
    // Guardar método de pago
    formData['paymentMethod'] = paymentMethod?.value || '';
    
    // Guardar campos de pago actuales
    const allInputs = document.querySelectorAll("#payment-fields-box input");
    allInputs.forEach(inp => {
        if (inp.id) formData[inp.id] = inp.value;
    });
    
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
}
```

### Recuperación Automática

Los datos se cargan al iniciar la página:

```javascript
document.addEventListener("DOMContentLoaded", () => {
    cart = getCart(); // Cargar carrito del usuario
    
    if (cart.length === 0) {
        // Mostrar mensaje si está vacío
    } else {
        renderCart(); // Renderizar productos
    }
    
    // Restaurar datos del formulario
    const savedData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}');
    document.getElementById("departamento").value = savedData['departamento'] || '';
    document.getElementById("localidad").value = savedData['localidad'] || '';
    // ... etc.
});
```

## 🌐 API y Autenticación

### Endpoints Utilizados

El carrito usa endpoints de la API local protegidos con JWT:

```javascript
// Obtener datos del carrito
GET http://localhost:3000/emercado-api-main/user_cart/25801.json

// Obtener información de productos
GET http://localhost:3000/emercado-api-main/products/{id}.json
```

### Autenticación JWT

Todas las peticiones al backend incluyen el token JWT en los headers:

```javascript
// init.js - getJSONData()
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

const response = await fetch(url, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

if (response.status === 401 || response.status === 403) {
    // Token expirado - redirigir a login
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
}
```

## 📊 Estructura de Datos

### Producto en el Carrito

```javascript
{
    id: 40281,                    // ID único del producto
    name: "Audi A1",              // Nombre del producto
    count: 2,                     // Cantidad seleccionada
    unitCost: 30000,              // Precio unitario
    currency: "UYU",              // Moneda (UYU o USD)
    image: "img/prod1.jpg"        // URL de la imagen
}
```

### Agregar Producto desde product-info.js

```javascript
// En product-info.js
const addToCartBtn = document.getElementById('addToCartBtn');

addToCartBtn.addEventListener('click', () => {
    const cart = getCart();
    
    // Crear objeto del producto actual
    const product = {
        id: productData.id,
        name: productData.name,
        unitCost: productData.cost,
        currency: productData.currency,
        image: productData.images[0],
        count: 1
    };
    
    // Verificar si ya existe en el carrito
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.count++;
    } else {
        cart.push(product);
    }
    
    saveCart(cart);
    
    // Mostrar notificación
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 1500
    });
});
```

<div align="center">

**Documentación del Sistema de Carrito - eMercado**

[⬆ Volver arriba](#-documentación-del-sistema-de-carrito)

</div>
