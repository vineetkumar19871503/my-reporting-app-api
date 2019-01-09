var config = {
  jwtTokenExpires: 100,
  expressSessionSecure: true,
  expressSessionHttpOnly: false,
  db: {
    url: 'mongodb://vineetkumar198715:reportingapp123@ds121624.mlab.com:21624/reporting-app'
  },
  apiPrefix: '/api/v1',
  bcryptSalt: 10,
  jwtSecret: '09sdufa0sfusafkljsa098',
  host: 'localhost',
  port: process.env.PORT || 3000,
  enableAuth: true,
  enableCheckPermissions: false
}
if (process.env.NODE_ENV != undefined && process.env.NODE_ENV == 'dev') {
  config.expressSessionSecure = false;
  config.expressSessionHttpOnly = true;
}
module.exports = config; 
