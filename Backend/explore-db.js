const db = require('./config/db');

console.log('🔍 EXPLORADOR DE BASE DE DATOS ECOMMERCE');
console.log('==========================================');

function showAllTables() {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        
        console.log('\n📊 TABLAS EN LA BASE DE DATOS:');
        tables.forEach(table => console.log(`  - ${table.name}`));
        
        showUsers();
    });
}

function showUsers() {
    console.log('\n👥 USUARIOS REGISTRADOS:');
    db.all("SELECT * FROM users", [], (err, users) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        
        if (users.length === 0) {
            console.log('  (No hay usuarios registrados)');
        } else {
            users.forEach(user => {
                console.log(`  - ID: ${user.id}, Usuario: ${user.username}, Email: ${user.email}`);
            });
        }
        
        showCarts();
    });
}

function showCarts() {
    console.log('\n🛒 CARRITOS GUARDADOS:');
    db.all("SELECT * FROM cart ORDER BY created_at DESC", [], (err, carts) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        
        if (carts.length === 0) {
            console.log('  (No hay carritos guardados)');
            process.exit(0);
            return;
        }
        
        console.log(`  Total de carritos: ${carts.length}`);
        
        let processed = 0;
        carts.forEach((cart, index) => {
            console.log(`\n  🛍️  CARRITO #${cart.id}`);
            console.log(`      Usuario ID: ${cart.user_id}`);
            console.log(`      Fecha: ${cart.created_at}`);
            
            // Mostrar items de este carrito
            db.all("SELECT * FROM cart_items WHERE cart_id = ?", [cart.id], (err, items) => {
                if (err) {
                    console.error('Error:', err);
                    return;
                }
                
                if (items.length > 0) {
                    console.log(`      Items (${items.length}):`);
                    items.forEach(item => {
                        console.log(`        - Producto ${item.product_id}: ${item.quantity} unidades`);
                    });
                } else {
                    console.log(`      (Sin items)`);
                }
                
                processed++;
                if (processed === carts.length) {
                    showProducts();
                }
            });
        });
    });
}

function showProducts() {
    console.log('\n📦 PRODUCTOS EN LA BASE DE DATOS:');
    db.all("SELECT * FROM products LIMIT 5", [], (err, products) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        
        if (products.length === 0) {
            console.log('  (No hay productos en la base de datos)');
        } else {
            products.forEach(product => {
                console.log(`  - ID: ${product.id}, Nombre: ${product.name}, Precio: ${product.currency} ${product.price}`);
            });
            if (products.length === 5) {
                console.log('  (Mostrando solo los primeros 5...)');
            }
        }
        
        console.log('\n✨ Exploración completada!');
        process.exit(0);
    });
}

// Iniciar exploración
console.log('Conectando a la base de datos...\n');
showAllTables();