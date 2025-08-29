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
                    <div class="col-12 col-md-3">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid img-thumbnail mb-3 mb-md-0">
                    </div>
                    <div class="col-12 col-md-9">
                        <h4 class="mb-2">${product.name}</h4>
                        <p class="mb-2">${product.description}</p>
                        <p class="text-end text-md-start fw-bold">
                        ${product.currency} ${product.cost}
                        </p>
                        <small class="text-muted d-block text-md-start text-end">
                        ${product.soldCount} vendidos
                        </small>
                    </div>
                </div>
            `;
            productList.appendChild(item);
        });
    })
    .catch(error => console.error('Error al cargar productos:', error));