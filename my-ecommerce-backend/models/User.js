const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    documentNumber: { type: String, required: true },
    deliveryAddress: { type: String },
    deliveryCity: { type: String }
});

// Encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});


module.exports = mongoose.model('User', UserSchema);
