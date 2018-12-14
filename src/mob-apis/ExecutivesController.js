const authHandler = require('../handlers/AuthHandler'),
    userModel = require('../db/models/UserModel');
module.exports = {
    name: 'executives',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                userModel.getUsers({
                        'role.alias': 'executive'
                    }, {
                        'password': 0
                    })
                    .then(function (executives) {
                        var response = {
                            message: 'Executive not found!'
                        };
                        if (executives.length) {
                            response.message = 'Executives';
                        }
                        response.data = executives;
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
            authHandler(req, res, next, function () {
                userModel.saveUser(req.body)
                    .then(function (response) {
                        res.rest.success({
                            'message': 'Executive saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': 'Error : Executive could not be saved. ' + err.message
                        });
                    });
            });
        }
    }
}