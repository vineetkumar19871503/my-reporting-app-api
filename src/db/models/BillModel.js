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
        data.receipt_number = "191" + ("" + Math.random()).substring(2, 10);
        data.trans_id = "1901" + ("" + Math.random()).substring(2, 10);
        var newBill = new billModel(data);
        return new Promise(function (resolve, reject) {
            newBill.save(function (err, bill) {
                err ? reject(err) : resolve(bill);
            });
        });
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            billModel.update({ "_id": data._id }, { $set: data }, function (err, document) {
                if (err) {
                    reject({ "message": "Error: " + err.message });
                } else {
                    let res;
                    if (document.nModified && document.nModified > 0) {
                        resolve({ "message": "Bill updated successfully" });
                    } else {
                        reject({ "message": "Bill was not updated" });
                    }
                }
            });
        });
    }

}
