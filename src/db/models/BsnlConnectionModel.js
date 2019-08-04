const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId
bsnlConnectionSchema = require('../../db/schemas/BsnlConnectionSchema'),
    bsnlConnectionModel = bsnlConnectionSchema.models.bsnlConnectionModel;

module.exports = {
    add: function (data) {
        var newBsnlConnectionData = new bsnlConnectionModel(data);
        return new Promise(function (resolve, reject) {
            newBsnlConnectionData.save(function (err, document) {
                err ? reject({ "message": err.message }) : resolve({ "message": "Data saved successfully", "data": document });
            });
        });
    }
}
