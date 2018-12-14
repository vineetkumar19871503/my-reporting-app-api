const authHandler = require('../handlers/AuthHandler'),
    dispatchModel = require('../db/models/DispatchModel'),
    jobModel = require('../db/models/JobModel'),
    ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    name: 'sub_jobs',
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
                jobModel.getSubJobs(defaultConditions)
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
        getAllSubJobById: function (req, res, next) {
            var response = {
                message: 'Job not found!'
            };
            if (typeof req.query.id != undefined) {
                let defaultConditions = { 'deleted': false, 'j_id': ObjectId(req.query.id) };
                jobModel.AllSubJobById(defaultConditions)
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
        getSubJobById: function (req, res, next) {
            var response = {
                message: 'Job not found!'
            };
            if (typeof req.query.id != undefined) {
                let defaultConditions = { 'deleted': false, '_id': ObjectId(req.query.id) };
                jobModel.SubJobById(defaultConditions)
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
    },
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                jobModel.saveJob(req.body, 's')
                    .then(function (response) {
                        res.rest.success({ 'message': 'Job added successfully!' });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Job could not be added. ' + err.message });
                    });
            });
        },
        edit: function (req, res, next) {
            authHandler(req, res, next, function () {
                const params = req.body,
                    data = Object.assign({}, params),
                    conditions = { '_id': ObjectId(params._id) };
                jobModel.updateSubJob(conditions, data)
                    .then(function (response) {
                        res.rest.success({ 'message': ' Sub Job added successfully!' });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Sub Job could not be added. ' + err.message });
                    });
            });
        },
        copy: function (req, res, next) {
            authHandler(req, res, next, function () {
                let data = Object.assign({}, req.body);
                jobModel.getSubJobs({ _id: ObjectId(data.j_id) })
                    .then(function (subJob) {
                        if (subJob.length) {
                            subJob = Object.assign({}, subJob[0]);
                            delete subJob.customer;
                            delete subJob.job;
                            delete subJob._id;
                            delete subJob.__v;
                            jobModel.saveJob(subJob, 's')
                                .then(function (response) {
                                    response = response[0];
                                    // save dispatch data
                                    const dispatchData = {
                                        'job_id': response._id,
                                        'date': data.copy_date
                                    }
                                    dispatchModel.save(dispatchData)
                                        .then(function () {
                                            res.rest.success({ 'message': 'Job copied successfully!' });
                                        })
                                        .catch(function (err) {
                                            jobModel.removeJob({ '_id': response._id }, 's');
                                            res.rest.serverError({ 'message': 'Error : Job could not be copied. ' + err.message });
                                        });
                                })
                                .catch(function (err) {
                                    res.rest.serverError({ 'message': 'Error : Job could not be copied. ' + err.message });
                                });
                        }
                    })
            });
        }
    }
}
