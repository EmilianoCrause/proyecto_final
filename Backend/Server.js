require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const loginRouter = require("./routes/login");

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use("/api", loginRouter);

app.use("/emercado-api-main", express.static(path.join(__dirname,"emercado-api-main")));

app.get("/", (req, res) => {
    res.send("Backend eMercado funcionando");
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
