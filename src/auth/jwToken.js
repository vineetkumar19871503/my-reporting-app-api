/**
 * verify the token received by jsonwebtoken
 */
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');
module.exports = function (token, done) {
  jwt.verify(token, jwtSecret, done);
}
module.exports = {
    issue:  function(payload) {
        return jwt.sign(
            payload,
            jwtSecret, // Token Secret that we sign it with
            {
                //expiresIn: '1h'
            }
        );
    },

    verify: function(token, callback) {
        return jwt.verify(
            token, // The token to be verified
            jwtSecret, // Same token we used to sign
            {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
            callback //Pass errors or decoded token to callback
        );
    },

    getPayload: function(token){
    	try {
    	return jwt.verify(token, jwtSecret);
  		}
		  catch (err) {
		    return {'error':'1'}
		  }
        
    }
}