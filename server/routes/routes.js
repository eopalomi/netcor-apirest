const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./contenedor'));
app.use(require('./pagina'));
app.use(require('./rutas'));
app.use(require('./app_mensajes'));

module.exports = app;