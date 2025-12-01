const db = require('./config/db');

console.log('Verificando la base de datos...');

// Verificar tabla cart
db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
    if (err) {
        console.error('Error al consultar tablas:', err);
        return;
    }
    
    console.log('Tablas creadas:', tables.map(t => t.name));
    
    // Verificar carritos guardados
    db.all("SELECT * FROM cart", [], (err, carts) => {
        if (err) {
            console.error('Error al consultar carritos:', err);
            return;
        }
        
        console.log('Carritos guardados:', carts.length);
        if (carts.length > 0) {
            console.log('Último carrito:', carts[carts.length - 1]);
            
            // Ver items del último carrito
            const lastCartId = carts[carts.length - 1].id;
            db.all("SELECT * FROM cart_items WHERE cart_id = ?", [lastCartId], (err, items) => {
                if (err) {
                    console.error('Error al consultar items:', err);
                    return;
                }
                console.log('Items del carrito:', items);
                process.exit(0);
            });
        } else {
            console.log('No hay carritos guardados aún.');
            process.exit(0);
        }
    });
});