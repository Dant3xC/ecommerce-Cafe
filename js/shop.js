const itemsPerPage = 6;
let currentPage = 1;
let currentCategory = 'all';
let searchQuery = '';

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();
        return products;
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        return [];
    }
}


async function renderProducts(page) {
    currentPage = page;
    const products = await fetchProducts();

    const filteredProducts = products.filter(product => {
        return (currentCategory === 'all' || product.category === currentCategory) &&
               (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';

    pageProducts.forEach(product => {
        const outOfStockMessage = product.stock === 0 ? '<p style="color: red;">Sin stock</p>' : '';
        const productHTML = `
            <div class="col-sm-6 col-md-4">
                <section class="panel">
                    <div class="pro-img-box">
                        <img src="${product.img}" alt="" />
                        <a href="#" class="adtocart" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}" data-stock="${product.stock}">
                            <i class="fa fa-shopping-cart"></i>
                        </a>
                    </div>
                    <div class="panel-body text-center">
                        <h4><a href="producto.html?id=${product._id}" class="pro-title">${product.name}</a></h4>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        ${outOfStockMessage}
                    </div>
                </section>
            </div>
        `;
        productList.insertAdjacentHTML('beforeend', productHTML);
    });

    // Agregar eventos a los botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.adtocart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const stock = parseInt(button.getAttribute('data-stock'), 10);
            if (stock > 0) {
                const product = {
                    id: button.getAttribute('data-id'),
                    name: button.getAttribute('data-name'),
                    price: parseFloat(button.getAttribute('data-price')),
                    img: button.getAttribute('data-img'),
                    quantity: 1
                };
                addToCart(product);
            } else {
                alert('Este producto está fuera de stock');
            }
        });
    });

    updatePagination(filteredProducts.length);
}


function setupPagination() {
    const paginationLinks = document.querySelectorAll('.page-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.dataset.page;
            if (page === 'prev' && currentPage > 1) {
                renderProducts(currentPage - 1);
            } else if (page === 'next' && currentPage < Math.ceil(products.length / itemsPerPage)) {
                renderProducts(currentPage + 1);
            } else if (!isNaN(page)) {
                renderProducts(Number(page));
            }
        });
    });
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
        <li class="page-item"><a href="#" class="page-link" data-page="prev">&laquo;</a></li>
    `;
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}"><a href="#" class="page-link" data-page="${i}">${i}</a></li>
        `;
    }
    pagination.innerHTML += `
        <li class="page-item"><a href="#" class="page-link" data-page="next">&raquo;</a></li>
    `;
    setupPagination();
}

//Agregar al carrito
function addToCart(product) {
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Product added to cart:', product); 
}


document.addEventListener('DOMContentLoaded', () => {
    renderProducts(currentPage);
    setupPagination();

    // Buscador
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (event) => {
        searchQuery = event.target.value;
        renderProducts(1);
    });

    // Categorías
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedCategory = event.target.dataset.category;
            currentCategory = currentCategory === selectedCategory ? 'all' : selectedCategory;
            renderProducts(1);
        });
    });
});
