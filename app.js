
'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var enrouten = require('express-enrouten');
var RedisStore = require('connect-redis')(session);

var env = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = env;

var config = require('config');
var Logger = require('./lib/logger');
var logger = Logger.getLogger('index');
require('./lib/utilLibrary');

var app = express();
app.enable('trust proxy');
app.use(Logger.getExpressLogger());
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * 模板渲染的时候，全局的模型对象
 */
app.locals.g_base = {
    sitebase: config.get('siteConfig.host'),
    apibase: config.get('hostConfig')
};
app.locals.g_mui = config.get('mui');

var viewCache = process.env.NODE_ENV == 'production' ? true : config.get('cacheConfig.viewCache');
var adaro = require('adaro');
app.engine('dust', adaro.dust({ cache: viewCache, whitespace: true , helpers: ['dustjs-helpers']}));
app.set('views', './public/templates');
app.set('view engine', 'dust');

app.use(enrouten({
    directory: 'controllers'
}));

if (process.env.RUN_MODE === 'dev') {
    require('./staticsrc/build/dev-server')(app);
}

 app.use(function(req, res){
     res.render('index');
 });

process.on('uncaughtException', function(err) {
    logger.error('Error caught in uncaughtException event:', err);
    console.error('Error caught in uncaughtException event:', err);
});


var port = process.env.PORT || config.get('server.port');
console.log('env : ', env);
console.log('port: ', port);
console.log('viewCache: ', viewCache);
app.listen(port);

