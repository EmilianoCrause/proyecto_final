# Configuración del Backend - E-commerce

## Requisitos previos
- Node.js instalado

## Instalación

1. **Instalar dependencias**
   ```bash
   cd Backend
   npm install
   ```

2. **Base de datos SQLite**

   ¡No necesitás configurar nada! La base de datos SQLite (`ecommerce.db`) se crea automáticamente al iniciar el servidor por primera vez. Las tablas se crean automáticamente.

3. **Variables de entorno**

   El archivo `.env` ya está configurado:
   ```
   JWT_SECRET=proyectofinal123
   PORT=3000
   ```

4. **Iniciar el servidor**
   ```bash
   npm start
   ```

   El servidor debería iniciar en `http://localhost:3000`

## Endpoints disponibles

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/new_user` - Registrar nuevo usuario

### Carrito (requiere autenticación)
- `POST /api/cart` - Guardar carrito de compras
  
  **Body:**
  ```json
  {
    "userId": 1,
    "items": [
      {
        "productId": 40281,
        "quantity": 2
      }
    ]
  }
  ```

### Archivos estáticos (requiere autenticación)
- `GET /emercado-api-main/*` - Acceso a los JSONs de productos

## Estructura de la base de datos

- **users**: Almacena usuarios registrados
- **products**: Catálogo de productos
- **cart**: Carritos de compra creados
- **cart_items**: Items individuales de cada carrito

## Notas importantes

- El token JWT expira en 1 hora
- Todas las rutas del carrito y archivos estáticos requieren autenticación con token Bearer
- Asegurate de tener MySQL corriendo antes de iniciar el servidor
