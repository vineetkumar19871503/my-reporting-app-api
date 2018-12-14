const authHandler = require('../handlers/AuthHandler'),
    customerModel = require('../db/models/CustomerModel'),
    customerLogModel = require('../db/schemas/CustomerSchema').models.customerLogModel,
    objectId = require('mongoose').Types.ObjectId;
module.exports = {
    name: 'customers',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                let conditions = {};
                if (req.query !== undefined) {
                    conditions = req.query;
                    if (conditions.id) {
                        conditions._id = objectId(conditions.id);
                        delete conditions.id;
                    }
                }
                customerModel.getCustomers(conditions)
                    .then(function (customers) {
                        var response = {
                            message: 'Customers not found!'
                        };
                        if (customers.length) {
                            response.message = 'Customers';
                        }
                        response.data = customers;
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
                customerModel.saveCustomer(req.body)
                    .then(function (response) {
                        res.rest.success({
                            'message': 'Customer saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': err + 'Error : Customer could not be saved!'
                        });
                    });
            });

        },
        edit: function (req, res, next) {
            authHandler(req, res, next, function () {
                const params = req.body,
                    data = Object.assign({}, params),
                    conditions = { '_id': objectId(params.c_id) };
                customerModel.update(conditions, data)
                    .then(function (response) {
                        res.rest.success({
                            'message': 'Customer update successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': err + 'Error : Customer could not be update!'
                        });
                    });
            });

        },
         addCustomer_logs: function (req, res, next) {
            authHandler(req, res, next, function () {
               
                const datavalue = {
                    "name":req.body.org_name,
                    "c_id":req.body.c_id,
                     "notes":req.body.cust_notes,
                }
                customerLogModel.saveCustomer_logs(datavalue)
                    .then(function (response) {
                        res.rest.success({
                            'message': 'Customer Log saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': err + 'Error : Customer Log could not be saved!'
                        });
                    });
            });

        },
    }
}