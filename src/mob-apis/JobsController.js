const authHandler = require('../handlers/AuthHandler'),
    { addZeroes } = require('../db/components/counter'),
    dispatchModel = require('../db/models/DispatchModel'),
    jobModel = require('../db/models/JobModel'),
    ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    name: 'jobs',
    get: {
        // permission wise apis
        index: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = { "deleted": false };
                jobModel.getJobs(defaultConditions)
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
            });
        },

        // apis for app (just check token)
        getJobById: function (req, res, next) {
            var response = {
                message: 'Job not found!'
            };
            if (typeof req.query.id != undefined) {
                let defaultConditions = { 'deleted': false, '_id': ObjectId(req.query.id) };
                jobModel.getJobs(defaultConditions)
                    .then(function (jobs) {
                        if (jobs.length) {
                            response.message = 'Job';
                        }
                        response.data = jobs;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            } else {
                res.rest.serverError('Invalid request. Please provide job id');
            }
        },
        jobListByCustomerid: function (req, res, next) {
            var response = {
                message: 'Job not found!'
            };
            if (typeof req.query.id != undefined) {
                let defaultConditions = { 'deleted': false, 'c_id': ObjectId(req.query.id) };
                jobModel.jobListByCustomerid(defaultConditions)
                    .then(function (jobs) {
                        if (jobs.length) {
                            response.message = 'Job';
                        }
                        response.data = jobs;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            } else {
                res.rest.serverError('Invalid request. Please provide customer id');
            }
        },
        getNextId: function (req, res, next) {
            authHandler(req, res, next, function () {
                jobModel.getJobs({}, {}, { '_id': -1 }, 1)
                    .then(function (jobs) {
                        let nextId = addZeroes('job_id', 1);
                        if (jobs.length) {
                            nextId = addZeroes('job_id', parseInt(jobs[0].job_id) + 1);
                        }
                        res.rest.success({ 'message': 'Next ID', 'data': nextId });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Job could not be added. ' + err.message });
                    });
            });
        }
    },
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                jobModel.saveJob(req.body)
                    .then(function (response) {
                        res.rest.success({ 'message': 'Job added successfully!' });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Job could not be added. ' + err.message });
                    });
            });
        },
        convertToJob: function (req, res, next) {
            authHandler(req, res, next, function () {
                jobModel.convertToJob(req.body)
                    .then(function (response) {
                        res.rest.success({ 'message': 'Quote converted successfully!' });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Job could not be added. ' + err.message });
                    });
            });
        },
        delete: function (req, res, next) {
            authHandler(req, res, next, function () {
                let data = req.body;
                if (data) {
                    jobModel.updateJob({ '_id': data.j_id }, { 'deleted': true })
                        .then(function (data) {
                            res.rest.success({ 'message': 'Job removed successfully!' });
                        })
                        .catch(function (err) {
                            res.rest.serverError({ 'message': 'Error : Job could not be removed. ' + err.message });
                        });
                } else {
                    res.rest.serverError('Invalid request');
                }
            });
        }
    }
}
