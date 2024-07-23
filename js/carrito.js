document.addEventListener('DOMContentLoaded', () => {
    async function fetchProductDetails(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Error fetching product details');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching product details:', error);
            return null;
        }
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        document.querySelectorAll('.item-total').forEach(function (item) {
            const itemTotal = parseFloat(item.innerText.replace('$', ''));
            if (!isNaN(itemTotal)) {
                totalPrice += itemTotal;
            }
        });
        document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;
    }

    function handleQuantityChange(input) {
        input.addEventListener('input', function () {
            let quantity = parseInt(this.value) || 1;
            const maxQuantity = parseInt(this.max) || quantity;

            if (quantity < 1) {
                quantity = 1;
                this.value = 1;
            } else if (quantity > maxQuantity) {
                quantity = maxQuantity;
                this.value = maxQuantity;
            }

            const row = this.closest('tr');
            const priceText = row.querySelector('td:nth-child(2)').innerText;
            const price = parseFloat(priceText.replace('$', '')) || 0;
            const total = price * quantity;
            row.querySelector('.item-total').innerText = `$${total.toFixed(2)}`;
            updateTotalPrice();
            updateQuantity(this.getAttribute('data-id'), quantity);
        });
    }

    function handleRemoveItem(button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const row = this.closest('tr');
            row.remove();
            updateTotalPrice();
            removeFromCart(this.getAttribute('data-id'));
        });
    }

    async function loadCart() {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        let totalPrice = 0;

        for (const product of cart) {
            if (product.id) {
                const productDetails = await fetchProductDetails(product.id);
                if (!productDetails || productDetails.stock === 0) {
                    continue; // Skip products with no stock
                }

                const price = productDetails.price;
                const quantity = product.quantity <= productDetails.stock ? product.quantity : productDetails.stock;
                const img = productDetails.img;
                const name = productDetails.name;
                const stock = productDetails.stock;
                const productUrl = `producto.html?id=${product.id}`; // URL de la página del producto

                const productTotal = price * quantity;
                totalPrice += productTotal;

                const productRow = `
                    <tr data-id="${product.id}">
                        <td class="p-4">
                            <div class="media align-items-center">
                                <img src="${img}" class="d-block ui-w-40 ui-bordered mr-4" alt="Product Image">
                                <div class="media-body">
                                    <a href="${productUrl}" class="d-block text-light">${name}</a>
                                </div>
                            </div>
                        </td>
                        <td class="text-right font-weight-semibold align-middle p-4">$${price.toFixed(2)}</td>
                        <td class="align-middle p-4">
                            <input type="number" class="form-control text-center quantity" id="quantity-${product.id}" value="${quantity}" min="1" max="${stock}" data-id="${product.id}">
                        </td>
                        <td class="text-right font-weight-semibold align-middle p-4 item-total">$${productTotal.toFixed(2)}</td>
                        <td class="text-center align-middle px-0">
                            <a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${product.id}" title="Remove">×</a>
                        </td>
                    </tr>
                `;

                cartItemsContainer.insertAdjacentHTML('beforeend', productRow);
            }
        }

        document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;

        document.querySelectorAll('.remove-item').forEach(handleRemoveItem);
        document.querySelectorAll('.quantity').forEach(handleQuantityChange);

        const clearCartButton = document.getElementById('clear-cart');
        clearCartButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('cart'); // Eliminar el carrito del localStorage
            loadCart(); // Volver a cargar el carrito para reflejar los cambios
        });

        const checkoutButton = document.getElementById('checkout-button');
        checkoutButton.addEventListener('click', function () {
            $('#checkoutModal').modal('show');
        });

        const backToShoppingButton = document.querySelector('.btn.btn-lg.btn-default.md-btn-flat.mt-2.mr-3');
        backToShoppingButton.addEventListener('click', function () {
            window.location.href = 'shop.html';
        });
    }

    function removeFromCart(productId) {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        cart = cart.filter(product => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }

    function updateQuantity(productId, quantity) {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            cart[productIndex].quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    loadCart();
});
