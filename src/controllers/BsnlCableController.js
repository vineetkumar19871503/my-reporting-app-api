const authHandler = require('../handlers/AuthHandler'),
    bsnlCableModel = require('../db/models/BsnlCableModel');

module.exports = {
    name: 'bsnlcable',
    post: {
        add: function (req, res, next) {
            authHandler(req, res, next, function () {
                bsnlCableModel.add(req.body)
                    .then(function (response) {
                        response = JSON.parse(JSON.stringify(response));
                        res.rest.success({ 'message': 'Record saved successfully!', 'data': response });
                    })
                    .catch(function (err) {
                        res.rest.serverError({ 'message': 'Error : Data could not be saved. ' + err.message });
                    });
            });
        }
    },
    get: {
        list: function (req, res, next) {
            authHandler(req, res, next, function () {
                // let defaultConditions = {};
                // const q = req.query;
                // if (q && Object.keys(q).length) {
                //     if (q.k_number) {
                //         defaultConditions["consumer.k_number"] = { '$regex': new RegExp(q.k_number, 'i') };
                //     }
                //     if (q.startDate) {
                //         let startDate = new Date(q.startDate);
                //         startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                //         defaultConditions.bill_submission_date = { '$gte': startDate };
                //     }
                //     if (q.endDate) {
                //         let endDate = new Date(q.endDate);
                //         endDate.setDate(endDate.getDate() + 1);
                //         endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                //         if (defaultConditions.bill_submission_date) {
                //             if (Object.keys(defaultConditions.bill_submission_date).length) {
                //                 defaultConditions.bill_submission_date.$lt = endDate;
                //             } else {
                //                 defaultConditions.bill_submission_date = { '$lt': endDate };
                //             }
                //         }
                //     }
                // }
                // billModel.getBills(defaultConditions)
                //     .then(function (bills) {
                //         var response = {
                //             message: 'Bills not found!'
                //         };
                //         if (bills.length) {
                //             response.message = 'Bills';
                //         }
                //         response.data = bills;
                //         res.rest.success(response);
                //     })
                //     .catch(function (err) {
                //         res.rest.serverError(err.message);
                //     });
            });
        }
    }
}