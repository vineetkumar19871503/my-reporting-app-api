/**
 * Middleware to check auth and role permissions before router method is called
 */

const authorize = require('./authorize');
module.exports = function (req, res, next) {
    authorize.verifyToken(req)
        .then(function () {
            next();
        })
        .catch(function (err) {
            req.authError = err.message;
            next();
        });
}