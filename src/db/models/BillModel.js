const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    billSchema = require('../../db/schemas/BillSchema'),
    billModel = billSchema.models.billModel;

module.exports = {
    getBills: function (conditions = {}, fields = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            // if (Object.keys(fields).length) {
            //     query.push({ $project: fields });
            // }
            billModel.find(conditions)
                .exec(function (err, bills) {
                    err ? reject(err) : resolve(bills);
                });

        });

    },
    saveBill: function (data) {
        var newBill = new billModel(data);
        return new Promise(function (resolve, reject) {
            newBill.save(function (err, bill) {
                err ? reject(err) : resolve(bill);
            });
        });
    }
}
