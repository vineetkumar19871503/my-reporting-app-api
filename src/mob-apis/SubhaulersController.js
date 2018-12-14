const authHandler = require('../handlers/AuthHandler'),
    subhaulerModel = require('../db/models/SubhaulerModel'),
    assignedJobModel = require('../db/models/AssignedJobModel'),
    bcrypt = require('bcrypt'),
    jwtToken = require('../auth/jwToken'),
    generalUtility = require('../utilities/general'),
    ojectId = require('mongoose').Types.ObjectId,
    driverModel = require('../db/models/DriverModel');
module.exports = {
    name: 'subhaulers',
    get: {
        index: function(req, res, next) {
            authHandler(req, res, next, function() {
                driverModel.getDrivers({ 'type': 'sh' })
                    .then(function(subhaulers) {
                        var response = {
                            message: 'Subhaulers not found!'
                        };
                        if (subhaulers.length) {
                            response.message = 'Subhaulers';
                        }
                        response.data = subhaulers;
                        res.rest.success(response);
                    })
                    .catch(function(err) {
                        res.rest.serverError({
                            error: err.message
                        });
                    });
            });
        },
        getSubhaulersByTruckType: function(req, res, next) {
            authHandler(req, res, next, function() {
                const conditions = { 'drivers.type': 'sh' };
                if (req.query.type && req.query.type != 'undefined') {
                    conditions['drivers.truck_type'] = req.query.type;
                }
                driverModel.getSubhaulers(conditions)
                    .then(function(subhaulers) {
                        let response = { message: 'Subhaulers not found!' };
                        if (subhaulers.length) {
                            response.message = 'Subhaulers';
                        }
                        response.data = subhaulers;
                        res.rest.success(response);
                    })
                    .catch(function(err) {
                        res.rest.serverError({ error: err.message });
                    });

            });
        },
        getJobsPrevious: function(req, res, next) {
            if (req.headers.token) {
                var user_details = jwtToken.getPayload(req.headers.token);
                let response = { message: 'Jobs not found!' };
                var subhaulerId = user_details.id;
                assignedJobModel.getTruckersByTagidNew({ 'driver.subhauler_id': ojectId(subhaulerId) })
                    .then(function(subhaulerData) {
                        var jobData = [];
                        if (subhaulerData.length) {
                            var job = {
                                'jobName': subhaulerData[0].job.job_name,
                                'origin': subhaulerData[0].job.origin,
                                'destination': subhaulerData[0].job.destination,
                                'material': subhaulerData[0].job.quarries[0].material.charAt(0).toUpperCase() + subhaulerData[0].job.quarries[0].material.slice(1),
                                'notes': subhaulerData[0].job.internal_notes.charAt(0).toUpperCase() + subhaulerData[0].job.internal_notes.slice(1)
                            }
                            subhaulerData[0].driver_detail.forEach(function(data, index) {
                                jobData.push({
                                    'jobId': subhaulerData[0].job._id,
                                    'jobName': job.jobName,
                                    'startTime': generalUtility.getFormatTime(data.assigned_time, true, true),
                                    'payRate': "$" + data.pay_rate + "/Load",
                                    'origin': job.origin,
                                    'destination': job.destination,
                                    'customerName': subhaulerData[0].customer.org_name,
                                    'truckType': data.truck_type,
                                    'notes': job.notes,
                                    'material': job.material,
                                    'isConfirmed': false
                                });
                            });
                            if (jobData.length) {
                                response.message = 'Jobs fetched successfully.';
                            }
                            response.todayDate = generalUtility.getDaywisetime(new Date());
                            response.jobs = jobData;
                            res.rest.success(response);
                        } else {
                            //message, data, 504, exports.gatewayTimeout
                            res.rest.send({
                                'message': 'Error :Subhauler jobs could not be found!'
                            }, 204);
                        }
                    })
                    .catch(function(err) {
                        res.rest.send({
                            'message': err + 'Error :Subhauler jobs could not be found!'
                        }, 204);
                    });
            } else {
                res.rest.send({
                    'message': 'Error :Please provide tag id'
                }, 403);
            }
        },
        getJobs: function(req, res, next) {
            if (req.headers.token) {
                var user_details = jwtToken.getPayload(req.headers.token);
                let response = { message: 'Jobs not found!' };
                var subhaulerId = user_details.id;
                assignedJobModel.getTruckersByTagidNew({ 'driver.subhauler_id': ojectId(subhaulerId) })
                    .then(function(subhaulerData) {
                        var jobData = [];
                        if (subhaulerData.length) {
                            subhaulerData.forEach(function(data, index) {
                                data.driver_detail.forEach(function(singleDriver, indexDriver) {
                                    // var driverTagId = data.driver.findIndex(function(singleDriver._id) {
                                    //     return data.driver.tag_id
                                    // });

                                    //console.log(driverTagId);

                                    // var driverObjforTagId = data.driver.find(function (driverObj) {
                                    //     //console.log(driverObj.driver_id + " " + singleDriver._id)
                                    //  if(driverObj.driver_id == singleDriver._id){
                                    //     console.log(driverObj);
                                    //  }
                                    // }
                                    // );
                                    //console.log(driverObjforTagId);


                                    // var obj = data.driver.find(function(obj) {
                                    //     console.log(obj.driver_id + "=====" + singleDriver._id)
                                    //     console.log(obj);
                                    //     if (obj.driver_id == singleDriver._id) {
                                    //         console.log("afasd");
                                    //     }
                                    //     console.log(singleDriver._id);
                                    //     return obj.driver_id == singleDriver._id;

                                    // });
                                    //console.log(obj);

                                    jobData.push({
                                        'jobId': data.job._id,
                                        'jobName': data.job.job_name,
                                        'startTime': generalUtility.getFormatTime(singleDriver.assigned_time, true, true),
                                        'payRate': "$" + singleDriver.pay_rate + "/Load",
                                        'origin': data.job.origin,
                                        'destination': data.job.destination,
                                        'customerName': data.customer.org_name,
                                        'truckType': singleDriver.truck_type,
                                        'driverId': singleDriver._id,
                                        'notes': data.job.internal_notes.charAt(0).toUpperCase() + data.job.internal_notes.slice(1),
                                        'material': data.job.quarries[0].material.charAt(0).toUpperCase() + data.job.quarries[0].material.slice(1),
                                        'isConfirmed': (data.driver[indexDriver]['tag_id'] != null) ? true : false
                                    });
                                })
                            });
                            if (jobData.length) {
                                response.message = 'Jobs fetched successfully.';
                            }
                            response.todayDate = generalUtility.getDaywisetime(new Date());
                            response.jobs = jobData;
                            res.rest.success(response);
                        } else {
                            //message, data, 504, exports.gatewayTimeout
                            res.rest.send({
                                'message': 'Error :Subhauler jobs could not be found!'
                            }, 204);
                        }
                    })
                    .catch(function(err) {
                        res.rest.send({
                            'message': err + 'Error :Subhauler jobs could not be found!'
                        }, 204);
                    });
            } else {
                res.rest.send({
                    'message': 'Error :Please provide tag id'
                }, 403);
            }
        },
    },
    post: {
        add: function(req, res, next) {
            authHandler(req, res, next, function() {
                driverModel.save(req.body)
                    .then(function(response) {
                        res.rest.success({
                            'message': 'Subhauler saved successfully!'
                        });
                    })
                    .catch(function(err) {
                        res.rest.serverError({
                            'message': 'Error : Subhauler could not be saved!!'
                        });
                    });
            });
        },

        login: function(req, res, next) {
            const username = req.body.username,
                password = req.body.password;
            var response = { message: 'Subhauler not found!' };
            subhaulerModel.getSubhauler({ 'username': username })
                .then(function(subhauler) {
                    if (subhauler.length && bcrypt.compareSync(password, subhauler[0].password)) {
                        response.message = "Subhauler fetched successfully";
                        response.statusvalue = "success";
                        var tokenPayload = {
                            "id": subhauler[0]._id,
                            "name": subhauler[0].name,
                            "username": subhauler[0].username
                        }
                        var token = jwtToken.issue(tokenPayload);
                        var user_details = jwtToken.getPayload(token);
                        response.token = token;
                        res.rest.success(response);
                    } else {
                        res.rest.send({
                            'message': 'Error: Subhauler not found!'
                        }, 404);
                    }
                })
                .catch(function(err) {
                    res.rest.serverError(err.message);
                    return next();
                });
        },
        approveDriversJob: function(req, res, next) {

            if (req.body.driverId) {

                if (req.body.driverId != "") {
                    var assignedJobInfo = {};
                    var randomMsgId = generalUtility.makeid();
                    assignedJobInfo['drivers.$.message_id'] = randomMsgId;
                    conditions = {
                        'drivers.driver_id': req.body.driverId,
                    };
                    assignedJobModel.update(conditions, assignedJobInfo, false)
                        .then(function(response) {

                            const conditions = { 'drivers.message_id': req.query.msg_id },
                                now = new Date();
                            now.setHours(now.getHours() - 2);
                            assignedJobModel.approveDriversJob({
                                    'drivers.message_id': randomMsgId,
                                    'drivers.cancelled': false,
                                    'drivers.confirmed': false,
                                   // 'drivers.assigned_time': { $gt: now }
                                }, {
                                    'dispatch.date': 1,
                                    'driver.driver_id': 1,
                                    'customer.customer_id': 1,
                                    'job.customer_id': 1,
                                    'job.pjob_id': 1,
                                    'job.subjob_id': 1
                                })
                                .then(function(data) {
                                    res.rest.success({
                                        'message': 'Job has been approved successfully!'
                                    });
                                })
                                .catch(function(err) {
                                    res.rest.serverError({
                                        'message': 'Error : Job could not be approved! ' + err.message
                                    });
                                });
                        })
                        .catch(function(err) {
                            res.rest.send({
                                'message': err + 'Error : Some problem in updating information!'
                            }, 500);
                        });

                } else {
                    res.rest.send({
                        'message': 'Error : Some information is missing to approve job.'
                    }, 403);
                }

            } else {
                res.rest.serverError({
                    'message': 'Invalid request. Please provide message id!'
                });
            }
        }
    }
}