const productList = document.getElementById('products-list-container'); //Id del HTML
const API = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

fetch(API)
    .then(response => response.json())
    .then(data => {
        const products = data.products;

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'list-group-item list-group-item-action cursor-active'; //Class del HTML

            item.innerHTML = `
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>    
                    </div>
                </div>
            `;
            productList.appendChild(item);
        });
    })
    .catch(error => console.error('Error al cargar productos:', error));