const authHandler = require('../handlers/AuthHandler'),
    bsnlConnectionModel = require('../db/models/BsnlConnectionModel'),
    moment = require('moment');

module.exports = {
    name: 'bsnlconnection',
    post: {
        add: function (req, res, next) {
            bsnlConnectionModel.add(req.body)
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