# 🛒 eMercado - E-Commerce Platform

> Plataforma de comercio electrónico completa desarrollada como proyecto final del curso Jóvenes a Programar (JAP). Sistema web con carrito de compras, gestión de productos, perfiles de usuario, autenticación JWT y proceso de checkout completo.

[![GitHub](https://img.shields.io/badge/GitHub-Repositorio-blue?logo=github)](https://github.com/EmilianoCrause/proyecto_final)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

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

### 🔐 Autenticación (Backend + JWT)
- **Backend con Node.js + Express**
- **Base de datos SQLite** para almacenar usuarios
- **Autenticación JWT** con tokens de 1 hora
- **Contraseñas hasheadas** con bcrypt
- **Usuarios predeterminados:**
  - `admin@emercado.com` (contraseña: admin123)
  - `usuario1@emercado.com` (contraseña: 1234)
  - `test@emercado.com` (contraseña: test)
- Middleware de autorización protegiendo todas las rutas
- Token incluido en headers de todas las peticiones
- Opción "Recordarme" (localStorage/sessionStorage)
- Verificación de sesión en todas las páginas
- Redirección automática al expirar token
### 🛒 Carrito de Compras
- **Aislamiento por usuario** (cada usuario tiene su propio carrito)
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales
- Conversión de monedas (UYU ↔ USD)
- **Checkout en 3 pasos:**
  1. Envío (dirección + tipo de envío)
  2. Pago (tarjeta o transferencia)
  3. Resumen (totales y confirmación)
- Persistencia de datos del formulario por usuario
- Validaciones en tiempo real
- Funciones auxiliares: `getCart()` y `saveCart()`

### 🛍️ Productos y Categorías
- Listado dinámico desde API
- Filtros por precio (mín/máx)
- Búsqueda en tiempo real
- Ordenamiento (precio, relevancia)
- Detalle con galería de imágenes
- Sistema de comentarios con calificaciones
- Productos relacionados

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

### Backend
- **Node.js** - Entorno de ejecución
- **Express 5.1.0** - Framework web
- **SQLite3** - Base de datos
- **JWT (jsonwebtoken 9.0.2)** - Autenticación
- **bcrypt 6.0.0** - Hash de contraseñas
- **dotenv 17.2.3** - Variables de entorno
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### Librerías Frontend
- **Bootstrap 5** - Framework CSS
- **Font Awesome 5** - Iconos
- **Swiper.js** - Carousel de productos
- **SweetAlert2** - Alertas elegantes

### Herramientas
- Git & GitHub
- VS Code
- npm - Gestor de paquetes

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
├── Backend/                # Servidor Node.js
│   ├── Server.js           # Configuración principal del servidor
│   ├── .env                # Variables de entorno (JWT_SECRET, PORT)
│   ├── package.json        # Dependencias del backend
│   ├── users.db            # Base de datos SQLite (gitignored)
│   │
│   ├── routes/             # Rutas de la API
│   │   ├── login.js        # POST /login y /new_user
│   │   └── middleware/
│   │       └── auth.js     # Middleware de verificación JWT
│   │
│   ├── config/
│   │   └── database.js     # Configuración SQLite + usuarios default
│   │
│   └── emercado-api-main/  # Datos JSON de productos
│       ├── cats/
│       ├── cats_products/
│       ├── products/
│       └── products_comments/
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
│   ├── init.js             # Constantes globales, API y envío de JWT
│   ├── utils.js            # Funciones compartidas + getCart/saveCart
│   ├── index.js            # Lógica del index
│   ├── categories.js       # Lógica de categorías
│   ├── products.js         # Lógica de productos
│   ├── product-info.js     # Lógica de detalle + persistencia comentarios
│   ├── cart.js             # Lógica del carrito
│   ├── login.js            # Lógica de login + validación email
│   ├── my-profile.js       # Lógica del perfil + aislamiento por usuario
```
## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js 18+** y npm instalados
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet

### Instalación

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/EmilianoCrause/proyecto_final.git
   cd proyecto_final
   ```

2. **Configurar Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en carpeta `Backend/`:
   ```env
   JWT_SECRET= proyectofinal123
   PORT= 3000
   ```

4. **Iniciar servidor backend**
   ```bash
   # Desde la carpeta Backend/
   node Server.js
   ```
   
   Deberías ver:
   ```
   Servidor escuchando en http://localhost:3000
   Conectado a la base de datos SQLite
   Tabla users lista
   ✓ Usuario predeterminado creado: admin@emercado.com
   ✓ Usuario predeterminado creado: test@emercado.com
   ✓ Usuario predeterminado creado: usuario1@emercado.com
   ```

5. **Abrir Frontend**
   
   En otra terminal, desde la raíz del proyecto:
   
   **Opción A: Live Server (VS Code)**
   - Instalar extensión "Live Server"
   - Clic derecho en `login.html` → "Open with Live Server"
   - URL: `http://127.0.0.1:5500/login.html`

   **Opción B: Python**
   ```bash
   python -m http.server 5500
   ```
   
   **Opción C: Node.js**
   ```bash
   npx http-server -p 5500
   ```
   
   Luego abrir: `http://127.0.0.1:5500/login.html`

6. **Iniciar sesión**
   
   Usar uno de los usuarios predeterminados:
   - **Email:** `admin@emercado.com` | **Contraseña:** `admin123`
   - **Email:** `usuario1@emercado.com` | **Contraseña:** `1234`
   - **Email:** `test@emercado.com` | **Contraseña:** `test`

### ⚠️ Importante
- El backend debe estar corriendo en el puerto **3000**
- El frontend debe estar en el puerto **5500** (configurado en CORS)
- Si usas otro puerto para el frontend, actualiza el CORS en `Backend/Server.js`

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
// Base URL del backend local
const BASE_URL = "http://localhost:3000/emercado-api-main";

// URLs API
const PRODUCTS_URL = `${BASE_URL}/cats_products/`;
const PRODUCT_INFO_URL = `${BASE_URL}/products/`;

// Keys de localStorage
const STORAGE_KEYS = {
    USUARIO: "usuario",
    CAT_ID: "catID",
    PRODUCT_ID: "productID",
    DARK_MODE: "darkMode"
};

// Función que agrega token JWT a todas las peticiones
function getJSONData(url) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    return fetch(url, { headers })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                // Token expirado - redirigir a login
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                window.location.href = 'login.html';
            }
            return response.json();
        });
}
```

### Funciones Compartidas (`utils.js`)

```javascript
verificarUsuario()     // Verificar login + token válido
logout()               // Cerrar sesión y limpiar datos
getCart()              // Obtener carrito del usuario actual
saveCart(cart)         // Guardar carrito del usuario actual
setProductID(id)       // Navegar a detalle
setCatID(id)           // Navegar a productos
initDarkMode()         // Inicializar modo oscuro
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

## 🔐 Arquitectura de Seguridad y Datos

### Backend (Node.js + Express)

#### Autenticación JWT
```javascript
// POST /api/login
{
  "username": "admin@emercado.com",
  "password": "admin123"
}

// Respuesta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Middleware de Autorización
- Todas las rutas `/emercado-api-main/*` requieren token JWT
- Token enviado en header: `Authorization: Bearer <token>`
- Token válido por 1 hora
- Redirección automática al login si expira

#### Base de Datos SQLite
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,  -- Hash bcrypt
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Aislamiento de Datos por Usuario

#### Carritos
```javascript
// Cada usuario tiene su propio carrito
localStorage: cart_admin@emercado.com
localStorage: cart_test@emercado.com
```

#### Perfiles
```javascript
// Datos de perfil aislados
localStorage: profile_admin@emercado.com
// Estructura: { nombre, apellido, telefono, profileImage }
```

#### Comentarios
```javascript
// Comentarios persistidos por producto
localStorage: comments_40281
localStorage: comments_50741
```

### Flujo de Autenticación

```
1. Usuario ingresa email + password
   ↓
2. Frontend → POST /api/login (backend)
   ↓
3. Backend valida con SQLite + bcrypt
   ↓
4. Backend genera JWT y lo devuelve
   ↓
5. Frontend guarda token en localStorage
   ↓
6. Frontend agrega token en todas las peticiones
   ↓
7. Middleware verifica token antes de cada request
```

---

## 🛒 Sistema de Carrito

### Funcionalidades
- **Aislamiento por usuario** con `getCart()` y `saveCart()`
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

### Backend Local (Puerto 3000)

#### Endpoints de Autenticación (Públicos)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/login` | Autenticación de usuario | `{ username, password }` |
| POST | `/api/new_user` | Crear nuevo usuario | `{ username, password }` |

#### Endpoints Protegidos (Requieren JWT)

**Base:** `http://localhost:3000/emercado-api-main/`

| Endpoint | Descripción |
|----------|-------------|
| `/cats/cat.json` | Lista de categorías |
| `/cats_products/{id}.json` | Productos por categoría |
| `/products/{id}.json` | Detalle de producto |
| `/products_comments/{id}.json` | Comentarios |
| `/user_cart/{id}.json` | Carrito de usuario |
| `/cart/buy.json` | Datos de compra |

### Ejemplo de Uso

```javascript
// Login
fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'admin@emercado.com',
        password: 'admin123'
    })
})
.then(res => res.json())
.then(data => {
    localStorage.setItem('token', data.token);
});

// Obtener productos (con token)
const token = localStorage.getItem('token');
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
- **Emiliano Crause** - [GitHub](https://github.com/EmilianoCrause)
- **Lourdes Maside** - [GitHub](https://github.com/lou-maoli-611)
- **Cristhian Fontes** - [GitHub](https://github.com/CristhianMarc)
- **Marcos Hernández** - [GitHub](https://github.com/mhernandez234)
- **Emely González** - [GitHub](https://github.com/eme-bass)

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

### ✅ Completado
- [x] Backend con Node.js + Express
- [x] Base de datos SQLite
- [x] Autenticación JWT
- [x] Middleware de autorización
- [x] Hash de contraseñas con bcrypt
- [x] Aislamiento de datos por usuario
- [x] Validación de email en login

### Futuro
- [ ] Registro de usuarios desde el frontend
- [ ] Pasarela de pago real
- [ ] Panel de administración
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Chat de soporte

---

## 🔧 Solución de Problemas

### Error: "Token no proporcionado" o "Token inválido"
**Causa:** El token JWT expiró o no existe  
**Solución:** 
1. Cerrar sesión
2. Volver a iniciar sesión
3. El sistema generará un nuevo token

### Error: "Error al cargar los productos"
**Causa:** Backend no está corriendo  
**Solución:**
```bash
cd Backend
node Server.js
```

### Error: CORS Policy
**Causa:** Frontend corriendo en puerto diferente a 5500  
**Solución:** Actualizar `Backend/Server.js`:
```javascript
app.use(cors({
    origin: 'http://127.0.0.1:TU_PUERTO',  // Cambiar puerto
    credentials: true
}));
```

### Base de datos corrupta
**Solución:**
```bash
cd Backend
Remove-Item users.db -ErrorAction SilentlyContinue
node Server.js  # Recreará la BD con usuarios default
```

### Frontend no carga recursos estáticos
**Causa:** Rutas relativas incorrectas  
**Solución:** Usar Live Server o servidor local en puerto 5500

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
