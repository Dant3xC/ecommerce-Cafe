const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware para obtener un producto por su ID
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.product = product;
    next();
}

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un producto por ID
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        img: req.body.img,
        category: req.body.category,
        stock: req.body.stock,
        description: req.body.description,
        region: req.body.region,
        density: req.body.density,
        acidity: req.body.acidity,
        roastType: req.body.roastType,
        type: req.body.type,
        brand: req.body.brand,
        model: req.body.model,
        rating: req.body.rating 
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar el stock de un producto
router.patch('/:id/stock', getProduct, async (req, res) => {
    if (req.body.stock != null) {
        res.product.stock = req.body.stock;
    }
    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un producto
router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove();
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
