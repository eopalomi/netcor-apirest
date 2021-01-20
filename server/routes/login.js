// Importamos Express
const express = require('express');

// Importamos JsonWebToken
const jwt = require('jsonwebtoken');

// Importamos Acceso BD
const db = require('../db/connect_db');

//Importamos Middlewares
const { validaToken } = require('../middlewares/autenticacion');

// Usamos Express
const app = express();

// ======== ENDPOINTS =========
// ============================
app.post('/login', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // Query 
    let query = `select * from usuari.auth_usuari('${JSON.stringify(body)}')`;

    try {
        // Conectar y Ejecutar Query
        const queryResult = await db.query(query);
        const dataLogin = queryResult.rows[0];

        // Usuario Existe?
        if (!dataLogin.usuario) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                valid: false,
                query: query,
                error: { message: '(Usuario) o contraseña incorrectos' }
            });
        };

        // Creamos Token
        let token = jwt.sign(
            { usuario: dataLogin.usuario },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        // Respuesta (OK - 200)
        res.status(200).json({
            usuario: dataLogin.usuario,
            nombreUsuario: dataLogin.no_usulog,
            token: token,
            valid: true
        });
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            query: query,
            error: e,
            stack_err: e.stack 
        });
    };
});

// ============================
// ============================

module.exports = app;