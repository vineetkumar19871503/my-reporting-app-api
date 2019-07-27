const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    discomSchema = require('../../db/schemas/DiscomSchema'),
    discomModel = discomSchema.models.discomModel;

module.exports = {
    list: function (conditions = {}, fields = {}, order = {}) {
        const self = this;
        // return new Promise(function (resolve, reject) {
        //     var query = [
        //         {
        //             $lookup: {
        //                 from: 'consumers',
        //                 localField: 'consumer_id',
        //                 foreignField: '_id',
        //                 as: 'consumer'
        //             }
        //         },
        //         { $unwind: '$consumer' },
        //         { $match: conditions }
        //     ];

        //     if (Object.keys(fields).length) {
        //         query.push({ $project: fields });
        //     }
        //     if (Object.keys(order).length) {
        //         query.push({ $sort: order });
        //     }
        //     billModel.aggregate(query)
        //         .exec(function (err, data) {
        //             err ? reject(err) : resolve(data);
        //         });
        // });

    },
    add: function (data) {
        var newDiscomData = new discomModel(data);
        return new Promise(function (resolve, reject) {
            newDiscomData.save(function (err, document) {
                err ? reject({"message": err.message}) : resolve({"message": "Data saved successfully", "data": document});
            });
        });
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            discomModel.update({ "_id": data.id }, { $set: data }, function (err, document) {
                if (err) {
                    reject({ "message": "Error: " + err.message });
                } else {
                    let res;
                    if (document.nModified && document.nModified > 0) {
                        resolve({ "message": "Data updated successfully" });
                    } else {
                        reject({ "message": "Data was not updated" });
                    }
                }
            });
        });
    }
}
