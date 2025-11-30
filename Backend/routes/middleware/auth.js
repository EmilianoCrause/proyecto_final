const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    // 1. Validar que venga el header
    if (!authHeader) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Formato esperado: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Formato de autorización inválido" });
    }

    try {
        // 2. Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Adjuntar usuario decodificado al request
        req.user = decoded; // { id, username }

        // 4. Pasar al siguiente middleware / ruta
        next();

    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
}

module.exports = authMiddleware;