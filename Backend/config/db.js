const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Crear o conectar a la base de datos SQLite
const dbPath = path.join(__dirname, '..', 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
        initDatabase();
    }
});

// Inicializar tablas si no existen
function initDatabase() {
    db.serialize(() => {
        // Tabla users
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear tabla users:', err);
            } else {
                console.log('Tabla users lista');
                insertDefaultUsers();
            }
        });

        // Tabla products
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                currency TEXT DEFAULT 'USD'
            )
        `);

        // Tabla cart
        db.run(`
            CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Tabla cart_items
        db.run(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cart_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                FOREIGN KEY (cart_id) REFERENCES cart(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);
    });
}

// Insertar usuarios predeterminados
async function insertDefaultUsers() {
    const defaultUsers = [
        { username: 'admin@emercado.com', password: 'admin123' }
    ];

    for (const user of defaultUsers) {
        db.get('SELECT * FROM users WHERE username = ?', [user.username], async (err, existingUser) => {
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
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
