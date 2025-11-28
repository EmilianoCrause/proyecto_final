const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());

app.use("/emercado-api-main", express.static(path.join(__dirname,"emercado-api-main")));

app.get("/", (req, res) => {
    res.send("Backend eMercado funcionando");
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
