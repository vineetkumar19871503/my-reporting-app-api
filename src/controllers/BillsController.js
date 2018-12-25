const authHandler = require('../handlers/AuthHandler'),
    consumerModel = require('../db/models/ConsumerModel');
billModel = require('../db/models/BillModel');

module.exports = {
    name: 'bills',
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                consumerModel.getConsumers({ 'k_number': req.body.k_number })
                    .then(function (consumer) {
                        if (consumer.length) {
                            req.body.consumer_id = consumer[0]._id;
                            billModel.saveBill(req.body)
                                .then(function (response) {
                                    response = JSON.parse(JSON.stringify(response));
                                    response.consumer = consumer[0];
                                    res.rest.success({ 'message': 'Bill added successfully!', 'data': response });
                                })
                                .catch(function (err) {
                                    res.rest.serverError({ 'message': 'Error : Bill could not be added. ' + err.message });
                                });
                        } else {
                            consumerModel.saveConsumer(req.body)
                                .then(function (consumer) {
                                    req.body.consumer_id = consumer._id;
                                    billModel.saveBill(req.body)
                                        .then(function (response) {
                                            response = JSON.parse(JSON.stringify(response));
                                            response.consumer = consumer;
                                            res.rest.success({ 'message': 'Bill added successfully!', 'data': response });
                                        })
                                        .catch(function (err) {
                                            consumerModel.delete({ '_id': consumer._id });
                                            res.rest.serverError({ 'message': 'Error : Bill could not be added. ' + err.message });
                                        });
                                })
                                .catch(function (err) {
                                    res.rest.serverError({ 'message': 'Error : Bill could not be added. ' + err.message });
                                });
                        }
                    })
                    .catch(function (err) {

                    });
            });
        }
    },
    get: {
        list: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = {};
                const q = req.query;
                if (q && Object.keys(q).length) {
                    if (q.k_number) {
                        defaultConditions["consumer.k_number"] = { '$regex': new RegExp(q.k_number, 'i') };
                    }
                    if (q.startDate) {
                        let startDate = new Date(q.startDate);
                        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                        defaultConditions.bill_submission_date = { '$gte': startDate };
                    }
                    if (q.endDate) {
                        let endDate = new Date(q.endDate);
                        endDate.setDate(endDate.getDate() + 1);
                        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                        if (defaultConditions.bill_submission_date) {
                            if (Object.keys(defaultConditions.bill_submission_date).length) {
                                defaultConditions.bill_submission_date.$lt = endDate;
                            } else {
                                defaultConditions.bill_submission_date = { '$lt': endDate };
                            }
                        }
                    }
                }
                billModel.getBills(defaultConditions)
                    .then(function (bills) {
                        var response = {
                            message: 'Bills not found!'
                        };
                        if (bills.length) {
                            response.message = 'Bills';
                        }
                        response.data = bills;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        }
    }
}