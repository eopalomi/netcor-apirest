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

    console.log("Ejecutando /pagina (header, body, params):", header, body, params.params_page)

    // [querys] Informacion de la Pagina
    let query_valpag = `select * from frame.pagina_info(${params.id_pagina}, null)`;

    // [querys] Informacion del JS con el valpag de la Pagina
    let query_valpagjs = `select * from frame.pagina_js(${params.id_pagina}, null);`;
    
    try {
        // Conectar y Ejecutar Query - Buscar Pagina
        const execPageInf = await db.query(query_valpag);
        
        const resultPageInfo = execPageInf.rows[0];

        // No Existe la Pagina?
        if (!resultPageInfo) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                valid: false,
                error_stack: 'No existe la pagina',
                page_id: params.id_pagina
            });
        };
        
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_valpagjs);
        const resultPageJS = execPageJS.rows[0];
        
        // No Existe JS de la Pagina?
        if (!resultPageJS) {
            // [querys] Informacion del JS con el valpag de la Pagina
            let query_regist_page = `select * from frame.pagina_regist(${params.id_pagina});`;
            
            // Conectar y Ejecutar Query - Buscar Registros de la Pagina
            const execRegistJS = await db.query(query_regist_page);
            const resultRegistJS = execRegistJS.rows[0].pagina_regist;

            //Agregar los Registros de la pagina al Json de Data de la Pagina
            resultPageInfo.data_page = resultRegistJS;

            // Respuesta (OK - 200)
            res.status(200).json(resultPageInfo);
        } else {
            
            // Ejecutar JS Pagina y crear la funcion
            eval(resultPageJS.js_page);
            
            // Validar si hay parametros y convertirlo en objeto
            if (params.params_page !== undefined){
                var objParams = JSON.parse(params.params_page);
            } else {
                var objParams = null;
            };
            
            // Ejecutar la funcion obtenida desde la base de datos y responder con los datos
            procesarValpag(objParams)
            .then(data_page => {
                //Agregar los Registros de la pagina al Json de Data de la Pagina
                resultPageInfo.data_page = data_page;

                // Respuesta (OK - 200)
                res.status(200).json(resultPageInfo);
            }).catch( e =>{
                res.status(500).json({
                    valid: false,
                    error_stack: e.stack,
                    page_id: params.id_pagina
                });
            });
        };
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            error_stack: e.stack,
            page_id: params.id_pagina
        });
    }

    // Funciones
    function valpagReturn(rowData){
        let arrObj = [];
    
        for (let rs_parent of rowData) {
            const objReg = new Object();
    
            for (let rs_child of rs_parent) {
                objReg["regist_" + rs_child.co_pagreg]             = rs_child.va_pagreg; // Valor del Registro
                objReg["regist_" + rs_child.co_pagreg + "_type"]   = rs_child.ti_pagreg; // Tipo de Dato
                objReg["regist_" + rs_child.co_pagreg + "_est"]    = rs_child.ti_estreg; // Estado del Registro
                objReg["regist_" + rs_child.co_pagreg + "_color"]  = rs_child.ti_colreg; // Color del Registro
                objReg["regist_" + rs_child.co_pagreg + "_ico"]    = rs_child.va_icoreg; // Icono
                objReg["regist_" + rs_child.co_pagreg + "_conten"] = rs_child.id_conten; // Contenedor
                objReg["regist_" + rs_child.co_pagreg + "_datsel"] = rs_child.ar_datsel; // Datos del Combo
                objReg["regist_" + rs_child.co_pagreg + "_link"]   = rs_child.va_urllin; // Datos del Combo
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

    console.log('propag query params', params);
    console.log('propag body', body);

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
                valid: false,
                error_stack: 'No existe el Propag JS de la pagina',
                page_id: params.id_pagina
            });
        };
 
        // Ejecutar JS Pagina y crear la funcion
        eval(resultPropagJS.js_page);
        
        procesarPropag(body, params.id_pagina, params.id_boton).then( x => {
            console.log("x", x);
            let pageParams;
            let pageRedirect;
            let pageRefresh;
            let msgAlert;

            if (x !== undefined) {
                pageParams   = x.page_params;
                pageRedirect = x.page_redirect;
                pageRefresh  = x.refresh_pages;
                msgAlert     = x.msg_alert;
            }

            res.status(200).send({
                valid: true,
                pages_to_refresh: pageRefresh  || null,
                page_params:      pageParams   || null,
                page_redirect:    pageRedirect || null,
                msg_alert:        msgAlert     || null
            });
        }).catch( err =>{
            res.status(500).json({
                valid: false,
                error_stack: err.stack,
                page_id: params.id_pagina
            });
        });
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            error_stack: e.stack,
            page_id: params.id_pagina
        });
    }
});

app.post('/pagina-propag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    console.log('query params', params);
    console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.set_pagina_propag(${params.id_pagina}, '${params.js_propag.split("'").join("''")}');`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No se pudo actualizar el propag' }
            });
        };
 
        res.status(200).send({mensaje: 'se proceso correctamente el propag'});
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

app.get('/pagina-propag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    console.log('query params', params);
    console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.get_pagina_propag(${params.id_pagina});`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Ok - 400)
            return res.status(200).json({
                propag: ''
            });
        };
 
        res.status(200).json({
            propag: resultPropagJS.propag
        });

    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

app.post('/pagina-valpag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    console.log('pagina-valpag(post)');
    console.log('query params', params);
    console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.set_pagina_valpag(${params.id_pagina},'${params.js_valpag.split("'").join("''")}');`;
    console.log('query_propagjs', query_propagjs);

    /*try {*/
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No se pudo actualizar el valpag' }
            });
        };
 
        res.status(200).send({mensaje: 'se proceso correctamente el valpag'});

    /*} catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }*/
});

app.get('/pagina-valpag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    console.log('query params', params);
    console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.get_pagina_valpag(${params.id_pagina});`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultValpagJS = execPageJS.rows[0];

        // No Existe Valpag?
        if (!resultValpagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(200).json({
                valpag: ''
            });
        };

        res.status(200).json({
            valpag: resultValpagJS.valpag
        });
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