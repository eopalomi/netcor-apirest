const jwt = require('jsonwebtoken');

let validaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        // Si existe Error
        if (err){
            // Respuesta (Unauthorized - 401)
            return res.status(401).json({
                valid: false,
                err
            });
        };

        // Continuar al EndpPoint
        next();
    });
};

module.exports = {
    validaToken
};