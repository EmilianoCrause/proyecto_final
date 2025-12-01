// Script para simular una inserción directa en la base de datos
const db = require('./config/db');

async function testDirectCartSave() {
    console.log('🧪 Probando guardar carrito directamente en la base de datos...');
    
    const userId = 1;
    const items = [
        { productId: 40281, quantity: 2 },
        { productId: 50741, quantity: 1 }
    ];

    console.log('Datos del carrito:');
    console.log('- Usuario ID:', userId);
    console.log('- Items:', items);

    // Crear carrito
    db.run("INSERT INTO cart (user_id) VALUES (?)", [userId], function(err) {
        if (err) {
            console.error("❌ Error al crear el carrito:", err);
            return;
        }

        const cartId = this.lastID;
        console.log('✅ Carrito creado con ID:', cartId);

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
                        console.error("❌ Error al insertar item:", err);
                        return;
                    }

                    completed++;
                    console.log(`✅ Item ${completed} guardado: Producto ${item.productId}, Cantidad ${item.quantity}`);
                    
                    // Si terminamos de insertar todos los items
                    if (completed === items.length && !hasError) {
                        console.log('🎉 ¡Carrito guardado exitosamente!');
                        
                        // Verificar lo que se guardó
                        db.all("SELECT * FROM cart WHERE id = ?", [cartId], (err, carts) => {
                            if (!err && carts.length > 0) {
                                console.log('📦 Carrito guardado:', carts[0]);
                            }
                            
                            db.all("SELECT * FROM cart_items WHERE cart_id = ?", [cartId], (err, items) => {
                                if (!err) {
                                    console.log('📝 Items del carrito:', items);
                                }
                                process.exit(0);
                            });
                        });
                    }
                }
            );
        });
    });
}

testDirectCartSave();