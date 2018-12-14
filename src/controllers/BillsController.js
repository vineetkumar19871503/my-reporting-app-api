const authHandler = require('../handlers/AuthHandler'),
    billModel = require('../db/models/BillModel');
module.exports = {
    name: 'bills',
    post: {
        add: function(req, res, next){
            authHandler(req, res, next, function () {
                console.log(res.body);
                billModel.saveBill(req.body)
                .then(function (response) {
                    res.rest.success({ 'message': 'Bill added successfully!' });
                })
                .catch(function (err) {
                    res.rest.serverError({ 'message': 'Error : Bill could not be added. ' + err.message });
                });
            });
        }
    },
    get: {
        list: function (req, res, next) {
            authHandler(req, res, next, function () {
                let defaultConditions = { };
                billModel.getBills(defaultConditions)
                    .then(function (bills) {
                        var response = {
                            message: 'Bills not found!'
                        };
                        if (bills.length) {
                            response.message = 'Bills';
                        }
                        response.data = bills;
                        res.rest.success(response);
                    })
                    .catch(function (err) {
                        res.rest.serverError(err.message);
                    });
            });
        }
    }
}