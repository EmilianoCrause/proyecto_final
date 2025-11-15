document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});

function initMobileMenu() {
    const nav = document.querySelector('header nav');
    if (!nav || document.querySelector('.menu-toggle')) return;

    const { menuToggle, overlay, mobileMenu } = createMenuElements(nav);

    nav.appendChild(menuToggle);
    document.body.appendChild(overlay);
    document.body.appendChild(mobileMenu);

    function toggleMenu(e) {
        if (e) {
            e.stopPropagation();
        }
        
        const isActive = mobileMenu.classList.contains('active');
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            setTimeout(toggleMenu, 100);
        }
    });

    setupMobileMenuFunctionality(mobileMenu, nav);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 640 && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        }, 250);
    });
}

function createMenuElements(nav) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Menú');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';

    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';

    const selectores = nav.querySelectorAll('.selectores');
    selectores.forEach(selector => {
        const clone = selector.cloneNode(true);
        mobileMenu.appendChild(clone);
    });

    return { menuToggle, overlay, mobileMenu };
}

function setupMobileMenuFunctionality(mobileMenu, nav) {
    setupLanguageSelector(mobileMenu);
    setupNavigationButtons(mobileMenu);
    syncThemeToggle(mobileMenu, nav);
}

function setupLanguageSelector(mobileMenu) {
    const langBtnMobile = mobileMenu.querySelector('.lang-btn');
    const langDropdownMobile = mobileMenu.querySelector('.lang-dropdown');
    
    if (!langBtnMobile || !langDropdownMobile) return;

    let langText = langBtnMobile.querySelector('span:not([data-lang])');
    if (!langText) {
        const span = document.createElement('span');
        span.textContent = 'Idioma';
        const svg = langBtnMobile.querySelector('svg');
        if (svg) {
            svg.after(span);
        }
    }

    langBtnMobile.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdownMobile.style.display = 
            langDropdownMobile.style.display === 'flex' ? 'none' : 'flex';
    });

    const langButtonsMobile = langDropdownMobile.querySelectorAll('button[data-lang]');
    langButtonsMobile.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            if (window.changeLanguage) {
                window.changeLanguage(lang);
            }
            langDropdownMobile.style.display = 'none';
        });
    });
}

function setupNavigationButtons(mobileMenu) {
    const cartBtnMobile = mobileMenu.querySelector('#btn-cart');
    if (cartBtnMobile) {
        const existingSpans = Array.from(cartBtnMobile.querySelectorAll('span:not(.position-absolute)'));
        const hasCarritoText = existingSpans.some(span => span.textContent.trim() === 'Carrito');
        
        if (!hasCarritoText) {
            const span = document.createElement('span');
            span.textContent = 'Carrito';
            const svg = cartBtnMobile.querySelector('svg');
            
            if (svg) {
                svg.after(span);
            } else {
                cartBtnMobile.appendChild(span);
            }
        }
        
        cartBtnMobile.addEventListener('click', function() {
            window.location.href = "cart.html";
        });
    }

    const perfilBtnMobile = mobileMenu.querySelector('#btn-perfil');
    if (perfilBtnMobile) {
        const userDisplay = perfilBtnMobile.querySelector('#User-display');
        if (userDisplay) {
            userDisplay.remove();
        }
        
        const existingSpans = Array.from(perfilBtnMobile.querySelectorAll('span'));
        const hasPerfilText = existingSpans.some(span => span.textContent.trim() === 'Perfil');
        
        if (!hasPerfilText) {
            const span = document.createElement('span');
            span.textContent = 'Perfil';
            const svg = perfilBtnMobile.querySelector('svg');
            if (svg) {
                svg.after(span);
            } else {
                perfilBtnMobile.appendChild(span);
            }
        }
        
        perfilBtnMobile.addEventListener('click', function() {
            window.location.href = "my-profile.html";
        });
    }

    const logoutBtnMobile = mobileMenu.querySelector('#btn-logout');
    if (logoutBtnMobile) {
        const existingSpans = Array.from(logoutBtnMobile.querySelectorAll('span'));
        const hasCerrarSesionText = existingSpans.some(span => 
            span.textContent.trim() === 'Cerrar sesión' || 
            span.textContent.trim() === 'Cerrar'
        );
        
        if (!hasCerrarSesionText) {
            const hiddenSpan = logoutBtnMobile.querySelector('span.d-none, span.d-sm-inline');
            if (hiddenSpan) {
                hiddenSpan.classList.remove('d-none', 'd-sm-inline');
                hiddenSpan.style.display = 'inline-block';
            } else {
                const span = document.createElement('span');
                span.textContent = 'Cerrar sesión';
                const svg = logoutBtnMobile.querySelector('svg');
                if (svg) {
                    svg.after(span);
                } else {
                    logoutBtnMobile.appendChild(span);
                }
            }
        } else {
            existingSpans.forEach(span => {
                if (span.textContent.trim() === 'Cerrar sesión' || span.textContent.trim() === 'Cerrar') {
                    span.classList.remove('d-none', 'd-sm-inline');
                    span.style.display = 'inline-block';
                }
            });
        }
        
        logoutBtnMobile.addEventListener('click', function() {
            localStorage.removeItem("user");
            localStorage.removeItem("profileImage");
            window.location.href = "login.html";
        });
    }
}

function syncThemeToggle(mobileMenu, nav) {
    const themeToggleMobile = mobileMenu.querySelector('#theme-toggle-checkbox');
    const themeToggleOriginal = nav.querySelector('#theme-toggle-checkbox');
    
    if (!themeToggleMobile || !themeToggleOriginal) return;

    const themeToggleContainer = mobileMenu.querySelector('.theme-toggle');
    if (themeToggleContainer) {
        let themeText = themeToggleContainer.querySelector('span:not([class])');
        if (!themeText) {
            const span = document.createElement('span');
            span.textContent = 'Tema';
            themeToggleContainer.insertBefore(span, themeToggleContainer.firstChild);
        }
    }

    themeToggleMobile.checked = themeToggleOriginal.checked;

    themeToggleMobile.addEventListener('change', function() {
        themeToggleOriginal.checked = this.checked;
        themeToggleOriginal.dispatchEvent(new Event('change'));
    });

    themeToggleOriginal.addEventListener('change', function() {
        themeToggleMobile.checked = this.checked;
    });
}