const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    documentNumber: { type: String, required: true },
    deliveryMethod: { type: String, required: true },
    deliveryAddress: { type: String },
    deliveryCity: { type: String },
    cart: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            img: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
