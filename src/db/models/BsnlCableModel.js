const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    bsnlCableSchema = require('../../db/schemas/BsnlCableSchema'),
    bsnlCableModel = bsnlCableSchema.models.bsnlCableModel;

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
        var newBsnlCableData = new bsnlCableModel(data);
        return new Promise(function (resolve, reject) {
            newBsnlCableData.save(function (err, document) {
                err ? reject(err) : resolve(document);
            });
        });
    }
}
