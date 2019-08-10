//imporatación de modulos y archivos
const servicesPhat = require('../../config/config');
const urlServices = servicesPhat.phatServices + 'v1/indexMatriz';
const controller = require('../functions/indexMatriz.server.controller');
const tools = require('../../utils/tools.server.controller');

//exportación del modulo recibiendo la variable de app  
module.exports = function (app) {
    //asiganción del path para el direccionamiento de la peticion mediante los metodos GET, POST, PUT y DELETE   
    app.route(urlServices)
        //ejecución de las funciones llamados para el funcionamiento en ese PATH 
        .post(tools.isAuthenticated,
            tools.mustBeAuthorizedUser,
            controller.matrizIndex);
};