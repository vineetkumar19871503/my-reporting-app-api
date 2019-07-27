const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId
bsnlCableSchema = require('../../db/schemas/BsnlCableSchema'),
    bsnlCableModel = bsnlCableSchema.models.bsnlCableModel;

module.exports = {
    list: function (conditions = {}, fields = {}, order = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            bsnlCableModel.find(conditions)
                .sort({ "_id": -1 })
                .exec(function (err, documents) {
                    err ? reject(err) : resolve(documents);
                });
        });
    },
    add: function (data) {
        var newBsnlCableData = new bsnlCableModel(data);
        return new Promise(function (resolve, reject) {
            newBsnlCableData.save(function (err, document) {
                err ? reject({ "message": err.message }) : resolve({ "message": "Data saved successfully", "data": document });
            });
        });
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            bsnlCableModel.update({ "_id": data.id }, { $set: data }, function (err, document) {
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
