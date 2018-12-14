const authHandler = require('../handlers/AuthHandler'),
    dispatchModel = require('../db/models/DispatchModel'),
    driverModel = require('../db/models/DriverModel');
module.exports = {
    name: 'drivers',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                driverModel.getDrivers({ 'type': 'dr' })
                    .then(function (drivers) {
                        let response = { message: 'Driver not found!' };
                        if (drivers.length) {
                            response.message = 'Drivers';
                        }
                        response.data = drivers;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError({ error: err.message });
                    });
            });
        },
        getDriversByTruckType: function (req, res, next) {
            authHandler(req, res, next, function () {
                const conditions = { 'type': 'dr' };
                if (req.query.type && req.query.type != 'undefined') {
                    conditions.truck_type = req.query.type;
                }
                driverModel.getDrivers(conditions)
                    .then(function (drivers) {
                        let response = { message: 'Driver not found!' };
                        if (drivers.length) {
                            response.message = 'Drivers';
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
                driverModel.save(req.body)
                    .then(function (response) {
                        res.rest.success({ 'message': 'Driver saved successfully!' });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Driver could not be saved. ' + err.message });
                    });
            });
        },
        login: function (req, res, next) {
            const tag_id = req.body.tag_id;
            let response = { message: 'Driver not found!', data: {} };
            dispatchModel.getDispatchDetails({ 'assigned_drivers.tag_id': tag_id })
                .then(function (driver) {
                    if (driver.length) {
                        driver = driver[0];
                    } else {
                        res.rest.success(response);
                    }
                })
                .catch(function (err) {
                    res.rest.serverError(err.message);
                    return next();
                });
        }
    }
}