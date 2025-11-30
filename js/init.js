const BASE_URL = "http://localhost:3000/emercado-api-main";

const CATEGORIES_URL              = `${BASE_URL}/cats/cat.json`;
const PUBLISH_PRODUCT_URL         = `${BASE_URL}/sell/publish.json`;
const PRODUCTS_URL                = `${BASE_URL}/cats_products/`;
const PRODUCT_INFO_URL            = `${BASE_URL}/products/`;
const PRODUCT_INFO_COMMENTS_URL   = `${BASE_URL}/products_comments/`;
const CART_INFO_URL               = `${BASE_URL}/user_cart/`;
const CART_BUY_URL                = `${BASE_URL}/cart/buy.json`;
const EXT_TYPE = ".json";

// Constantes para claves de localStorage
const STORAGE_KEYS = {
    USUARIO: "usuario",
    CAT_ID: "catID",
    CAT_NAME: "catName",
    PRODUCT_ID: "productID",
    DARK_MODE: "darkMode",
    LANGUAGE: "language"
};

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    
    // Obtener token (primero intenta localStorage, luego sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Configurar headers con el token si existe
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, { headers })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401 || response.status === 403) {
        // Token inválido o expirado - redirigir al login
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = 'login.html';
        throw Error('Sesión expirada');
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

document.getElementById("btn-perfil").addEventListener("click", function(){
  window.location.href = 'my-profile.html'
})