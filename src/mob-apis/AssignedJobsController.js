const authHandler = require('../handlers/AuthHandler'),
    assignedJobModel = require('../db/models/AssignedJobModel'),
    driverModel = require('../db/models/DriverModel'),
    tripModel = require('../db/models/TripModel'),
    receiptModel = require('../db/models/ReceiptModel'),
    generalUtility = require('../utilities/general'),
    truckerLocationModel = require('../db/models/TruckerLocationModel'),
    truckerSigningOffModel = require('../db/models/TruckerSigningOffModel'),
    ojectId = require('mongoose').Types.ObjectId;
bcrypt = require('bcrypt'),
    generateToken = require('../auth/generateToken'),
    jwtToken = require('../auth/jwToken')
module.exports = {
    name: 'assigned_jobs',
    get: {
        index: function(req, res, next) {
            authHandler(req, res, next, function() {
                assignedJobModel.getAssignedJobs(conditions)
                    .then(function(jobs) {
                        var response = {
                            message: 'Assigned Jobs not found!'
                        };
                        if (jobs.length) {
                            response.message = 'Assigned Jobs';
                        }
                        response.data = jobs;
                        res.rest.success(response);
                    })
                    .catch(function(err) {
                        res.rest.serverError({
                            error: err.message
                        });
                    });
            });
        },
        getAssignDetailByJobId(req, res, next) {
            let conditions = {};
            if (typeof req.query.job_id != 'undefined') {
                conditions = { 'job_id': ojectId(req.query.job_id) };
            }
            assignedJobModel.getAssignedJobs(conditions, {}, { 'time': 1 })
                .then(function(jobs) {
                    var response = {
                        message: 'No record found!'
                    };
                    if (jobs.length) {
                        response.message = 'Assigned Job';
                    }
                    response.data = jobs;
                    res.rest.success(response);
                })
                .catch(function(err) {
                    res.rest.serverError(err.message);
                });
        },
        listTrips: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                var outputTrips = [];
                var tripCount = 0;
                var endTripCount = 0;
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.driverIdRelatedTagId != "") {
                        tripModel.getTrips({ "tag_id": user_details.jobTagId })
                            .then(function(trips) {
                                trips.forEach(function(singleTrip) {
                                    tripCount++;
                                    if (singleTrip.status == '2') {
                                        endTripCount++;
                                    }
                                    var tempResponse = {
                                        "tripId": singleTrip._id,
                                        "jobId": singleTrip.job_id,
                                        "status": singleTrip.status,
                                        "loadingTimeDeparture": generalUtility.getFormatTime(singleTrip.loading_time_departure, true),
                                        "loadingTimeArrival": generalUtility.getFormatTime(singleTrip.loading_time_arrival, true),
                                        "unloadingTimeArrival": generalUtility.getFormatTime(singleTrip.unloading_time_arrival, true),
                                        "unloadingTimeDeparture": generalUtility.getFormatTime(singleTrip.unloading_time_departure, true),
                                        "isDriverReturning": singleTrip.is_driver_returning,
                                        "isDisabled": (singleTrip.status == 2) ? true : false,
                                        "tripDetail": {
                                            "loadingTimeDeparture": generalUtility.getFormatTime(singleTrip.loading_time_departure, false),
                                            "loadingTimeArrival": generalUtility.getFormatTime(singleTrip.loading_time_arrival, false),
                                            "unloadingTimeArrival": generalUtility.getFormatTime(singleTrip.unloading_time_arrival, false),
                                            "unloadingTimeDeparture": generalUtility.getFormatTime(singleTrip.unloading_time_departure, false)
                                        },

                                    }
                                    outputTrips.push(tempResponse);
                                });
                                let response = { message: 'Trips not found!' };
                                if (trips.length) {
                                    response.message = 'Trips fetched successfully.';
                                }
                                response.trips = outputTrips;
                                response.tripCount = tripCount;
                                response.endTripCount = endTripCount;
                                res.rest.success(response);
                            })
                            .catch(function(err) {
                                res.rest.serverError({ error: err.message });
                            });


                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        listReceiptTypes: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.driverIdRelatedTagId != "") {
                        outputArr = [{
                                "receiptText": "Toll Receipt"
                            },
                            {
                                "receiptText": "Service Receipt"
                            },
                            {
                                "receiptText": "Others"
                            }
                        ];
                        let response = { message: 'Receipt Types fetched successfully.' };
                        response.receiptTypes = outputArr;
                        res.rest.success(response);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        listMaterialChargeTo: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.driverIdRelatedTagId != "") {
                        outputArr = [{
                                "chargeToText": "Economy Trucking"
                            },
                            {
                                "chargeToText": "Contractor"
                            }
                        ];
                        let response = { message: 'Billers fetched successfully.' };
                        response.billersList = outputArr;
                        res.rest.success(response);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        listGeoLocations: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                var outputLocations = [];
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.jobTagId != "") {
                        truckerLocationModel.getTruckerLocations({ "tag_id": user_details.jobTagId, lat: { $ne: null }, lng: { $ne: null } })
                            .then(function(trips) {
                                trips.forEach(function(singleLocation) {
                                    var tempResponse = {
                                        "lat": singleLocation.lat,
                                        "lng": singleLocation.lng,
                                    }
                                    outputLocations.push(tempResponse);
                                });
                                let response = { message: 'Trucker locations not found!' };
                                if (trips.length) {
                                    response.message = 'Trucker locations fetched successfully.';
                                }
                                response.geoLocations = outputLocations;
                                res.rest.success(response);
                            })
                            .catch(function(err) {
                                res.rest.serverError({ error: err.message });
                            });


                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        listReceipts: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                var outputReceipts = [];
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.jobTagId != "") {
                        receiptModel.getReceipts({ "tag_id": user_details.jobTagId, "status": { $ne: false } })
                            .then(function(receipts) {
                                receipts.forEach(function(singleReceipt) {
                                    var tempResponse = {
                                        "id": singleReceipt._id,
                                        "receiptType": (singleReceipt.other_receipt_type != null) ? singleReceipt.other_receipt_type.charAt(0).toUpperCase() + singleReceipt.other_receipt_type.slice(1) : singleReceipt.receipt_type,
                                        "amount": "$" + singleReceipt.amount.toFixed('2')
                                    }
                                    outputReceipts.push(tempResponse);
                                });
                                let response = { message: 'Receipts not found!' };
                                if (receipts.length) {
                                    response.message = 'Receipts fetched successfully.';
                                }
                                response.receipts = outputReceipts;
                                res.rest.success(response);
                            })
                            .catch(function(err) {
                                res.rest.serverError({ error: err.message });
                            });


                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        getTruckerSignOff: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                var outputReceipts = [];
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.jobTagId != "") {
                        truckerSigningOffModel.getSignOffDetail({ "tag_id": user_details.jobTagId })
                            .then(function(signOffDetail) {
                                let response = { message: 'Sign Off not found!' };
                                if (signOffDetail) {
                                    response.message = 'Trucker Sign Off fetched successfully.';
                                    response.signOffDetail = {
                                        "truckerSignature": (signOffDetail.trucker_signature != "" && signOffDetail.trucker_signature != null) ? signOffDetail.trucker_signature : "",
                                        "truckerComments": (signOffDetail.trucker_comments != "" && signOffDetail.trucker_comments != null) ? signOffDetail.trucker_comments : "",
                                        "customerSignature": (signOffDetail.customer_signature != "" && signOffDetail.customer_signature != null) ? signOffDetail.customer_signature : "",
                                        "customerFeedback": (signOffDetail.customer_feedback != "" && signOffDetail.customer_feedback != null) ? signOffDetail.customer_feedback : "",
                                        "materialChargeTo": (signOffDetail.material_charges_to != "" && signOffDetail.material_charges_to != null) ? signOffDetail.material_charges_to : "",
                                        "deductedHrs": (signOffDetail.deducted_hrs != "" && signOffDetail.deducted_hrs != null) ? signOffDetail.deducted_hrs : ""
                                    };
                                    res.rest.success(response);
                                } else {
                                    res.rest.send({
                                        'message': 'Error :Sign Off could not be found!'
                                    }, 404);
                                }

                            })
                            .catch(function(err) {
                                res.rest.serverError({ error: err.message });
                            });
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
    },
    post: {
        add: function(req, res, next) {

            authHandler(req, res, next, function() {

                assignedJobModel.update({ 'dispatch_id': req.body.dispatch_id }, req.body)
                    .then(function(response) {
                        res.rest.success({
                            'message': 'Job is assigned successfully!'
                        });
                    })
                    .catch(function(err) {
                        res.rest.serverError({
                            'message': err + 'Error : Job could not be assigned!'
                        });
                    });
            });
        },
        cancelDriver: function(req, res, next) {
            authHandler(req, res, next, function() {
                let conditions = {};
                if (req.body.job_id && req.body.driver_id) {
                    conditions = {
                        'dispatch_id': req.body.job_id,
                        'drivers.driver_id': req.body.driver_id
                    };
                }
                assignedJobModel.update(conditions, { 'drivers.$.cancelled': true }, false)
                    .then(function(response) {
                        res.rest.success({
                            'message': 'Driver cancelled successfully!'
                        });
                    })
                    .catch(function(err) {
                        res.rest.serverError({
                            'message': err + 'Error : Driver could not be cancelled!'
                        });
                    });
            });
        },
        truckerLogin: function(req, res, next) {
            if (req.body.tagId != "") {
                const tagid = req.body.tagId;
                let response = { message: 'Trucker not found!', data: {}, statusvalue: 'fail' };
                assignedJobModel.getTruckersByTagid({ 'drivers.tag_id': tagid, 'drivers.tag_id_status': { $ne: 'finished' } })
                    .then(function(trucker) {
                        if (trucker.length) {
                            trucker = trucker[0];
                            //preparing response
                            response.message = "Trucker data fetched successfully";
                            response.statusvalue = "success";
                            var tagStatus = generalUtility.getTagIdStatus(tagid, trucker.drivers, function(dataStatus) {
                                response.data = {
                                    "jobDay": "Thu",
                                    "jobDate": "Oct 15,2017",
                                    "jobTime": "06:00 AM",
                                    "customerName": trucker.customer.org_name,
                                    "material": trucker.job.quarries[0].material.charAt(0).toUpperCase() + trucker.job.quarries[0].material.slice(1),
                                    "jobId": trucker.job._id,
                                    "jobTagId": tagid,
                                    "truck": trucker.driver.truck_type,
                                    "origin": trucker.job.origin.address,
                                    "destination": trucker.job.destination.address,
                                    "payRate": "$" + trucker.driver.pay_rate + "/Load",
                                    "tagIdStatus": dataStatus,
                                    "notes": trucker.job.internal_notes,
                                    "isConfirm": true,
                                    "originLat": trucker.job.origin.lat,
                                    "originLong": trucker.job.origin.lng,
                                    "destinationLat": trucker.job.destination.lat,
                                    "destinationLong": trucker.job.destination.lng
                                };
                                var tokenPayload = Object.assign({ "driverIdRelatedTagId": trucker.driver._id }, response.data);
                                var token = jwtToken.issue(tokenPayload);
                                response.token = token;
                                res.rest.success(response);
                            });

                        } else {
                            //message, data, 504, exports.gatewayTimeout
                            res.rest.send({
                                'message': 'Error :Trucker could not be found!'
                            }, 204);
                        }
                    })
                    .catch(function(err) {
                        res.rest.send({
                            'message': err + 'Error :Trucker could not be found!'
                        }, 204);
                    });
            } else {
                res.rest.send({
                    'message': 'Error :Please provide tag id'
                }, 403);
            }
        },
        setDeviceInfo: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                let conditions = {};
                var device_info = {};
                device_info['device_token'] = req.body.deviceToken;
                device_info['mac_address'] = req.body.deviceMacAddress;
                device_info['device_type'] = req.body.deviceType;
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.driverIdRelatedTagId != "") {
                        conditions = {
                            '_id': user_details.driverIdRelatedTagId,
                        };
                        driverModel.update(conditions, device_info, false)
                            .then(function(response) {
                                res.rest.success({
                                    'message': 'Device information updated successfully!'
                                });
                            })
                            .catch(function(err) {
                                res.rest.send({
                                    'message': err + 'Error : Some problem in saving information!'
                                }, 500);
                            });
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        setGeoLocation: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.jobTagId != "") {
                        var userLocation = {};
                        userLocation['trucker_id'] = user_details.driverIdRelatedTagId;
                        userLocation['tag_id'] = user_details.jobTagId;
                        userLocation['lat'] = req.body.lat;
                        userLocation['lng'] = req.body.lng;
                        truckerLocationModel.save(userLocation)
                            .then(function(response) {
                                res.rest.success({ 'message': 'Trucker location saved successfully!' });
                            })
                            .catch(function(err) {
                                res.rest.send({ 'message': 'Error : Driver could not be saved. ' + err.message }, 500);
                            });
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        createTrip: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (user_details.driverIdRelatedTagId != "") {
                        var userTrip = {};
                        userTrip['trucker_id'] = user_details.driverIdRelatedTagId;
                        userTrip['tag_id'] = user_details.jobTagId;
                        userTrip['job_id'] = user_details.jobId;
                        userTrip['status'] = req.body.status;
                        userTrip['loading_time_arrival'] = req.body.loadingTimeArrival;
                        userTrip['loading_time_departure'] = req.body.loadingTimeDeparture;
                        userTrip['unloading_time_arrival'] = req.body.unloadingTimeArrival;
                        userTrip['unloading_time_departure'] = req.body.unloadingTimeDeparture;
                        tripModel.save(userTrip)
                            .then(function(response) {
                                res.rest.success({ 'message': 'Trip saved successfully!' });
                            })
                            .catch(function(err) {
                                res.rest.send({ 'message': 'Error : Trip could not be saved. ' + err.message }, 500);
                            });
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        updateTrip: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                let conditions = {};
                var trip_info = {};
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (req.body.tripId != "") {
                        if (req.body.tripStatus) {
                            trip_info['status'] = req.body.tripStatus;
                        }
                        if (req.body.loadingTimeArrival) {
                            trip_info['loading_time_arrival'] = req.body.loadingTimeArrival;
                        }
                        if (req.body.loadingTimeDeparture) {
                            trip_info['loading_time_departure'] = req.body.loadingTimeDeparture;
                        }
                        if (req.body.unloadingTimeArrival) {
                            trip_info['unloading_time_arrival'] = req.body.unloadingTimeArrival;
                        }
                        if (req.body.unloadingTimeDeparture) {
                            trip_info['unloading_time_departure'] = req.body.unloadingTimeDeparture;
                        }
                        if (req.body.isDriverReturning) {
                            trip_info['is_driver_returning'] = req.body.isDriverReturning;
                        }


                        if (user_details.jobTagId != "") {
                            conditions = {
                                '_id': req.body.tripId,
                            };
                            tripModel.update(conditions, trip_info, false)
                                .then(function(response) {
                                    res.rest.success({
                                        'message': 'Trip status updated successfully.'
                                    });
                                })
                                .catch(function(err) {
                                    res.rest.send({
                                        'message': err + 'Error : Some problem in updating information!'
                                    }, 500);
                                });
                        }
                    } else {
                        res.rest.send({
                            'message': 'Error : Some information is missing to update trip.'
                        }, 403);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        updateTagIdStatus: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                let conditions = {};
                var assignedJobInfo = {};
                if (user_details.error == '1' || !user_details.jobTagId) {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (req.body.tagIdStatus != "") {
                        if (req.body.tagIdStatus) {
                            assignedJobInfo['drivers.$.tag_id_status'] = req.body.tagIdStatus;
                        }
                        conditions = {
                            'drivers.tag_id': user_details.jobTagId,
                        };
                        assignedJobModel.update(conditions, assignedJobInfo, false)
                            .then(function(response) {

                                driverModel.update({ '_id': user_details.driverIdRelatedTagId }, { 'job_approved': false, 'is_assigned': false }, false)
                                    .then(function(response) {
                                        res.rest.success({
                                            'message': 'Job updated successfully.'
                                        });
                                    })
                            })
                            .catch(function(err) {
                                res.rest.send({
                                    'message': err + 'Error : Some problem in updating information!'
                                }, 500);
                            });

                    } else {
                        res.rest.send({
                            'message': 'Error : Some information is missing to update job.'
                        }, 403);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        addReceipt: function(req, res, next) {

            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {
                    if (req.body.image != "" && req.body.amount != "" && req.body.receiptType != "") {
                        if (user_details.jobTagId != "") {
                            var receiptObj = {};
                            receiptObj['tag_id'] = user_details.jobTagId;
                            receiptObj['job_id'] = user_details.jobId;
                            receiptObj['image'] = req.body.image;
                            receiptObj['amount'] = req.body.amount;
                            receiptObj['receipt_type'] = req.body.receiptType;
                            if (req.body.otherReceiptType) {
                                receiptObj['other_receipt_type'] = req.body.otherReceiptType;
                            }
                            receiptModel.save(receiptObj)
                                .then(function(response) {
                                    res.rest.success({ 'message': 'Receipt saved successfully!' });
                                })
                                .catch(function(err) {
                                    res.rest.send({ 'message': 'Error : Receipt could not be saved. ' + err.message }, 500);
                                });
                        }
                    } else {
                        res.rest.send({
                            'message': 'Error : Insufficient information to add receipt.'
                        }, 403);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
        truckerSignOff: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {

                    if (req.body.truckerSignature != "" || (req.body.customerSignature != "" && req.body.materialChargeTo != "")) {
                        if (user_details.jobTagId != "") {
                            var truckerSignOffObj = {};
                            truckerSignOffObj['tag_id'] = user_details.jobTagId;
                            truckerSignOffObj['job_id'] = user_details.jobId;
                            if (req.body.truckerSignature) {
                                truckerSignOffObj['trucker_signature'] = req.body.truckerSignature;
                            }
                            if (req.body.customerSignature) {
                                truckerSignOffObj['customer_signature'] = req.body.customerSignature;
                            }
                            if (req.body.truckerComments) {
                                truckerSignOffObj['trucker_comments'] = req.body.truckerComments;
                            }
                            if (req.body.customerFeedback) {
                                truckerSignOffObj['customer_feedback'] = req.body.customerFeedback;
                            }
                            if (req.body.materialChargeTo) {
                                truckerSignOffObj['material_charges_to'] = req.body.materialChargeTo;
                            }
                            if (req.body.deductedHrs) {
                                truckerSignOffObj['deducted_hrs'] = req.body.deductedHrs;
                            }
                            var conditions = {
                                "tag_id": user_details.jobTagId,
                                "job_id": user_details.jobId
                            }
                            truckerSigningOffModel.update(conditions, truckerSignOffObj)
                                .then(function(response) {
                                    res.rest.success({ 'message': 'Trucker information uploaded successfully!' });
                                })
                                .catch(function(err) {
                                    res.rest.send({ 'message': 'Error : Trucker information could not be saved. ' + err.message }, 500);
                                });
                        }
                    } else {
                        res.rest.send({
                            'message': 'Error : Insufficient information to complete sign off.'
                        }, 403);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        },
    },

    delete: {
        deleteReceipt: function(req, res, next) {
            if (req.headers.token) {
                var token = req.headers.token;
                var user_details = jwtToken.getPayload(token);
                let conditions = {};
                var receipt_info = {};
                receipt_info['status'] = false;
                if (user_details.error == '1') {
                    res.rest.send({
                        'message': 'Error: Not a valid token'
                    }, 403);
                } else {

                    if (req.body.receiptId != "") {
                        if (user_details.jobTagId != "") {
                            conditions = {
                                '_id': req.body.receiptId,

                            };
                            receiptModel.update(conditions, receipt_info, false)
                                .then(function(response) {
                                    res.rest.success({
                                        'message': 'Receipt deleted successfully!'
                                    });
                                })
                                .catch(function(err) {
                                    res.rest.send({
                                        'message': err + 'Error : Some problem in deleting information!'
                                    }, 500);
                                });
                        }

                    } else {
                        res.rest.send({
                            'message': 'Error:Insufficient information to delete receipt.'
                        }, 403);
                    }
                }
            } else {
                res.rest.send({
                    'message': 'Error:Please provide token'
                }, 403);
            }
        }
    },

    put: {

    }
}