document.addEventListener("DOMContentLoaded", function () {
	if (!verificarUsuario()) return;

	const productInfoContainer = document.getElementById("product-info-container");
	const relatedList = document.getElementById("related-products-list");
	const breadcrumb = document.getElementById("breadcrumb-container");
	const catName = localStorage.getItem("catName") || "Categoría";

	const productID = localStorage.getItem("productID");
	if (!productID) {
		productInfoContainer.innerHTML = '<div class="alert alert-warning">No se encontró el producto.</div>';
		return;
	}

	const infoURL = PRODUCT_INFO_URL + productID + EXT_TYPE;
	getJSONData(infoURL).then(function (resultObj) {
		if (resultObj.status !== "ok") {
			productInfoContainer.innerHTML = '<div class="alert alert-danger">Error al cargar información del producto.</div>';
			return;
		}

		const product = resultObj.data;

		if (product.category) {
			localStorage.setItem(STORAGE_KEYS.CAT_ID, product.category);

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
			<div class="product-row">
				<div class="product-images-column">
				  <div class="image-area">
					<div class="main-image-wrapper">
					  <img id="main-image" src="${product.images && product.images[0] ? product.images[0] : ''}" class="main-image">
					</div>
					<div class="thumbs-col">
					  ${(product.images || []).map((img, i) => `
						<div class="thumb-wrapper">
						  <img src="${img}" class="product-thumb" data-img="${img}">
						</div>
					  `).join('')}
					</div>
				  </div>
				</div>

				<div class="product-details-column">
					<div class="product-detail-panel">
						<small class="product-detail-soldCount">${product.soldCount || 0} vendidos</small>
						<h2 class="product-detail-title">${product.name || ''}</h2>
						<div class="product-detail-desc">
							<p>${product.description || ''}</p>
						</div>
						<h4 class="product-detail-price">${product.currency || ''} ${product.cost !== undefined ? product.cost : ''}</h4>
						<div class="botones">
							<button id="addToCartBtn" class="product-btn">Agregar al carrito</button>
							<button id="buyBtnTop" class="comprar-btn">Comprar</button>
						</div>
					</div>
				</div>
			</div>
	    `;

		const buyBtn = document.getElementById("buyBtnTop");
		const addBtn = document.getElementById("addToCartBtn");

		function addProductToCart(redirect = false) {
			let cart = JSON.parse(localStorage.getItem("cart")) || [];
			const productToBuy = {
				id: product.id,
				name: product.name,
				cost: product.cost,
				currency: product.currency,
				image: (product.images && product.images[0]) || "",
				count: 1
			};
			const existingProduct = cart.find(item => item.id === productToBuy.id);
			if (existingProduct) {
				existingProduct.count += 1;
			} else {
				cart.push(productToBuy);
			};
			localStorage.setItem("cart", JSON.stringify(cart));

			const badge = document.getElementById("cart-badge");
			if (badge) {
				const totalCantidad = cart.reduce((acc, item) => acc + (item.count || 0), 0);
				badge.textContent = totalCantidad;
			}

			if (redirect) {
				window.location.href = "cart.html";
			}
		}

		if (addBtn) {
			addBtn.addEventListener("click", function (e) {
				e.preventDefault();
				addProductToCart(false);
				Swal.fire({
                    toast: true,
                    position: 'top',
                    icon: 'success',
                    title: 'Producto agregado',
                    text: 'Podrás ver tus productos en el carrito de compras.',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
					background: getComputedStyle(document.documentElement)
                		.getPropertyValue('--card-bg'),
  					color: getComputedStyle(document.documentElement)
                		.getPropertyValue('--font-color')
                });
				setTimeout(() => addBtn.textContent = "Agregar al carrito", 1200);
			});
		}

		if (buyBtn) {
			buyBtn.addEventListener("click", function (e) {
				e.preventDefault();
				addProductToCart(true);
			});
		}

		document.querySelectorAll(".product-thumb").forEach((thumb) => {
			thumb.addEventListener("click", function () {
				const src = this.dataset.img;
				const mainImg = document.getElementById("main-image");
				if (mainImg) mainImg.src = src;

				document.querySelectorAll(".thumb-wrapper").forEach(w => w.classList.remove('selected'));
				this.parentElement.classList.add('selected');
			});
		});

		const catID = localStorage.getItem("catID");

		function renderRelated(relatedItems) {
			if (!relatedItems || relatedItems.length === 0) {
				relatedList.innerHTML = '<div class="text-muted">No hay productos relacionados.</div>';
				return;
			}

			const toShow = relatedItems.slice(0, 10);
			const html = toShow.map(p => `
					<div class="product-card" data-id="${p.id}">
						<div class="product-image-wrapper">
							<img src="${p.image || ''}" alt="${p.name || ''}" class="product-image">
							<div class="sold-badge">${p.soldCount || ''} ${p.soldCount ? 'vendidos' : ''}</div>
						</div>
						<div class="product-content">
							<div class="product-header">
								<h4 class="product-title">${p.name || ''}</h4>
								<p class="product-description">${p.description ? p.description : ''}</p>
							</div>
							<div class="product-price">${p.currency ? p.currency + ' ' : ''}${p.cost !== undefined ? p.cost : ''}</div>
							<div class="product-action">
								<button class="product-btn">Ver detalles</button>
							</div>
						</div>
					</div>
				`).join("");

			relatedList.innerHTML = html;

			document.querySelectorAll(".product-card").forEach(card => {
				card.addEventListener("click", function () {
					const id = this.dataset.id;
					localStorage.setItem(STORAGE_KEYS.PRODUCT_ID, id);
					window.location = "product-info.html";
				});
			});
		}

		if (catID) {
			getJSONData(PRODUCTS_URL + catID + EXT_TYPE).then(function (resCat) {
				if (resCat.status === "ok") {
					const all = resCat.data.products || [];
					const map = {};
					all.forEach(p => map[p.id] = p);

					const relFromProduct = (product.relatedProducts && product.relatedProducts.length) ? product.relatedProducts : [];
					let relatedFull = [];

					relFromProduct.forEach(r => {
						const id = (typeof r === 'object') ? r.id : r;
						if (map[id]) {
							relatedFull.push(map[id]);
						} else if (typeof r === 'object') {
							relatedFull.push(r);
						}
					});

					for (let p of all) {
						if (relatedFull.length >= 10) break;
						if (p.id == product.id) continue;
						if (!relatedFull.find(x => x.id == p.id)) relatedFull.push(p);
					}

					renderRelated(relatedFull);
				} else {
					const fallback = (product.relatedProducts || []).map(r => (typeof r === 'object' ? r : { id: r, name: '', image: '' }));
					renderRelated(fallback);
				}
			});
		} else {
			const fallback = (product.relatedProducts || []).map(r => (typeof r === 'object' ? r : { id: r, name: '', image: '' }));
			renderRelated(fallback);
		}

		const updatedCatName = localStorage.getItem(STORAGE_KEYS.CAT_NAME) || "Categoría";
		breadcrumb.innerHTML = `
	<li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
	<li class="breadcrumb-item"><a href="categories.html">Categorías</a></li>
	<li class="breadcrumb-item"><a href="products.html">${updatedCatName}</a></li>
	<li class="breadcrumb-item active" aria-current="page">${product.name}</li>
	`;
	});

	const commentsContainer = document.getElementById("comments-container");
	const ratingSummaryContainer = document.getElementById("rating-summary-container");
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

		function updateRatingSummary(commentsArray) {
			const totalComments = commentsArray.length;
			const scoreDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
			let totalScore = 0;

			commentsArray.forEach(c => {
				scoreDistribution[c.score]++;
				totalScore += c.score;
			});

			const averageScore = (totalScore / totalComments).toFixed(1);

			const rankingHTML = `
				<div class="rating-summary">
					<div class="rating-average">
						<div class="average-score">${averageScore} <span class="star-icon">★</span></div>
						<div class="average-label">De 5 estrellas</div>
					</div>
					<div class="rating-bars">
						${[5, 4, 3, 2, 1].map(star => {
							const count = scoreDistribution[star];
							const percentage = totalComments > 0 ? (count / totalComments * 100) : 0;
							return `
								<div class="rating-bar-row">
									<span class="star-label">${'★'.repeat(star)}</span>
									<div class="rating-bar-bg">
										<div class="rating-bar-fill" style="width: ${percentage}%"></div>
									</div>
									<span class="rating-count">${count}</span>
								</div>
							`;
						}).join('')}
					</div>
				</div>
			`;

			if (ratingSummaryContainer) {
				ratingSummaryContainer.innerHTML = rankingHTML;
			}
		}

		let allComments = [...comments];

		updateRatingSummary(allComments);

		let commentsHTML = '<p class="text-muted">No hay comentarios para este producto.</p>';
		if (allComments.length) {
			commentsHTML = allComments.map(c => `
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
      <div class="comments-list">
        <div id="cont-comment">
          ${commentsHTML}
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

			const now = new Date();
			const formattedDate = now.toLocaleString("es-ES", {
				year: "numeric", month: "2-digit", day: "2-digit",
				hour: "2-digit", minute: "2-digit"
			});

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

			commentsList.insertAdjacentHTML("beforeend", newCommentHTML);

			allComments.push({
				user: user,
				dateTime: formattedDate,
				score: score,
				description: text
			});
			updateRatingSummary(allComments);

			commentText.value = "";
			const allRadios = commentForm.querySelectorAll('.comment-score');
			allRadios.forEach(r => r.checked = false);
		});

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