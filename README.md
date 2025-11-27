# 🛒 eMercado - E-Commerce Platform

> Plataforma de comercio electrónico completa desarrollada como proyecto final del curso Jóvenes a Programar (JAP). Sistema web con carrito de compras, gestión de productos, perfiles de usuario y proceso de checkout completo.

[![GitHub](https://img.shields.io/badge/GitHub-EmilianoCrause-blue?logo=github)](https://github.com/EmilianoCrause/proyecto_final)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Guía de Uso](#-guía-de-uso)
- [Arquitectura del Código](#-arquitectura-del-código)
- [Sistema de Carrito](#-sistema-de-carrito)
- [API y Endpoints](#-api-y-endpoints)
- [Documentación Adicional](#-documentación-adicional)
- [Testing](#-testing)
- [Contribución](#-contribución)

---

## 🎯 Descripción General

**eMercado** es una plataforma de e-commerce moderna que permite a los usuarios navegar, filtrar y comprar productos de diferentes categorías. Incluye autenticación, carrito de compras, sistema de checkout completo, gestión de perfil y modo oscuro.

### Funcionalidades Principales:
- 🔐 Sistema de autenticación con persistencia
- 🛍️ Navegación por categorías y productos
- 🔍 Búsqueda y filtros avanzados
- 🛒 Carrito de compras completo con checkout en 3 pasos
- 💳 Proceso de pago con validaciones
- 👤 Gestión de perfil de usuario
- 🌙 Modo oscuro/claro
- 📱 Diseño responsive
- ✨ Alertas y notificaciones con SweetAlert2

---

## ✨ Características Principales

### 🔐 Autenticación
- Login con validación de campos
- Opción "Recordarme" (localStorage/sessionStorage)
- Verificación de sesión en todas las páginas
- Redirección automática

### 🛍️ Productos y Categorías
- Listado dinámico desde API
- Filtros por precio (mín/máx)
- Búsqueda en tiempo real
- Ordenamiento (precio, relevancia)
- Detalle con galería de imágenes
- Sistema de comentarios con calificaciones
- Productos relacionados

### 🛒 Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales
- Conversión de monedas (UYU ↔ USD)
- **Checkout en 3 pasos:**
  1. Envío (dirección + tipo de envío)
  2. Pago (tarjeta o transferencia)
  3. Resumen (totales y confirmación)
- Persistencia de datos del formulario
- Validaciones en tiempo real

### 🎨 UI/UX
- Modo oscuro con toggle persistente
- Diseño responsive (mobile, tablet, desktop)
- Animaciones y transiciones CSS
- SweetAlert2 para notificaciones
- Breadcrumbs para navegación
- Spinner durante cargas

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modulares
  - CSS Variables
  - Flexbox & Grid
  - Media queries
- **JavaScript ES6+** - Lógica de aplicación
  - Fetch API
  - Async/await
  - LocalStorage API
  - DOM Manipulation

### Librerías
- **Bootstrap 5** - Framework CSS
- **Font Awesome 5** - Iconos
- **Swiper.js** - Carousel de productos
- **SweetAlert2** - Alertas elegantes

### Herramientas
- Git & GitHub
- VS Code

---

## 📁 Estructura del Proyecto

```
proyecto_final/
│
├── index.html              # Página principal con carousel
├── login.html              # Autenticación
├── categories.html         # Categorías
├── products.html           # Listado de productos
├── product-info.html       # Detalle de producto
├── cart.html               # Carrito y checkout
├── my-profile.html         # Perfil de usuario
├── sell.html               # Venta de productos
│
├── css/                    # Estilos modulares
│   ├── common.css          # Archivo principal (imports)
│   ├── variables.css       # Variables CSS y modo oscuro
│   ├── reset.css           # Reset y base
│   ├── header.css          # Header y navegación
│   ├── footer.css          # Footer
│   ├── components.css      # Componentes reutilizables
│   ├── products.css        # Productos y categorías
│   ├── cart.css            # Estilos del carrito
│   ├── login.css           # Login
│   ├── my-profile.css      # Perfil
│   └── product-info.css    # Detalle de producto
│
├── js/                     # Scripts por funcionalidad
│   ├── init.js             # Constantes globales y API
│   ├── utils.js            # Funciones compartidas
│   ├── index.js            # Lógica del index
│   ├── categories.js       # Lógica de categorías
│   ├── products.js         # Lógica de productos
│   ├── product-info.js     # Lógica de detalle
│   ├── cart.js             # Lógica del carrito
│   ├── login.js            # Lógica de login
│   ├── my-profile.js       # Lógica del perfil
│   ├── user-display.js     # Display usuario en header
│   └── translate.js        # Sistema de traducción
│
├── img/                    # Imágenes
├── webfonts/               # Fuentes
│
├── README.md               # Este archivo
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet
- (Opcional) Servidor local

### Instalación

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/EmilianoCrause/proyecto_final.git
   cd proyecto_final
   ```

2. **Abrir en navegador**
   
   **Opción A: Directo**
   - Abrir `login.html` con doble clic

   **Opción B: Servidor local (recomendado)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server -p 8000
   
   # Abrir: http://localhost:8000/login.html
   ```

3. **Iniciar sesión**
   - Email: cualquier email válido
   - Contraseña: cualquier texto
   - Clic en "Ingresar"

---

## 💻 Guía de Uso

### Flujo Principal

```
Login → Index → Categorías → Productos → Detalle → Carrito → Checkout → Confirmación
```

### Por Página

#### 🏠 Index
- Carousel de productos destacados
- Acceso rápido a categorías principales
- Clic en producto → detalle
- Clic en categoría → productos

#### 📁 Categorías
- Grid de categorías
- Filtro por cantidad de productos
- Ordenamiento A-Z / Z-A
- Clic en categoría → productos

#### 🛍️ Productos
- Breadcrumb de navegación
- Búsqueda en tiempo real
- Filtros de precio
- Ordenamiento (precio ↑↓, relevancia)
- Clic en producto → detalle

#### 🔍 Detalle
- Galería de imágenes
- Información completa
- Sistema de comentarios
- Agregar al carrito
- Productos relacionados

#### 🛒 Carrito

**Layout:** 2 columnas
- **Izquierda:** Lista de productos
- **Derecha:** Checkout en 3 pasos

**Paso 1: Envío**
- Tipo (Premium/Express/Standard)
- Dirección completa

**Paso 2: Pago**
- Método (tarjeta/transferencia)
- Campos dinámicos

**Paso 3: Resumen**
- Subtotal + Envío + Total
- Finalizar compra

#### 👤 Perfil
- Ver/editar datos personales
- Imagen de perfil
- Validación de campos

---

## 🏗️ Arquitectura del Código

### Principios
- **DRY:** Funciones reutilizables
- **Modularidad:** Archivos por función
- **Consistencia:** Patrones uniformes
- **Separación:** CSS, JS, HTML organizados

### Scripts

**Orden de carga:**
```html
<script src="js/init.js"></script>        <!-- Constantes -->
<script src="js/utils.js"></script>       <!-- Utilidades -->
<script src="js/[pagina].js"></script>   <!-- Específico -->
<script src="js/user-display.js"></script><!-- Usuario -->
```

### Constantes Globales (`init.js`)

```javascript
// URLs API
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";

// Keys de localStorage
const STORAGE_KEYS = {
    USUARIO: "usuario",
    CAT_ID: "catID",
    PRODUCT_ID: "productID",
    DARK_MODE: "darkMode"
};
```

### Funciones Compartidas (`utils.js`)

```javascript
verificarUsuario()     // Verificar login
setProductID(id)       // Navegar a detalle
setCatID(id)          // Navegar a productos
initDarkMode()        // Inicializar modo oscuro
```

### Patrón JavaScript

```javascript
// Variables globales
let currentArray = [];

// Funciones de renderizado
function showList() { ... }

// Funciones de procesamiento
function filterData() { ... }

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    verificarUsuario();
    loadData();
    initDarkMode();
});
```

### CSS Modular

```
common.css
  ├── variables.css    (colores, tema oscuro)
  ├── reset.css       (estilos base)
  ├── header.css      (navegación)
  ├── footer.css      (footer)
  ├── components.css  (componentes)
  └── products.css    (productos)
```

---

## 🛒 Sistema de Carrito

### Funcionalidades
- Agregar/eliminar productos
- Modificar cantidades
- Conversión automática de monedas
- Checkout en 3 pasos
- Validaciones en tiempo real
- Persistencia de datos

### Checkout

**Paso 1: Envío**
- Tipo: Premium (15%), Express (7%), Standard (5%)
- Dirección completa

**Paso 2: Pago**
- Tarjeta: nombre, número, CVV, vencimiento
- Transferencia: titular, banco, CBU

**Paso 3: Resumen**
- Subtotal
- Costo de envío
- Total final

### Conversión de Monedas
- Tasa: 1 USD = 40 UYU
- Si hay al menos 1 USD → todo en USD
- Si solo UYU → todo en UYU

**Documentación completa:** [CART-DOCUMENTATION.md](CART-DOCUMENTATION.md)

---

## 🌐 API y Endpoints

**Base:** `https://japceibal.github.io/emercado-api/`

| Endpoint | Descripción |
|----------|-------------|
| `/cats/cat.json` | Lista de categorías |
| `/cats_products/{id}.json` | Productos por categoría |
| `/products/{id}.json` | Detalle de producto |
| `/products_comments/{id}.json` | Comentarios |
| `/user_cart/{id}.json` | Carrito de usuario |

### Ejemplo de Uso

```javascript
getJSONData(PRODUCTS_URL + "101" + EXT_TYPE)
    .then(result => {
        if (result.status === "ok") {
            console.log(result.data.products);
        }
    });
```

---

## 📚 Documentación Adicional

### Recursos
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Swiper.js](https://swiperjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🎨 UI/UX

### Modo Oscuro
- Toggle en header
- Persistente en localStorage
- Variables CSS
- Sin flash al cargar

### Responsive
- **Mobile:** < 576px
- **Tablet:** 576px - 991px
- **Desktop:** ≥ 992px

### Componentes
- Cards de producto
- Breadcrumbs
- Forms con validación
- SweetAlert2 personalizado

---

## 🔒 Almacenamiento

### LocalStorage
```javascript
"usuario"           // Email
"cart"              // Array de productos
"darkMode"          // true/false
"checkoutFormData"  // Datos del checkout
"profileImage"      // Imagen base64
```

### SessionStorage
```javascript
"usuario"  // Email (si no marcó "Recordarme")
```

---

## 🤝 Contribución

### Equipo
- **EmilianoCrause** - [GitHub](https://github.com/EmilianoCrause)
- Emiliano Crause
- Lourdes Maside
- Cristhian Fontes
- Marcos Hernández
- Emely González

### Cómo Contribuir

1. Fork del repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m "feat: nueva funcionalidad"`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Convenciones

**Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato
- `refactor:` Refactorización

**Código:**
- JavaScript: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- CSS: `kebab-case`
- Indentación: 4 espacios

---

## 🚧 Roadmap

### Futuro
- [ ] Backend con Node.js
- [ ] Base de datos
- [ ] Autenticación JWT
- [ ] Pasarela de pago real
- [ ] Panel de administración
- [ ] PWA

---

## 📞 Contacto

**Repositorio:** [github.com/EmilianoCrause/proyecto_final](https://github.com/EmilianoCrause/proyecto_final)

**Curso:** [Jóvenes a Programar](https://jovenesaprogramar.edu.uy/)

---

## 🙏 Agradecimientos

- **Jóvenes a Programar (JAP)** por la formación
- **Docentes** por el apoyo
- **Comunidad** por recursos y herramientas

---

## 📄 Licencia

Código abierto bajo los términos del curso Jóvenes a Programar.

---

<div align="center">

**Hecho con ❤️**

[⬆ Volver arriba](#-emercado---e-commerce-platform)

</div>
