const bcrypt = require('bcrypt'),
    generateToken = require('../auth/generateToken'),
    { extractToken } = require('../auth/authorize'),
    userModel = require('../db/models/UserModel');
module.exports = {
    name: 'users',
    post: {
        login: function (req, res, next) {
            const email = req.body.email,
                password = req.body.password;
            var response = { message: 'User not found!', data: {} };
            userModel.getUsers({ 'email': email })
                .then(function (user) {
                    if (user.length && bcrypt.compareSync(password, user[0].password)) {
                        user = user[0];
                        generateToken({ id: user._id, email: user.email, name: user.fname }, function (err, token) {
                            if (!err) {
                                //saving user data into session
                                req.session.userData = JSON.parse(JSON.stringify(user));
                                req.session.token = token;

                                //preparing response
                                var resUser = JSON.parse(JSON.stringify(user));
                                delete resUser.role.permissions;
                                response.message = 'Logged in successfully!';
                                resUser.password = '';
                                response.data = resUser;
                                response.token = token;
                            }
                            res.rest.success(response);
                        });
                    } else {
                        res.rest.success(response);
                    }
                })
                .catch(function (err) {
                    res.rest.serverError(err.message);
                    return next();
                });
        }
    },
    get: {
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