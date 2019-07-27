const authHandler = require('../handlers/AuthHandler'),
    discomPoleModel = require('../db/models/DiscomPoleModel'),
    moment = require('moment');

module.exports = {
    name: 'discompole',
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                discomPoleModel.add(req.body)
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
                discomPoleModel.update(req.body)
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
                }
                
                discomPoleModel.list(defaultConditions)
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