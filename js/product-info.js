document.addEventListener("DOMContentLoaded", function () {
	if (!verificarUsuario()) return;

	const productInfoContainer = document.getElementById("product-info-container");
	const relatedList = document.getElementById("related-products-list");
	const breadcrumb = document.getElementById("breadcrumb-container");
	const catName = localStorage.getItem("catName") || "Categoría";

	const productID = localStorage.getItem("productID");
	if (!productID) {
		productInfoContainer.innerHTML = '<div class="alert alert-warning">No se encontró productID en localStorage.</div>';
		return;
	}

	const infoURL = PRODUCT_INFO_URL + productID + EXT_TYPE;

	// Cargar info del producto actual
	getJSONData(infoURL).then(function (resultObj) {
		if (resultObj.status !== "ok") {
			productInfoContainer.innerHTML = '<div class="alert alert-danger">Error al cargar información del producto.</div>';
			return;
		}

		const product = resultObj.data;

		// Actualizar catID y catName basándose en la categoría del producto
		// Si el producto tiene información de categoría, actualizarla
		if (product.category) {
			localStorage.setItem(STORAGE_KEYS.CAT_ID, product.category);
			
			// Mapeo de nombres de categorías comunes
			const categoryNames = {
				"101": "Autos",
				"102": "Juguetes", 
				"103": "Muebles",
				"104": "Herramientas",
				"105": "Computadoras",
				"106": "Vestimenta",
				"107": "Electrodomésticos",
				"108": "Deporte",
				"109": "Celulares"
			};
			
			const catNameToSave = categoryNames[product.category] || catName;
			localStorage.setItem(STORAGE_KEYS.CAT_NAME, catNameToSave);
		}

		productInfoContainer.innerHTML = `
      <div class="row align-items-start" style="margin-top:1.5rem; margin-bottom:2rem;">
        <div class="col-lg-7">
          <!-- contenedor imagen principal + miniaturas (mantén la tuya si ya la tenés) -->
          <div class="d-flex border p-3" style="gap:1rem;">
            <div style="flex:1; display:flex; align-items:center; justify-content:center; min-height:260px;">
              <img id="main-image" src="${product.images && product.images[0] ? product.images[0] : ''}" class="img-fluid" style="max-height:350px; object-fit:contain;">
            </div>
            <div class="d-flex flex-column" style="width:90px; gap:8px;">
              ${(product.images || []).map((img, i) => `
                <div class="thumb-wrapper" style="width:90px; height:90px; border:1px solid #000; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                  <img src="${img}" class="product-thumb" data-img="${img}" style="width:100%; height:100%; object-fit:cover; cursor:pointer;">
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="col-lg-5 d-flex flex-column" style="min-height:350px;">
          <small class="text-muted mb-2">${product.soldCount || 0} vendidos</small>
          <h2 class="mb-3">${product.name || ''}</h2>
          <div class="mb-3" style="max-height:90px; overflow:hidden;">
            <p class="mb-0">${product.description || ''}</p>
          </div>
          <h4 class="text-success mb-3">${product.currency || ''} ${product.cost !== undefined ? product.cost : ''}</h4>

          <!-- Si NO querés cambiar la parte superior, sacá este botón o ajustalo -->
          <button id="buyBtnTop" class="btn btn-buy align-self-start mt-auto">Comprar</button>
        </div>
      </div>
    `;

		// Funcionalidad del botón "Comprar" 
		const buyBtn = document.getElementById("buyBtnTop");

		if (buyBtn) {
  			buyBtn.addEventListener("click", function () {
    			// Recupera carrito actual (si no existe, crea uno vacío)
    			let cart = JSON.parse(localStorage.getItem("cart")) || [];

    			// Crear objeto del producto a guardar
    			const productToBuy = {
      				id: product.id,
      				name: product.name,
      				cost: product.cost,
      				currency: product.currency,
      				image: (product.images && product.images[0]) || "",
      				count: 1
    			};

    			// Verificar si ya está en el carrito
    			const existingProduct = cart.find(item => item.id === productToBuy.id);
    			if (existingProduct) {
      				existingProduct.count += 1;
    			} else {
      				cart.push(productToBuy);
    			}

    			// Guardar carrito actualizado
    			localStorage.setItem("cart", JSON.stringify(cart));

    			// Redirigir a la pantalla del carrito
    			window.location.href = "cart.html";
  			});
		}	

		// Miniaturas: clic -> reemplaza imagen principal
		document.querySelectorAll(".product-thumb").forEach((thumb) => {
			thumb.addEventListener("click", function () {
				const src = this.dataset.img;
				const mainImg = document.getElementById("main-image");
				if (mainImg) mainImg.src = src;

				// marcar seleccionado
				document.querySelectorAll(".thumb-wrapper").forEach(w => w.style.outline = "none");
				this.parentElement.style.outline = "2px solid #efa639";
			});
		});

		// Productos relacionados
		// Si tenemos catID en localStorage, pedimos todos los productos de la categoría y construimos
		// una lista completa para mostrar precios y descripciones (evita campos faltantes).
		const catID = localStorage.getItem("catID");

		function renderRelated(relatedItems) {
			if (!relatedItems || relatedItems.length === 0) {
				relatedList.innerHTML = '<div class="text-muted">No hay productos relacionados.</div>';
				return;
			}

			// Limitar cantidad muestra (ej.: hasta 10)
			const toShow = relatedItems.slice(0, 10);
			const html = toShow.map(p => `
        <div class="col-10 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
          <div class="card related-card h-100 cursor-pointer" data-id="${p.id}">
            <img src="${p.image || ''}" class="card-img-top" style="height:100px; object-fit:cover;">
            <div class="card-body p-2 d-flex flex-column">
              <h6 class="card-title text-truncate mb-1">${p.name || ''}</h6>
              <p class="card-text small text-muted text-truncate mb-2">${p.description ? p.description : ''}</p>
              <div class="mt-auto"><span class="price">${p.currency ? p.currency + ' ' : ''}${p.cost !== undefined ? p.cost : ''}</span></div>
            </div>
          </div>
        </div>
      `).join("");

			relatedList.innerHTML = html;

			// click en cada card -> abrir ese producto
			document.querySelectorAll(".related-card").forEach(card => {
				card.addEventListener("click", function () {
					const id = this.dataset.id;
					localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
					// Mantener la categoría actual al navegar a productos relacionados
					window.location = "product-info.html";
				});
			});
		}

		// Si hay catID pedimos la lista de la categoría (más info), si no, usamos product.relatedProducts
		if (catID) {
			getJSONData(PRODUCTS_URL + catID + EXT_TYPE).then(function (resCat) {
				if (resCat.status === "ok") {
					const all = resCat.data.products || [];
					// Mapeo por id para buscar info completa
					const map = {};
					all.forEach(p => map[p.id] = p);

					// product.relatedProducts puede venir con objetos o con ids; normalizamos:
					const relFromProduct = (product.relatedProducts && product.relatedProducts.length) ? product.relatedProducts : [];
					let relatedFull = [];

					relFromProduct.forEach(r => {
						const id = (typeof r === 'object') ? r.id : r;
						if (map[id]) {
							relatedFull.push(map[id]);
						} else if (typeof r === 'object') {
							relatedFull.push(r); // fallback
						}
					});

					// Rellenamos con otros productos de la categoría (excluyendo el actual) hasta tener 10
					for (let p of all) {
						if (relatedFull.length >= 10) break;
						if (p.id == product.id) continue;
						if (!relatedFull.find(x => x.id == p.id)) relatedFull.push(p);
					}

					renderRelated(relatedFull);
				} else {
					// fallback: usar lo que vino en product
					const fallback = (product.relatedProducts || []).map(r => (typeof r === 'object' ? r : { id: r, name: '', image: '' }));
					renderRelated(fallback);
				}
			});
		} else {
			// no catID: usar únicamente lo que trae product.relatedProducts
			const fallback = (product.relatedProducts || []).map(r => (typeof r === 'object' ? r : { id: r, name: '', image: '' }));
			renderRelated(fallback);
		}
		// Actualizar breadcrumb con la categoría actualizada
		const updatedCatName = localStorage.getItem(STORAGE_KEYS.CAT_NAME) || "Categoría";
		breadcrumb.innerHTML = `
  <li class="breadcrumb-item"><a href="index.html">Home</a></li>
  <li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
  <li class="breadcrumb-item"><a href="products.html">${updatedCatName}</a></li>
  <li class="breadcrumb-item active" aria-current="page">${product.name}</li>
`;
	});

	const commentsContainer = document.getElementById("comments-container");
	const commentsURL = PRODUCT_INFO_COMMENTS_URL + productID + EXT_TYPE;

	getJSONData(commentsURL).then(function (res) {
		if (res.status !== "ok") {
			commentsContainer.innerHTML = '<div class="alert alert-warning">No se pudieron cargar los comentarios.</div>';
			return;
		}

		const comments = res.data;

		if (!comments.length) {
			commentsContainer.innerHTML = '<p class="text-muted">No hay comentarios para este producto.</p>';
			return;
		}

		// Renderizar comentarios y formulario
		let commentsHTML = '<p class="text-muted">No hay comentarios para este producto.</p>';
		if (comments.length) {
			commentsHTML = comments.map(c => `
        <div class="comment">
          <div class="comment-header">
            <span class="comment-user">${c.user}</span>
            <span class="comment-date">${c.dateTime}</span>
          </div>
          <div class="comment-body">
            <div>${renderStars(c.score)}</div>
            <p>${c.description}</p>
          </div>
        </div>
      `).join('');
		}

		commentsContainer.innerHTML = `
      <div class="comments-layout">
        <div class="comments-list">
          <h4 class="mb-3">Comentarios</h4>
          <div id="cont-comment">
            ${commentsHTML}
          </div>
        </div>
        </div>
      </div>
    `;

		const commentForm = document.querySelector("#reviewForm");
		const commentText = commentForm.querySelector("#comment-text");
		const commentsList = commentsContainer.querySelector("#cont-comment");

		commentForm.addEventListener("submit", function (e) {
			e.preventDefault();

			const text = commentText.value.trim();
			const commentScore = commentForm.querySelector('input[name="star"]:checked');
			const score = commentScore ? parseInt(commentScore.value) : NaN;
			const user = localStorage.getItem("usuario") || sessionStorage.getItem("usuario") || "Usuario actual";

			if (!text || isNaN(score) || score < 1 || score > 5) {
				alert("Por favor ingresa un comentario y selecciona una puntuación válida (1–5).");
				return;
			}

			// Crear fecha actual 
			const now = new Date();
			const formattedDate = now.toLocaleString("es-ES", {
				year: "numeric", month: "2-digit", day: "2-digit",
				hour: "2-digit", minute: "2-digit"
			});

			// Crear nuevo comentario
			const newCommentHTML = `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-user">${user}</span>
        <span class="comment-date">${formattedDate}</span>
      </div>
      <div class="comment-body">
        <div>${renderStars(score)}</div>
        <p>${text}</p>
      </div>
    </div>
  `;

			// Insertar al final de la lista de comentarios
			commentsList.insertAdjacentHTML("beforeend", newCommentHTML);

			// Limpiar formulario
			commentText.value = "";
			const allRadios = commentForm.querySelectorAll('.comment-score');
			allRadios.forEach(r => r.checked = false);
		});

		// Función para mostrar estrellas según score
		function renderStars(score) {
			let stars = "";
			for (let i = 1; i <= 5; i++) {
				stars += i <= score ? "★" : "☆";
			}
			return `<span class="text-warning">${stars}</span>`;
		}
	});

	initDarkMode();
	initLanguageSelector();
});