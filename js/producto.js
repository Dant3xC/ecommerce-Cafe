const products = [
    { id: 1, name: 'ROYAL BREAKFAST', price: 17.60, img: '../assets/images/c2.png', description: 'A burst of bright citrus, balanced by the sweetness of caramel and the warmth of toasted nuts. The flavor evolves with each sip, leaving a lasting impression of decadence.', region: 'Africa, Ethiopia', density: 'Light', acidity: 'Medium', roastType: 'Dark' },
    { id: 2, name: 'Product 2', price: 50.00, img: 'https://www.bootdey.com/image/300x300/48D1CC/000000', description: 'Description for Product 2', region: 'Region 2', density: 'Medium', acidity: 'High', roastType: 'Medium' },
    { id: 3, name: 'Product 3', price: 55.00, img: 'https://www.bootdey.com/image/300x300/87CEEB/000000', description: 'Description for Product 3', region: 'Region 3', density: 'Heavy', acidity: 'Low', roastType: 'Light' },
    // ... otros productos
];

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Buscar el producto por ID
    const product = products.find(product => product.id === productId);

    if (product) {
        // Actualizar la página con los datos del producto
        document.querySelector('.pro-img-details img').src = product.img;
        document.querySelector('.product-title').innerText = product.name;
        document.querySelector('.pro-price').innerText = `$${product.price.toFixed(2)}`;
        document.querySelector('.description').innerText = product.description;
        document.querySelector('.product-details').innerHTML = `
            <li><strong>Region:</strong> ${product.region}</li>
            <li><strong>Density:</strong> ${product.density}</li>
            <li><strong>Acidity:</strong> ${product.acidity}</li>
            <li><strong>Roast Type:</strong> ${product.roastType}</li>
        `;
    } else {
        // Manejar el caso donde no se encuentra el producto
        document.querySelector('.panel-body').innerHTML = '<p>Product not found</p>';
    }
});
