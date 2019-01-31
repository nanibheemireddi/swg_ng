/*
 * dotenv setup to manage environments
 */
var argv = require('yargs')
    .command('environment', function(yargs) {
        yargs.options({
            location: {
                demand: true,
                alias: 'e',
                type: 'string'
            }
        });
    })
    .help('help')
    .argv;
envFileName = argv.e;
require('dotenv').config({ path: ".env." + envFileName });

/*
 * define all global and local variables
 */


global.express = require('express');
global.path = require('path');
global.fs = require('fs');
global.logger = require('morgan');
global.app = express();
global.bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');

//Multiparty for image upload & path for image uploads dir
// global.fileUpload = require('express-fileupload');
global.uuid = require('uuid');
//global.multiparty = require('multiparty');
app.set('views', path.join(__dirname, ''));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/swagger'));

global.cors = require('cors');
global.router = express.Router();

global.async = require('async');

global.helper = require('./app/helpers/_helpers');
global._mongoose = require('./app/helpers/_mongoose');


global.mongoose = require('mongoose');
// mongoose.connect('mongodb://' + process.env.mongo_server, { autoIndex: false });
mongoose.connect('mongodb://' + process.env.mongo_server, {
    useNewUrlParser: true
});
mongoose.Promise = require('bluebird');
global.Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ extended: true, limit: '500mb', parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '500mb' }));

app.use(logger('dev'));

var ip = require("ip");
global.requestUserIp = ip.address();

/*
 * for angular
 */
app.use(cors());
app.options('*', cors({ origin: '*' }));
// app.use(fileUpload());
/**
 * For validation using middleware
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Expose-Headers", "x-access-token");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

global.auth = require('./app/middleware/auth.js');
app.use(auth('off'));

var colors = require('colors');
var settings = require('./config/settings');
global._ = require('lodash');

// global.dateTime = require('node-datetime');

global.models = require('./app/models');
global.common = require('./app/common');

require('./app/admin');
require('./app/mob');

// app.use('/', mob);

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'PDP API',
        version: '2.0.0',
        description: '',
    },
    host: process.env.SERVER_URL + ':' + process.env.NODE_PORT,
    basePath: '',
    schemes: ['http', 'https'],
    consumes: [
        "application/json",
        "application/xml"
    ],
    produces: [
        "application/json",
        "application/xml"
    ],
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./app/mob/components/customer/*.js'],
    apis: ['./swagger.yaml'],

};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

function validateModel(name, model) {
    const responseValidation = swaggerSpec.validateModel(name, model, false, true)
    if (!responseValidation.valid) {
        console.error(responseValidation.errors)
        throw new Error(`Model doesn't match Swagger contract`)
    }
}

app.use('/api-docs', function(req, res){
    // console.log('res file', res.render);
    res.render('./swagger/index.html');
    // res.sendFile('./swagger/index.html');
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

var http = require('http').createServer(app);

http.listen(settings.port, function() {
    console.log("Listening on port " + settings.port);
}).on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use. Is the server already running?');
    }
})