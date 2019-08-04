const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    machiyaSchema = require('../../db/schemas/MachiyaSchema'),
    machiyaModel = machiyaSchema.models.machiyaModel;

module.exports = {
    list: function (conditions = {}, fields = {}, order = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            machiyaModel.find(conditions)
                .sort({ "_id": -1 })
                .exec(function (err, documents) {
                    err ? reject(err) : resolve(documents);
                });
        });
    },
    add: function (data) {
        var newMachiyaData = new machiyaModel(data);
        return new Promise(function (resolve, reject) {
            newMachiyaData.save(function (err, document) {
                err ? reject({ "message": err.message }) : resolve({ "message": "Data saved successfully", "data": document });
            });
        });
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            machiyaModel.update({ "_id": data._id }, { $set: data }, function (err, document) {
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
