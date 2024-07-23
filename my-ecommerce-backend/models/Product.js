const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        default: "Sin descripcion"
    },
    //Campos del cafe
    region: String,
    density: String,
    acidity: String,
    roastType: String,
    // Campos específicos para equipamiento
    type: String,
    brand: String,
    model: String,
    // Calificación
    rating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', productSchema);
