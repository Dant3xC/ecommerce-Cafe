const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config(); 

// Ruta para login de usuarios
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Faltan datos para el login' });
        }

        // Buscar al usuario por nombre de usuario
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        // Comparar la contraseña
        console.log('Contraseña proporcionada:', password);
        console.log('Contraseña en la base de datos:', user.password);
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Contraseña válida:', validPassword);

        if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

        // Crear un token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        console.error('Error en la ruta de login:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para registro de usuarios
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, email, documentNumber, deliveryAddress, deliveryCity } = req.body;

        // Crear un nuevo usuario
        const newUser = new User({
            username,
            password,
            name,
            email,
            documentNumber,
            deliveryAddress,
            deliveryCity
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para obtener datos del usuario
router.get('/user', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error en la ruta de usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
