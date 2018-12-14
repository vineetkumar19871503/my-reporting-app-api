const authHandler = require('../handlers/AuthHandler'),
    driverModel = require('../db/models/DriverModel');
module.exports = {
    name: 'pullers',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                driverModel.getDrivers({ 'type': 'pu' })
                    .then(function (pullers) {
                        var response = {
                            message: 'Pullers not found!'
                        };
                        if (pullers.length) {
                            response.message = 'Pullers';
                        }
                        response.data = pullers;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            error: err.message
                        });
                    });
            });
        },
        getPullersByTruckType: function (req, res, next) {
            authHandler(req, res, next, function () {
                const conditions = { 'type': 'pu' };
                if (req.query.type && req.query.type != 'undefined') {
                    conditions.truck_type = req.query.type;
                }
                driverModel.getDrivers(conditions)
                    .then(function (drivers) {
                        let response = { message: 'Pullers not found!' };
                        if (drivers.length) {
                            response.message = 'Pullers';
                        }
                        response.data = drivers;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError({ error: err.message });
                    });
            });
        }
    },
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                driverModel.savePuller(req.body)
                    .then(function (response) {
                        res.rest.success({
                            'message': 'Puller saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': 'Error : Puller could not be saved!!'
                        });
                    });
            });
        }
    }
}