const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const users = [];

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validar que envían datos
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // 2. Buscar usuario
    const user = users.find(u => u.username === username);
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

router.post('/new_user', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validar datos
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // 2. Verificar si el usuario ya existe
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ error: 'El usuario ya existe' });
    }

    try {
        // 3. Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Crear usuario nuevo
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword
        };

        // 5. Guardar usuario en "BD" (array)
        users.push(newUser);

        // 6. Respuesta
        res.status(201).json({
            message: "Usuario creado exitosamente",
            user: { id: newUser.id, username: newUser.username }
        });

    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

module.exports = router;
