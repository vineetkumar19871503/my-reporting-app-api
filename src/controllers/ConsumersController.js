const authHandler = require('../handlers/AuthHandler'),
    consumerModel = require('../db/models/ConsumerModel');

module.exports = {
    name: 'consumers',
    get: {
        list: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = { };
                consumerModel.getConsumers(defaultConditions)
                    .then(function (consumers) {
                        var response = {
                            message: 'Consumer not found'
                        };
                        if (consumers.length) {
                            response.message = 'Consumers';
                        }
                        response.data = consumers;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },
        getDetailByKNumber: function (req, res, next) {
            authHandler(req, res, next, function () {
                const regex = new RegExp(req.query.k_no, 'i');
                let defaultConditions = { 'k_number': regex };
                consumerModel.getConsumers(defaultConditions)
                    .then(function (consumers) {
                        var response = {
                            message: 'Consumer not found'
                        };
                        if (consumers.length) {
                            response.message = 'Consumer';
                        }
                        response.data = consumers;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        }
    }
}