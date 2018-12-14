/**
 * generate token using jsonwebtoken when user tries to login
 */

const config = require('../../config'),
  jwtExp = typeof config.jwtTokenExpires != 'undefined' ? config.jwtTokenExpires : 2, //json web token expires in days
  jwt = require('jsonwebtoken'),
  jwtSecret = config.jwtSecret;

function generateToken(tokenData, done) {
  jwt.sign({
    auth: 'magic',
    data: tokenData,
    exp: Math.floor(new Date().getTime() / 1000) + jwtExp * 24 * 60 * 60 //expires in days
  }, jwtSecret, done);
}
module.exports = generateToken;