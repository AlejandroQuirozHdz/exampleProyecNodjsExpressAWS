//imporatación de modulos y archivos
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const fs = require('fs')
const methodOverride = require('method-override');

//modulo de exportacion
module.exports = function () {
  let app = express();
  //proces para validar si esta en development o en production para la creación de los logs
  switch (process.env.NODE_ENV) {
    case 'development':
      app.use(morgan('dev'));
      break;
    case 'production':
      let fileStreamRotator = require('file-stream-rotator');
      let logDirectory = __dirname + '/log';
      // Ensure log directory exists
      fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

      // Create a rotating write stream
      let accessLogStream = fileStreamRotator.getStream({
        date_format: 'YYYY-MM-DD',
        filename: logDirectory + '/access-%DATE%.log',
        frecuency: 'daily',
        verbose: false
      });

      app.use(morgan('common', { stream: accessLogStream }));
      break;

    default:
      break;
  }

  // Compress the response data using gzip/deflate
  let rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }

  // Use the 'body-parser' middleware functions
  app.use(bodyParser.urlencoded({
    extended: true,
    verify: rawBodySaver,
    extended: true
  }));
  //limita el peso del json al enviarlo y lo verifica 
  app.use(bodyParser.json({ limit: '50mb', verify: rawBodySaver }));

  app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }));
  // Handle no valid JSON
  app.use(function (err, req, res, next) {
    res.status(400).send({
      success: false,
      message: 'JSON no válido',
      err: err
    });
  });
  //Use the compression de json
  app.use(compression());
  // Use the 'method-override' middleware functions
  app.use(methodOverride());

  // Configure the app to handle CORS requests
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers',
      'X-Requested-With, Content-Type, Authorization');

    next();
  });

  // Load the signature (jwt)
  app.set('secret', config.secret);

  //Load the signature (port)
  app.set('port', process.env.PORT || 8090)

  // Set the application folder
  app.use(express.static(__dirname + './public'));

  // Load routing files
  //require(config.routesFile + 'index.server.routers.js')(app);
  require('../user/router/user.server.routers')(app);
  require('../task/router/task.server.routers')(app);
  require('../matrizIndex/router/indexMatriz.server.routers')(app);

  //retorna la variable app donde sea importado al archivo express.js
  return app;
}