const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    billSchema = require('../../db/schemas/BillSchema'),
    billModel = billSchema.models.billModel;

module.exports = {
    getBills: function (conditions = {}, fields = {}, order = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            var query = [
                {
                    $lookup: {
                        from: 'consumers',
                        localField: 'consumer_id',
                        foreignField: '_id',
                        as: 'consumer'
                    }
                },
                { $unwind: '$consumer' },
                { $match: conditions }
            ];

            if (Object.keys(fields).length) {
                query.push({ $project: fields });
            }
            if (Object.keys(order).length) {
                query.push({ $sort: order });
            }
            billModel.aggregate(query)
                .exec(function (err, data) {
                    err ? reject(err) : resolve(data);
                });
        });

    },
    saveBill: function (data) {
        data.receipt_number = ("" + Math.random()).substring(2, 13);
        data.trans_id = ("" + Math.random()).substring(2, 14);
        var newBill = new billModel(data);
        return new Promise(function (resolve, reject) {
            newBill.save(function (err, bill) {
                err ? reject(err) : resolve(bill);
            });
        });
    }
}
