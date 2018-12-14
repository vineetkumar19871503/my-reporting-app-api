const authHandler = require('../handlers/AuthHandler'),
    assignedJobModel = require('../db/models/AssignedJobModel'),
    dispatchModel = require('../db/models/DispatchModel'),
    { getToday } = require('../globals/methods'),
    ojectId = require('mongoose').Types.ObjectId;

module.exports = {
    name: 'dispatches',
    get: {
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                var conditions = {};
                if (typeof req.query.date != 'undefined') {
                    const dt = new Date(req.query.date),
                        nextDate = new Date();
                    dt.setHours(0, 0, 0, 0);
                    dt.toISOString();
                    nextDate.setDate(dt.getDate() + 1);
                    nextDate.setHours(0, 0, 0, 0);
                    nextDate.toISOString();
                    conditions = {
                        'date': {
                            '$gte': dt,
                            '$lt': nextDate
                        }
                    };
                }
                dispatchModel.getDispatchDetails(conditions)
                    .then(function (dispatches) {
                        var response = {
                            message: 'Data not found!'
                        };
                        if (dispatches.length) {
                            response.message = 'Dispatched Jobs';
                        }
                        response.data = dispatches;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },

        // public apis start (require no authentication)
        // this apis get jobs which are not in added in dispatches collection
        getJobs: function (req, res, next) {
            authHandler(req, res, next, function () {
                var dispatchConditions = {};
                if (typeof req.query.date != 'undefined') {
                    const dt = new Date(req.query.date),
                        nextDate = new Date();
                    dt.setHours(0, 0, 0, 0);
                    dt.toISOString();
                    nextDate.setDate(dt.getDate() + 1);
                    nextDate.setHours(0, 0, 0, 0);
                    nextDate.toISOString();
                    dispatchConditions = {
                        'date': {
                            '$gte': dt,
                            '$lt': nextDate
                        }
                    };
                }
                dispatchModel.getDispatches(dispatchConditions, { 'job_id': 1 })
                    .then(function (dispatches) {
                        dispatches = dispatches.map(function (d) {
                            return d.job_id;
                        });
                        require('../db/models/JobModel').getSubJobs({ '_id': { '$nin': dispatches } })
                            .then(function (jobs) {
                                var response = {
                                    message: 'Jobs not found!'
                                };
                                if (jobs.length) {
                                    response.message = 'Jobs';
                                }
                                response.data = jobs;
                                res.rest.success(response);
                            })
                            .catch(function (err) {
                                res.rest.serverError(err.message);
                            });
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        },
        getDispatchDetailById(req, res, next) {
            if (typeof req.query.id != 'undefined') {
                dispatchModel.getDispatchDetails({ '_id': ojectId(req.query.id) })
                    .then(function (dispatch) {
                        var response = {
                            message: 'No record found!'
                        };
                        if (dispatch.length) {
                            response.message = 'Dispatch Detail';
                        }
                        response.data = dispatch;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            } else {
                res.rest.serverError('Please provide a valid dispatch ID');
            }
        },
        getDispatchDetailByJobId(req, res, next) {
            let conditions = {};
            if (typeof req.query.job_id != 'undefined') {
                conditions = { 'job_id': ojectId(req.query.job_id) };
            }
            dispatchModel.getDispatches(conditions)
                .then(function (dispatches) {
                    var response = {
                        message: 'No record found!'
                    };
                    if (dispatches.length) {
                        response.message = 'Dispatches';
                    }
                    response.data = dispatches;
                    res.rest.success(response);
                })
                .catch(function (err) {
                    res.rest.serverError(err.message);
                });
        }
    },
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                dispatchModel.save(req.body)
                    .then(function (response) {
                        res.rest.success({
                            'data': response,
                            'message': 'Data saved successfully!'
                        });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Data could not be saved. ' + err.message });
                    });
            });
        },
        cancel: function (req, res, next) {
            authHandler(req, res, next, function () {
                const params = req.body,
                    data = Object.assign({}, params),
                    conditions = { 'job_id': params.job_id };
                data.cancelled = true;
                data.cancel_date = getToday();
                delete data.job_id;
                dispatchModel.update(conditions, data)
                    .then(function (response) {
                        res.rest.success({ 'message': 'Job cancelled successfully!' });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Could not cancel job. ' + err.message });
                    });
            });
        },
        delete: function (req, res, next) {
            authHandler(req, res, next, function () {
                // first check if there are drivers assigned & not cancelled then don't let user to delete dispatch record
                dispatchModel.getDispatchDetails({ '_id': ojectId(req.body._id), 'assign.drivers.cancelled': false })
                    .then(function (disp) {
                        if (disp.length) {
                            res.rest.serverError({ 'message': 'Drivers have been assigned to this job. Please remove them first' });
                        } else {
                            dispatchModel.delete(req.body)
                                .then(function (response) {
                                    assignedJobModel.delete({ 'dispatch_id': ojectId(req.body._id) })
                                        .then(function () {
                                            res.rest.success({ 'message': 'Record deleted successfully!' });
                                        })
                                        .catch(function () {
                                            res.rest.serverError({ 'message': 'Error : Record could not be deleted. ' + err.message });
                                        });
                                })
                                .catch(function (err) {
                                    res.rest.serverError({ 'message': 'Error : Record could not be deleted. ' + err.message });
                                });
                        }
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Could not get the dispatch details. ' + err.message });
                    });
            });
        },
        move: function (req, res, next) {
            authHandler(req, res, next, function () {
                let data = req.body;
                if (data) {
                    dispatchModel.update({ '_id': data._id }, { 'date': data.move_date })
                        .then(function (data) {
                            res.rest.success({ 'message': 'Job moved successfully!' });
                        })
                        .catch(function (err) {
                            res.rest.serverError({ 'message': 'Error : Job could not be moved. ' + err.message });
                        });
                } else {
                    res.rest.serverError('Invalid request');
                }
            });
        }
    }
}