const productList = document.getElementById('productList'); //Id del HTML
const API = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

fetch(API)
    .then(response => response.json())
    .then(data => {
        const products = data.products;

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'product-item'; //Class del HTML

            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-desc">${product.description}</div>
                    <div class="product-price-sold">
                        Precio: ${product.currency} ${product.cost} | Vendidos: ${product.soldCount}
                    </div>
                </div>
            `;
            productList.appendChild(item);
        });
    })
    .catch(error => console.error('Error al cargar productos:', error));