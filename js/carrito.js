document.addEventListener('DOMContentLoaded', () => {
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
            if (quantity < 1) {
                quantity = 1;
                this.value = 1;
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

    function loadCart() {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        let totalPrice = 0;

        cart.forEach(product => {
            // Validar las propiedades del producto
            const price = product.price != null ? product.price : 0;
            const quantity = product.quantity != null ? product.quantity : 1;
            const img = product.img != null ? product.img : '';
            const name = product.name != null ? product.name : 'Producto';

            const productTotal = price * quantity;
            totalPrice += productTotal;

            const productRow = `
                <tr data-id="${product.id}">
                    <td class="p-4">
                        <div class="media align-items-center">
                            <img src="${img}" class="d-block ui-w-40 ui-bordered mr-4" alt="Product Image">
                            <div class="media-body">
                                <a href="#" class="d-block text-light">${name}</a>
                            </div>
                        </div>
                    </td>
                    <td class="text-right font-weight-semibold align-middle p-4">$${price.toFixed(2)}</td>
                    <td class="align-middle p-4"><input type="number" class="form-control text-center quantity" id="quantity-${product.id}" value="${quantity}" min="1" data-id="${product.id}"></td>               <td class="text-right font-weight-semibold align-middle p-4 item-total">$${productTotal.toFixed(2)}</td>
                    <td class="text-center align-middle px-0"><a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${product.id}" title="Remove">×</a></td>
                </tr>
            `;

            cartItemsContainer.insertAdjacentHTML('beforeend', productRow);
        });

        document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;

        document.querySelectorAll('.remove-item').forEach(handleRemoveItem);
        document.querySelectorAll('.quantity').forEach(handleQuantityChange);

        const clearCartButton = document.getElementById('clear-cart');
        clearCartButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('cart'); // Eliminar el carrito del localStorage
            loadCart(); // Volver a cargar el carrito para reflejar los cambios
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
