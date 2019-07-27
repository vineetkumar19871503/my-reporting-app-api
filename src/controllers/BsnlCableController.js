const authHandler = require('../handlers/AuthHandler'),
    bsnlCableModel = require('../db/models/BsnlCableModel'),
    moment = require('moment');

module.exports = {
    name: 'bsnlcable',
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                bsnlCableModel.add(req.body)
                    .then(function (response) {
                        response = JSON.parse(JSON.stringify(response));
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err);
                    });
            });
        },
        update: function (req, res, next) {
            authHandler(req, res, next, function () {
                bsnlCableModel.update(req.body)
                    .then(function (response) {
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err);
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
                    if (q.search_customer_name) {
                        defaultConditions["customer_name"] = { '$regex': new RegExp(q.search_customer_name, 'i') };
                    }
                    if (q.search_mobile_number) {
                        defaultConditions["mobile_number"] = { '$regex': new RegExp(q.search_mobile_number, 'i') };
                    }
                    if (q.search_status) {
                        defaultConditions["status"] = q.search_status;
                    }
                }
                bsnlCableModel.list(defaultConditions)
                    .then(function (documents) {
                        var response = {
                            message: 'No record found!'
                        };
                        documents = JSON.parse(JSON.stringify(documents));
                        documents = documents.map(function (e) {
                            const momentDate = moment(e.date);
                            e.date = momentDate.format("MM/DD/YYYY");
                            e.display_date = momentDate.format('DD/MM/YYYY');
                            return e;
                        });
                        if (documents.length) {
                            response.message = 'Records';
                        }
                        response.data = documents;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        }
    }
}