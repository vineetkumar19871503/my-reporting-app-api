const authHandler = require('../handlers/AuthHandler'),
    bsnlCableModel = require('../db/models/BsnlCableModel'),
    moment = require('moment');

module.exports = {
    name: 'bsnlconnection',
    post: {
        add: function (req, res, next) {
            bsnlCableModel.add(req.body)
                .then(function (response) {
                    response = JSON.parse(JSON.stringify(response));
                    res.rest.success(response);
                })
                .catch(function (err) {
                    res.rest.serverError(err);
                });
        }
    }
}