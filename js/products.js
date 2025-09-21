const productList = document.getElementById('products-list-container'); //Id del HTML
const catID = localStorage.getItem("catID"); 
const URL = PRODUCTS_URL + catID + EXT_TYPE;

getJSONData(URL).then(function(resultObj) {
    if (resultObj.status === "ok") {
        const products = resultObj.data.products;

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'list-group-item list-group-item-action cursor-active';

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
             item.addEventListener("click", function() {
                localStorage.setItem("productID", product.id); // Guardamos id
                window.location = "product-info.html"; // Redirigimos
            });
            productList.appendChild(item);
        });
    } else {
        console.error("Error al cargar productos:", resultObj.data);
    }
    localStorage.setItem("catName", resultObj.data.catName);
});
