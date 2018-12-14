const authHandler = require('../handlers/AuthHandler'),
    userModel = require('../db/models/UserModel');
module.exports = {
    name: 'officers',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function(){
                userModel.getUsers()
                .then(function (users) {
                    var response = {
                        message: 'Officer not found!'
                    };
                    if (users.length) {
                        response.message = 'Officers';
                    }
                    response.data = users;
                    res.rest.success(response);
                })
                .catch(function (err) {
                    res.rest.serverError({
                        error: err.message
                    });
                });
            });
        }
    },
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function(){
                userModel.saveUser(req.body)
                .then(function (response) {
                    res.rest.success({
                        'message': 'Officer saved successfully!'
                    });
                })
                .catch(function (err) {
                    res.rest.serverError({
                        'message': 'Error : Officer could not be saved. ' + err.message
                    });
                });
            });
        }
    }
}