const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    consumerSchema = require('../../db/schemas/ConsumerSchema'),
    consumerModel = consumerSchema.models.consumerModel;

module.exports = {
    getConsumers: function (conditions = {}, fields = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            // if (Object.keys(fields).length) {
            //     query.push({ $project: fields });
            // }
            consumerModel.find(conditions)
                .exec(function (err, consumers) {
                    err ? reject(err) : resolve(consumers);
                });

        });

    },
    saveConsumer: function (data) {
        var newConsumer = new consumerModel(data);
        return new Promise(function (resolve, reject) {
            newConsumer.save(function (err, consumer) {
                err ? reject(err) : resolve(consumer);
            });
        });
    },
    delete: function(conditions) {
        return new Promise(function (resolve, reject) {
            consumerModel.remove(conditions, function (err) {
                err ? reject(err) : resolve();
            });
        });
    }
}
