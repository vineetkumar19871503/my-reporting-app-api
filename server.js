
const { isDev } = require('./src/globals/methods');
const { port, apiPrefix, mobApiPrefix } = require('./config');
const config = require('./config');
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  expCtrl = require('./src/utilities/routes-generator'),
  restResponse = require('express-rest-response'),
  session = require('express-session');

app.use(require('cors')());

//express-rest-response middleware configuration  
app.use(restResponse({
  showStatusCode: true,
  showDefaultMessage: true
}));


//using express-session middleware
app.use(session({
  cookie: {
    httpOnly: config.expressSessionHttpOnly,
    path: '/',
    maxAge: (7 * 24 * 60 * 60 * 1000), //expires 7 days
    secure: config.expressSessionSecure,
  },
  resave: false,
  saveUninitialized: true,
  secret: '98safhsaf98safklnf'
}));



//using body-parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./src/auth/checkPermissions'));

//defining and using routers
const router = express.Router();
expCtrl.bind(router, __dirname + '/src/controllers/', apiPrefix); // For Api Routing
app.use(router);


//capture all 404 urls
app.use(function (req, res, next) {
  // respond with json
  if (req.accepts('json')) {
    res.rest.notFound();
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});

//connecting database
require('./src/db/connect')();

app.listen(port, () => {
  console.log('Express App listening on port:', port);
});