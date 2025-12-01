const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    // Crear carrito
    db.run("INSERT INTO cart (user_id) VALUES (?)", [userId], function(err) {
        if (err) {
            console.error("Error al crear el carrito:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const cartId = this.lastID;

        // Insertar items
        let completed = 0;
        let hasError = false;

        items.forEach((item, index) => {
            db.run(
                "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
                [cartId, item.productId, item.quantity],
                (err) => {
                    if (err && !hasError) {
                        hasError = true;
                        console.error("Error al insertar item:", err);
                        return res.status(500).json({ error: "Error al guardar items del carrito" });
                    }

                    completed++;
                    
                    // Si terminamos de insertar todos los items
                    if (completed === items.length && !hasError) {
                        res.json({ message: "Carrito guardado exitosamente", cartId });
                    }
                }
            );
        });
    });
});

module.exports = router;
