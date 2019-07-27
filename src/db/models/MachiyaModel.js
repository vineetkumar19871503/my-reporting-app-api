const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    machiyaSchema = require('../../db/schemas/MachiyaSchema'),
    machiyaModel = machiyaSchema.models.machiyaModel;

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
        var newMachiyaData = new machiyaModel(data);
        return new Promise(function (resolve, reject) {
            newMachiyaData.save(function (err, document) {
                err ? reject({"message": err.message}) : resolve({"message": "Data saved successfully", "data": document});
            });
        });
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            machiyaModel.update({ "_id": data.id }, { $set: data }, function (err, document) {
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
