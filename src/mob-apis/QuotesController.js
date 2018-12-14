const authHandler = require('../handlers/AuthHandler'),
    quoteModel = require('../db/models/QuoteModel'),
    ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    name: 'quotes',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                quoteModel.getQuotes()
                    .then(function (quotes) {
                        var response = {
                            message: 'quotes not found!'
                        };
                        if (quotes.length) {
                            response.message = 'quotes';
                        }
                        response.data = quotes;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            error: err.message
                        });
                    });
            });
        },
        getQuoteById: function (req, res, next) {
            authHandler(req, res, next, function () {
                if (typeof req.query.id != undefined) {
                    quoteModel.getQuotes({ '_id': ObjectId(req.query.id) })
                        .then(function (quotes) {
                            var response = {
                                message: 'quotes not found!'
                            };
                            if (quotes.length) {
                                response.message = 'quotes';
                            }
                            response.data = quotes;
                            res.rest.success(response);
                        })
                        .catch(function (err) {
                            res.rest.serverError({
                                error: err.message
                            });
                        });
                } else {
                    res.rest.serverError('Invalid request. Please provide quote id');
                }
            });
        },

        getQuotesCountByCustomer: function (req, res, next) {
            authHandler(req, res, next, function () {
                quoteModel.getQuotesCountByCustomer()
                    .then(function (quotes) {
                        var response = {
                            message: 'quotes not found!'
                        };
                        if (quotes.length) {
                            response.message = 'quotes';
                        }
                        response.data = quotes;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            error: err.message
                        });
                    });
            });
        },
        getAllQuotesByCustomerId: function (req, res, next) {
            authHandler(req, res, next, function () {
                var conditions = {};
                if (typeof req.query.c_id != 'undefined') {
                    conditions = { 'c_id': req.query.c_id };
                }
                quoteModel.getAllQuotesByCustomerId(conditions)
                    .then(function (quotes) {
                        var response = {
                            message: 'quotes not found!'
                        };
                        if (quotes.length) {
                            response.message = 'quotes';
                        }
                        response.data = quotes;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            error: err.message
                        });
                    });
            });
        },
        getJobsCountByCustomer: function (req, res, next) {
            authHandler(req, res, next, function () {
                var conditions = { 'quote.converted': true };
                quoteModel.getJobsCountByCustomer(conditions)
                    .then(function (quotes) {
                        var response = {
                            message: 'quotes not found!'
                        };
                        if (quotes.length) {
                            response.message = 'quotes';
                        }
                        response.data = quotes;
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
                quoteModel.save(req.body)
                    .then(function (dispatch) {
                        res.rest.success({
                            'data': dispatch,
                            'message': 'Quote saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': 'Error : quote could not be saved! ' + err.message
                        });
                    });
            });
        },
        edit: function (req, res, next) {
            authHandler(req, res, next, function () {
                quoteModel.update({ '_id': req.body.id }, req.body)
                    .then(function (dispatch) {
                        res.rest.success({
                            'data': dispatch,
                            'message': 'Quote saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({
                            'message': 'Error : quote could not be saved! ' + err.message
                        });
                    });
            });
        }
    }
}