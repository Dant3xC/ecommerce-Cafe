// Datos simulados
const products = [
    { id: 1, name: 'ROYAL BREAKFAST', price: 17.60, img: '../assets/images/c2.png' },
    { id: 2, name: 'Product 2', price: 50.00, img: 'https://www.bootdey.com/image/300x300/48D1CC/000000' },
    { id: 3, name: 'Product 3', price: 55.00, img: 'https://www.bootdey.com/image/300x300/87CEEB/000000' },
    { id: 4, name: 'Product 4', price: 60.00, img: 'https://www.bootdey.com/image/300x300/48D1CC/000000' },
    { id: 5, name: 'Product 5', price: 65.00, img: 'https://www.bootdey.com/image/300x300/FF69B4/000000' },
    { id: 6, name: 'Product 6', price: 70.00, img: 'https://www.bootdey.com/image/300x300/FFD700/000000' },
    { id: 7, name: 'Product 7', price: 17.60, img: '../assets/images/c2.png' },
    { id: 8, name: 'Product 8', price: 50.00, img: 'https://www.bootdey.com/image/300x300/48D1CC/000000' },
    { id: 9, name: 'Product 9', price: 55.00, img: 'https://www.bootdey.com/image/300x300/87CEEB/000000' },
    { id: 10, name: 'Product 10', price: 60.00, img: 'https://www.bootdey.com/image/300x300/48D1CC/000000' },
    { id: 11, name: 'Product 11', price: 65.00, img: 'https://www.bootdey.com/image/300x300/FF69B4/000000' },
    { id: 12, name: 'Product 12', price: 70.00, img: 'https://www.bootdey.com/image/300x300/FFD700/000000' },
    // Añadir más productos si es necesario
];

const itemsPerPage = 6;
let currentPage = 1;

function renderProducts(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = products.slice(start, end);

    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';

    pageProducts.forEach(product => {
        const productHTML = `
            <div class="col-sm-6 col-md-4">
                <section class="panel">
                    <div class="pro-img-box">
                        <img src="${product.img}" alt="" />
                        <a href="#" class="adtocart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.img}"><i class="fa fa-shopping-cart"></i></a>
                    </div>
                    <div class="panel-body text-center">
                        <h4><a href="producto.html?id=${product.id}" class="pro-title">${product.name}</a></h4>
                        <p class="price">$${product.price.toFixed(2)}</p>
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
            const product = {
                id: button.getAttribute('data-id'),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                img: button.getAttribute('data-img'),
                quantity: 1
            };

            addToCart(product);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(currentPage);
    setupPagination();
});


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
            updatePagination();
        });
    });
}

function updatePagination() {
    const paginationLinks = document.querySelectorAll('.page-link');
    paginationLinks.forEach(link => {
        const page = link.dataset.page;
        link.parentElement.classList.remove('active');
        if (page == currentPage) {
            link.parentElement.classList.add('active');
        }
    });
}

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
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(currentPage);
    setupPagination();
});
