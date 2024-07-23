document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (product) {
                document.querySelector('.pro-img-details img').src = product.img;
                document.querySelector('.product-title').innerText = product.name;
                document.querySelector('.pro-price').innerText = `$${product.price.toFixed(2)}`;
                document.querySelector('.description').innerText = product.description;

                if (product.category === 'Equipment') {
                    document.querySelector('.product-details').innerHTML = `
                        <li><strong>Type:</strong> ${product.type}</li>
                        <li><strong>Brand:</strong> ${product.brand}</li>
                        <li><strong>Model:</strong> ${product.model}</li>
                    `;
                } else {
                    document.querySelector('.product-details').innerHTML = `
                        <li><strong>Region:</strong> ${product.region}</li>
                        <li><strong>Density:</strong> ${product.density}</li>
                        <li><strong>Acidity:</strong> ${product.acidity}</li>
                        <li><strong>Roast Type:</strong> ${product.roastType}</li>
                    `;
                }

                const ratingContainer = document.querySelector('.rating');
                ratingContainer.innerHTML = '';
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement('i');
                    star.className = i < product.rating ? 'fa fa-star' : 'fa fa-star-o';
                    ratingContainer.appendChild(star);
                }

                const quantityInput = document.querySelector('#quantity');
                const stockMessage = document.querySelector('#stock-message');

                if (product.stock === 0) {
                    stockMessage.style.display = 'block';
                    stockMessage.innerText = 'Sin stock';
                    quantityInput.disabled = true;
                } else {
                    stockMessage.style.display = 'block';
                    stockMessage.innerText = `Stock disponible: ${product.stock}`;
                    quantityInput.max = product.stock;
                    quantityInput.min = 1;
                }

                quantityInput.addEventListener('input', () => {
                    let value = parseInt(quantityInput.value, 10);
                    if (value > product.stock) {
                        quantityInput.value = product.stock;
                    } else if (value < 1) {
                        quantityInput.value = 1;
                    }
                });

                const addToCartButton = document.querySelector('.btn.btn-round.btn-dark');
                addToCartButton.addEventListener('click', () => {
                    if (product.stock > 0) {
                        const quantity = parseInt(quantityInput.value, 10);
                        const cartProduct = {
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            img: product.img,
                            quantity: quantity
                        };
                        addToCart(cartProduct);
                    } else {
                        alert('Este producto está fuera de stock');
                    }
                });
            } else {
                document.querySelector('.panel-body').innerHTML = '<p>Product not found</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            document.querySelector('.panel-body').innerHTML = '<p>Error loading product details</p>';
        });
});

function addToCart(product) {
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Product added to cart:', product); // Verifica que el producto se haya agregado correctamente
}
