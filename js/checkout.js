document.addEventListener('DOMContentLoaded', async () => {
    const checkoutForm = document.getElementById('checkout-form');
    const deliverySelect = document.getElementById('delivery');
    const deliveryDetails = document.getElementById('delivery-details');

    // Función para obtener datos del usuario
    async function getUserData(token) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // Rellenar los datos del usuario en el formulario
    const token = localStorage.getItem('token');
    if (token) {
        const userData = await getUserData(token);
        if (userData) {
            document.getElementById('name').value = userData.name;
            document.getElementById('email').value = userData.email;
            document.getElementById('document-number').value = userData.documentNumber;
            document.getElementById('delivery-address').value = userData.deliveryAddress;
            document.getElementById('delivery-city').value = userData.deliveryCity;
        }
    }

    deliverySelect.addEventListener('change', (event) => {
        if (event.target.value === 'delivery') {
            deliveryDetails.style.display = 'block';
        } else {
            deliveryDetails.style.display = 'none';
        }
    });

    checkoutForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const documentNumber = document.getElementById('document-number').value.trim();
        const deliveryMethod = document.getElementById('delivery').value.trim();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!name || !email || !documentNumber || !deliveryMethod || cart.length === 0) {
            alert('Por favor completa todos los campos y agrega productos al carrito.');
            console.log('Datos del pedido faltantes o incorrectos:', { name, email, documentNumber, deliveryMethod, cart });
            return;
        }

        let orderDetails = {
            name,
            email,
            documentNumber,
            deliveryMethod,
            cart
        };

        if (deliveryMethod === 'delivery') {
            const deliveryAddress = document.getElementById('delivery-address').value.trim();
            const deliveryCity = document.getElementById('delivery-city').value.trim();
            const cardNumber = document.getElementById('card-number').value.trim();
            const expiryDate = document.getElementById('expiry-date').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!deliveryAddress || !deliveryCity || !cardNumber || !expiryDate || !cvv) {
                alert('Por favor completa todos los campos de entrega y pago.');
                return;
            }

            orderDetails = {
                ...orderDetails,
                deliveryAddress,
                deliveryCity,
                paymentDetails: {
                    cardNumber,
                    expiryDate,
                    cvv
                }
            };
        }

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            });

            if (!response.ok) {
                throw new Error('Error al enviar el pedido');
            }

            const result = await response.json();
            console.log('Order confirmed:', result);

            // Cierra el modal
            $('#checkoutModal').modal('hide');

            // Vacía el carrito
            localStorage.removeItem('cart'); // Eliminar el carrito del localStorage
            const clearCartButton = document.getElementById('clear-cart');
            if (clearCartButton) {
                clearCartButton.click();
            }
            alert('Pedido realizado con éxito. ¡Gracias por tu compra!');

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo.');
        }
    });
});
