// Importamos la Configuracion Global
require('./config/config');

// Importamos ExpresJS
const express = require('express');

// Usamos Express
const app = express();

// Importamos CORS - cross-origin resource sharing
var cors = require('cors')

// Usamos CORS
app.use(cors());

// Importamos el BodyPoder para leer la data(params, body) del EndPoint
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración Global de Rutas
app.use(require('./routes/routes'));

// Iniciamos el Server Express
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${process.env.PORT}`)
})
