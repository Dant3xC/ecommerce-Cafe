document.addEventListener('DOMContentLoaded', () => {
    // Función para actualizar el precio total del carrito
    function updateTotalPrice() {
        let totalPrice = 0;
        // Recorre cada elemento con la clase 'item-total'
        document.querySelectorAll('.item-total').forEach(function (item) {
            // Suma el precio de cada elemento al total
            totalPrice += parseFloat(item.innerText.replace('$', ''));
        });
        // Actualiza el elemento con id 'total-price' con el precio total formateado a dos decimales
        document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;
    }

    // Maneja el cambio en la cantidad de los productos
    function handleQuantityChange(input) {
        input.addEventListener('input', function () {
            let quantity = parseInt(this.value);
            // Si la cantidad es NaN (no es un número) o menor que 1, ajusta el valor a 1
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
                this.value = 1;
            }

            // Obtiene la fila que contiene el producto actual
            const row = this.closest('tr');
            // Obtiene el precio del producto desde la segunda columna de la fila
            const price = parseFloat(row.querySelector('td:nth-child(2)').innerText.replace('$', ''));
            // Calcula el total multiplicando el precio por la cantidad
            const total = price * quantity;
            // Actualiza el total del producto en la cuarta columna de la fila
            row.querySelector('.item-total').innerText = `$${total.toFixed(2)}`;
            // Llama a la función para actualizar el precio total del carrito
            updateTotalPrice();

            // Actualiza la cantidad en el localStorage
            updateQuantity(this.getAttribute('data-id'), quantity);
        });
    }

    // Maneja la eliminación de productos del carrito
    function handleRemoveItem(button) {
        button.addEventListener('click', function (event) {
            // Previene el comportamiento por defecto del enlace
            event.preventDefault();
            // Obtiene la fila que contiene el producto a eliminar
            const row = this.closest('tr');
            // Elimina la fila del DOM
            row.remove();
            // Llama a la función para actualizar el precio total del carrito
            updateTotalPrice();

            // Elimina el producto del localStorage
            removeFromCart(this.getAttribute('data-id'));
        });
    }

    // Carga el carrito desde el localStorage
    function loadCart() {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        let totalPrice = 0;

        cart.forEach(product => {
            const productTotal = product.price * product.quantity;
            totalPrice += productTotal;

            const productRow = `
                <tr data-id="${product.id}">
                    <td class="p-4">
                        <div class="media align-items-center">
                            <img src="${product.img}" class="d-block ui-w-40 ui-bordered mr-4" alt="Product Image">
                            <div class="media-body">
                                <a href="#" class="d-block text-light">${product.name}</a>
                            </div>
                        </div>
                    </td>
                    <td class="text-right font-weight-semibold align-middle p-4">$${product.price.toFixed(2)}</td>
                    <td class="align-middle p-4"><input type="number" class="form-control text-center quantity" value="${product.quantity}" min="1" data-id="${product.id}"></td>
                    <td class="text-right font-weight-semibold align-middle p-4 item-total">$${productTotal.toFixed(2)}</td>
                    <td class="text-center align-middle px-0"><a href="#" class="shop-tooltip close float-none text-danger remove-item" data-id="${product.id}" title="Remove">×</a></td>
                </tr>
            `;

            cartItemsContainer.insertAdjacentHTML('beforeend', productRow);
        });

        document.getElementById('total-price').innerText = `$${totalPrice.toFixed(2)}`;

        // Añadir manejadores de eventos para eliminar items y actualizar cantidad
        document.querySelectorAll('.remove-item').forEach(handleRemoveItem);
        document.querySelectorAll('.quantity').forEach(handleQuantityChange);
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
        loadCart();
    }

    // Cargar el carrito al cargar la página
    loadCart();
});
