require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const loginRouter = require("./routes/login");
const authMiddleware = require("./routes/middleware/auth");
const cartRoutes = require("./routes/cart");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:8080', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Rutas públicas (login)
app.use("/api", loginRouter);

// Endpoint del carrito (protegido)
app.use("/api/cart", authMiddleware, cartRoutes);

// Rutas protegidas - Requieren autenticación para acceder a los datos del eCommerce
app.use("/emercado-api-main", authMiddleware, express.static(path.join(__dirname,"emercado-api-main")));

app.get("/", (req, res) => {
    res.send("Backend eMercado funcionando");
});

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Mantener el servidor corriendo
server.on('error', (err) => {
    console.error('Error en el servidor:', err);
});

process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    server.close();
    process.exit(0);
});
