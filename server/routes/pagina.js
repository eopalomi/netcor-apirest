// Importamos Express
const express = require('express');

// Importamos Acceso BD
const db = require('../db/connect_db');

//Importamos Middlewares
const { validaToken } = require('../middlewares/autenticacion');

// Usamos Express
const app = express();

// ======== ENDPOINTS =========
// ============================

app.get('/pagina', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // [querys] Informacion de la Pagina
    let query_valpag = `select * from frame.pagina_info(${params.id_pagina}, null)`;

    // [querys] Informacion del JS con el valpag de la Pagina
    let query_valpagjs = `select * from frame.pagina_js(${params.id_pagina}, null);`;
    
    try {
        // Conectar y Ejecutar Query - Buscar Pagina
        const execPageInf = await db.query(query_valpag);
        const resultPageInfo = execPageInf.rows[0];

        // No Existe Data?
        if (!resultPageInfo) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No existe la pagina' }
            });
        };

        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_valpagjs);
        const resultPageJS = execPageJS.rows[0];

        // No Existe Data?
        if (!resultPageJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No existe el JS de la pagina' }
            });
        };

        // Ejecutar JS Pagina y crear la funcion
        eval(resultPageJS.js_page);

        // Ejecutar la funcion obtenida desde la base de datos y responder con los datos
        procesarValpag(params.id_pagina).then( async data_page => {
            //Agregar los Registros de la pagina al Json de Data de la Pagina
            resultPageInfo.data_page = data_page;

            // Respuesta (OK - 200)
            res.status(200).json(resultPageInfo);
        });
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpag: query_valpag,
            query_valpagjs: query_valpagjs,
            error: e,
            stack_err: e.stack
        });
    }

    // Funciones
    function valpagReturn(rowData){
        let arrObj = [];
    
        for (let rs_parent of rowData) {
            const objReg = new Object();
    
            for (let rs_child of rs_parent) {
                objReg["regist_" + rs_child.co_pagreg]             = rs_child.va_pagreg;
                objReg["regist_" + rs_child.co_pagreg + "_type"]   = rs_child.ti_pagreg;
                objReg["regist_" + rs_child.co_pagreg + "_est"]    = rs_child.ti_estreg;
                objReg["regist_" + rs_child.co_pagreg + "_color"]  = rs_child.ti_colreg;
                objReg["regist_" + rs_child.co_pagreg + "_ico"]    = rs_child.va_icoreg;
                objReg["regist_" + rs_child.co_pagreg + "_conten"] = rs_child.id_conten;
                objReg["regist_" + rs_child.co_pagreg + "_datsel"] = rs_child.ar_datsel;
            };
    
            arrObj.push(objReg);
        };
    
        return arrObj;
    };
});

app.post('/propag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    console.log('query params', params);
    console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.pagina_propag_js(${params.id_pagina}, null);`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No existe el Propag JS de la pagina' }
            });
        };

        // Ejecutar JS Pagina y crear la funcion
        eval(resultPropagJS.js_page);
        
        procesarPropag(body, params.id_pagina, params.id_boton).then( x => {
            res.status(200).send({mensaje: 'se proceso correctamente'});
        })
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

// ============================
// ============================

module.exports = app;