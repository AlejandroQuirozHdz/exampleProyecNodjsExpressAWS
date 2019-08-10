//imporatación de modulos y archivos
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require('../config/database');

// recuperacón para los errores de los codigos y retorne resumido el error
exports.getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Error ' + err.code + ': Este registro ya existe.';
                break;
            default:
                message = 'Error ' + err.code + ': Error de base de datos.';
                break;
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    if (message === "" || message === " ") {
        try {
            message = err.toString();
        } catch (e) { }
    }
    return message;
};

//modulos de la estructura del respons
exports.respons = function (success, code, data) {
    return {
        success: success,
        code: code,
        data: data
    }
};

// Check if the user sends a valid token
exports.isAuthenticated = async (req, res, next) => {
    // Check header for token

    var token = req.headers['x-access-token'];

    // Decode token
    if (token) {
        // Verifies secret and checks exp
        jwt.verify(token, req.app.get('secret'), function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Error al autenticar token'
                });
            } else {
                try {
                    if (decoded.exp <= moment().unix()) {
                        return res.status(401).send({ message: "El token ha expirado" });
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                } catch (ex) {
                    return res.status(404).send({
                        message: 'EL token no es valido'
                    });
                }

            }
        });
    } else {
        // If there's no token, return an HTTP response and an error message
        return res.status(403).send({
            success: false,
            message: 'Token requerido'
        });
    }
};

//validación del usuario que utiliza el token ingresado con la información encriptada
exports.mustBeAuthorizedUser = async (req, res, next) => {
    try {
        let result = await pool.query("SELECT id_login,user FROM login where id_login=?", [req.decoded.id]);

        if (result[0].length > 0) {
            next();
        } else {
            return res.status(401).send({
                success: false,
                code: 401,
                message: 'Usuario no autorizado'
            });
        }
    } catch (e) {
        console.error("tools: Error de busqueda user 96: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }

};

// validación del formato de la fecha y la fecha ingresada con el calendario que sea existente
exports.validaFechaDDMMAAAA = async (fecha) => {
    var dtCh = "-";
    var minYear = 1900;
    var maxYear = 2100;
    function isInteger(s) {
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (((c < "0") || (c > "9"))) return false;
        }
        return true;
    }
    function stripCharsInBag(s, bag) {
        var i;
        var returnString = "";
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (bag.indexOf(c) == -1) returnString += c;
        }
        return returnString;
    }
    function daysInFebruary(year) {
        return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
    }
    function DaysArray(n) {
        for (var i = 1; i <= n; i++) {
            this[i] = 31
            if (i == 4 || i == 6 || i == 9 || i == 11) { this[i] = 30 }
            if (i == 2) { this[i] = 29 }
        }
        return this
    }
    function isDate(dtStr) {
        var daysInMonth = DaysArray(12)
        var pos1 = dtStr.indexOf(dtCh)
        var pos2 = dtStr.indexOf(dtCh, pos1 + 1)
        var strDay = dtStr.substring(0, pos1)
        var strMonth = dtStr.substring(pos1 + 1, pos2)
        var strYear = dtStr.substring(pos2 + 1)
        strYr = strYear
        if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1)
        if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1)
        for (var i = 1; i <= 3; i++) {
            if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1)
        }
        month = parseInt(strMonth)
        day = parseInt(strDay)
        year = parseInt(strYr)
        if (pos1 == -1 || pos2 == -1) {
            return false
        }
        if (strMonth.length < 1 || month < 1 || month > 12) {
            return false
        }
        if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
            return false
        }
        if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
            return false
        }
        if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
            return false
        }
        return true
    }
    if (isDate(fecha)) {
        return true;
    } else {
        return false;
    }
}
