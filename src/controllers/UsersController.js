const bcrypt = require('bcrypt'),
    authHandler = require('../handlers/AuthHandler'),
    generateToken = require('../auth/generateToken'),
    { extractToken } = require('../auth/authorize'),
    userModel = require('../db/models/UserModel');
module.exports = {
    name: 'users',
    post: {
        login: function (req, res, next) {
            const email = req.body.email,
                password = req.body.password;
            var response = { message: 'User not found!', data: {}, is_err: true };
            userModel.getUsers({ 'email': email })
                .then(function (user) {
                    if (user.length && bcrypt.compareSync(password, user[0].password)) {
                        user = user[0];
                        if (user.status) {
                            generateToken({ id: user._id, email: user.email, name: user.name }, function (err, token) {
                                if (!err) {
                                    //saving user data into session
                                    req.session.userData = JSON.parse(JSON.stringify(user));
                                    req.session.token = token;

                                    //preparing response
                                    var resUser = JSON.parse(JSON.stringify(user));
                                    response.message = 'Logged in successfully!';
                                    delete resUser.password;
                                    response.data = resUser;
                                    response.data.token = token;
                                    response.is_err = false;
                                }
                                res.rest.success(response);
                            });
                        } else {
                            res.rest.success({ 'is_err': true, 'message': 'User is disabled by the Administrator.' });
                        }
                    } else {
                        res.rest.success(response);
                    }
                })
                .catch(function (err) {
                    res.rest.serverError(err.message);
                    return next();
                });
        },
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                userModel.getUsers({ 'email': req.body.email })
                    .then(function (users) {
                        if (users.length) {
                            res.rest.success({ 'is_err': true, 'message': 'User already exists!' });
                        } else {
                            userModel.saveUser(req.body)
                                .then(function (response) {
                                    res.rest.success({ 'message': 'User added successfully!' });
                                })
                                .catch(function (err) {
                                    res.rest.serverError({ 'message': 'Error : User could not be added. ' + err.message });
                                });
                        }
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },
        edit: function (req, res, next) {
            authHandler(req, res, next, function () {
                userModel.getUsers({ 'email': req.body.email, '_id': { $ne: req.body.uid } })
                    .then(function (users) {
                        if (users.length) {
                            res.rest.success({ 'is_err': true, 'message': 'User already exists!' });
                        } else {
                            userModel.updateUser(req.body)
                                .then(function (response) {
                                    res.rest.success({ 'message': 'User updated successfully!' });
                                })
                                .catch(function (err) {
                                    res.rest.serverError({ 'message': 'Error : User could not be updated. ' + err.message });
                                });
                        }
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        }
    },
    get: {
        checkSession: function (req, res, next) {
            res.rest.success();
        },
        list: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = {};
                userModel.getUsers(defaultConditions)
                    .then(function (users) {
                        var response = {
                            message: 'Users not found!'
                        };
                        if (users.length) {
                            response.message = 'Users';
                        }
                        response.data = users;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },
        getUserById: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = { '_id': req.query.id };
                userModel.getUsers(defaultConditions)
                    .then(function (users) {
                        var response = {
                            message: 'User not found!'
                        };
                        if (users.length) {
                            response.message = 'User Detail';
                        }
                        response.data = users;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },
        getUserDetail: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = {};
                userModel.getUsers(defaultConditions)
                    .then(function (users) {
                        var response = {
                            message: 'User not found!'
                        };
                        if (users.length) {
                            response.message = 'User Detail';
                        }
                        response.data = users;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },
        logout: function (req, res, next) {
            // if header token is matches the session token then destroy the session
            //if (req.session.token === extractToken(req)) {
            req.session.destroy(function (err) {
                if (err) {
                    res.rest.serverError(err.message);
                } else {
                    res.rest.success('Logged out successfully!');
                }
            });
            // } else {
            //     res.rest.unauthorized('You are not authorized to perform this action.');
            // }
        }
    }
}