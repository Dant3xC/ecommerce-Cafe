const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Ruta para crear un nuevo pedido
router.post('/', async (req, res) => {
    const { name, email, documentNumber, deliveryMethod, deliveryAddress, deliveryCity, cart } = req.body;

    // Validación de datos
    if (!name || !email || !documentNumber || !deliveryMethod || !Array.isArray(cart) || cart.length === 0) {
        console.log('Datos del pedido faltantes o incorrectos:', req.body);
        return res.status(400).send({ message: 'Datos del pedido faltantes o incorrectos' });
    }

    if (deliveryMethod === 'delivery' && (!deliveryAddress || !deliveryCity)) {
        console.log('Datos del pedido de entrega faltantes o incorrectos:', req.body);
        return res.status(400).send({ message: 'Datos del pedido de entrega faltantes o incorrectos' });
    }

    try {
        // Actualizar el stock de los productos
        for (const item of cart) {
            const product = await Product.findById(item.id);
            if (!product) {
                console.log(`Producto no encontrado: ${item.id}`);
                return res.status(400).send({ message: `Producto no encontrado: ${item.name}` });
            }

            if (product.stock < item.quantity) {
                console.log(`Stock insuficiente para el producto: ${item.name}`);
                return res.status(400).send({ message: `No hay suficiente stock para el producto ${item.name}` });
            }

            // Validar que el producto tenga descripción
            if (!product.description) {
                product.description = 'No description available'; // Proveer una descripción predeterminada
            }

            product.stock -= item.quantity;
            await product.save();
        }

        // Crear el nuevo pedido
        const newOrder = new Order({
            name,
            email,
            documentNumber,
            deliveryMethod,
            deliveryAddress,
            deliveryCity,
            cart
        });
        await newOrder.save();

        // Enviar correo de confirmación al cliente
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions;
        if (deliveryMethod === 'pickup') {
            mailOptions = {
                from: process.env.EMAIL_USER,
                to: email, // Enviar el correo al cliente que realizó el pedido
                subject: 'Thank you for your purchase - Pick up in store',
                text: `Thank you for your order, ${name}! Remember that we reserve your order until the end of the day\n\nHere are the details of your order:\n\n${cart.map(item => `${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}`).join('\n')}\n\nDelivery method: Store pickup\n\nWe are waiting for you!`
            };
        } else {
            mailOptions = {
                from: process.env.EMAIL_USER,
                to: email, // Enviar el correo al cliente que realizó la compra
                subject: 'Thank you for your purchase - Home delivery',
                text: `Thank you for your purchase, ${name}!\n\nHere are the details of your order:\n\n${cart.map(item => `${item.name} - Quantity: ${item .quantity} - Price: $${item.price.toFixed(2)}`).join('\n')}\n\nDelivery address: ${deliveryAddress}, ${deliveryCity}\nDelivery method: Home delivery\n\nWe hope you enjoy your purchase!`            };
        }

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Order received and processed correctly' });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).send({ message: 'There was an error processing the order' });
    }
});

module.exports = router;
