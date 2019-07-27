const authHandler = require('../handlers/AuthHandler'),
    yavukushModel = require('../db/models/YavukushModel'),
    moment = require('moment');

module.exports = {
    name: 'yavukush',
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                yavukushModel.add(req.body)
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
                yavukushModel.update(req.body)
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
                    if (q.start_date) {
                        let startDate = new Date(q.start_date);
                        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                        defaultConditions.date = { '$gte': startDate };
                    }

                    if (q.end_date) {
                        let endDate = new Date(q.end_date);
                        endDate.setDate(endDate.getDate() + 1);
                        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                        if (defaultConditions.date) {
                            if (Object.keys(defaultConditions.date).length) {
                                defaultConditions.date.$lt = endDate;
                            } else {
                                defaultConditions.date = { '$lt': endDate };
                            }
                        }
                    }

                    if (q.search_card_type) {
                        defaultConditions["card_type"] = { '$regex': new RegExp(q.search_card_type, 'i') };
                    }

                    if (q.search_entry_type) {
                        defaultConditions["entry_type"] = { '$regex': new RegExp(q.search_entry_type, 'i') };
                    }
                }
                
                yavukushModel.list(defaultConditions)
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