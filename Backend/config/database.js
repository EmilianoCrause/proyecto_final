const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Crear/conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Crear tabla de usuarios y usuarios predeterminados
db.serialize(() => {
    // 1. Crear tabla
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear tabla users:', err);
        } else {
            console.log('Tabla users lista');
            
            // 2. Insertar usuarios predeterminados (solo si no existen)
            insertDefaultUsers();
        }
    });
});

// Función para insertar usuarios predeterminados
async function insertDefaultUsers() {
    const defaultUsers = [
        { username: 'admin@emercado.com', password: 'admin123' },
        { username: 'usuario1@emercado.com', password: '1234' },
        { username: 'test@emercado.com', password: 'test' }
    ];

    for (const user of defaultUsers) {
        // Verificar si el usuario ya existe
        db.get('SELECT * FROM users WHERE username = ?', [user.username], async (err, existingUser) => {
            if (!existingUser) {
                // Hashear contraseña
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Insertar usuario
                db.run(
                    'INSERT INTO users (username, password) VALUES (?, ?)',
                    [user.username, hashedPassword],
                    (err) => {
                        if (err) {
                            console.error(`Error al crear usuario ${user.username}:`, err.message);
                        } else {
                            console.log(`✓ Usuario predeterminado creado: ${user.username}`);
                        }
                    }
                );
            }
        });
    }
}

module.exports = db;
