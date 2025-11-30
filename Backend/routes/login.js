const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validar que envían datos
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // 2. Buscar usuario en la base de datos
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 4. Generar token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Devolver token
        res.json({ token });
    });
});

router.post('/new_user', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validar datos
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // 2. Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insertar usuario en la base de datos
        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            function(err) {
                if (err) {
                    // Error de usuario duplicado
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ error: 'El usuario ya existe' });
                    }
                    return res.status(500).json({ error: 'Error al crear usuario' });
                }

                // 4. Respuesta con el ID generado automáticamente
                res.status(201).json({
                    message: "Usuario creado exitosamente",
                    user: { id: this.lastID, username: username }
                });
            }
        );

    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

module.exports = router;
