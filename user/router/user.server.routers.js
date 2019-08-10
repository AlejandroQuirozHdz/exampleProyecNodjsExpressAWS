//imporatación de modulos y archivos
const servicesPhat = require('../../config/config');
const urlServices = servicesPhat.phatServices + 'v1/user/newUser/';
const urlServicesToken = servicesPhat.phatServices + 'v1/user/verifyToken/';
const urlServicesLogin = servicesPhat.phatServices + 'v2/user/login/';
const controller = require('../functions/user.server.controller');
const crud = require('../../utils/crud.server.controller');
const tools = require('../../utils/tools.server.controller');

//exportación del modulo recibiendo la variable de app  
module.exports = function (app) {
      //asiganción del path para el direccionamiento de la peticion mediante los metodos GET, POST, PUT y DELETE
      app.route(urlServices)
            .post(controller.createUser,//ejecución de las funciones llamados para el funcionamiento en ese PATH 
                  crud.createUserBD,
                  crud.createCredentialBD,
                  crud.createToken);

      app.route(urlServicesToken)
            .get(tools.isAuthenticated,
                  tools.mustBeAuthorizedUser);

      app.route(urlServicesLogin)
            .post(controller.userAuthentication,
                  crud.createToken)

};