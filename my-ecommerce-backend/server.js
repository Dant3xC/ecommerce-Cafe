/*Node.js es un entorno en tiempo de ejecución multiplataforma, de código abierto, para la capa 
del servidor basado en el lenguaje de programación JavaScript, asíncrono, con E/S de datos en una 
arquitectura orientada a eventos y basado en el motor V8 de Google. */

require('dotenv').config(); //carga del archivo .env

const express = require('express'); //Framework para crear aplicaciones web y APIs en Node.js
const mongoose = require('mongoose'); //Biblioteca de modelado de objetos MongoDB para Node.js
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

//importar rutas
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth'); 

//importar modelos 
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
        });
    })
    .catch(err => console.log(err));
