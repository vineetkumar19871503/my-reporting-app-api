const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    generalReceiptSchema = require('../../db/schemas/GeneralReceiptSchema'),
    generalReceiptModel = generalReceiptSchema.models.generalReceiptModel;

module.exports = {
    list: function (conditions = {}, fields = {}, order = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            generalReceiptModel.find(conditions)
                .sort({ "_id": -1 })
                .exec(function (err, documents) {
                    err ? reject(err) : resolve(documents);
                });
        });
    },
    add: function (data) {
        // data.receipt_number = "191" + ("" + Math.random()).substring(2, 10);
        data.receipt_number = ("" + Math.random()).substring(2, 14)
        var newGeneralReceiptData = new generalReceiptModel(data);
        return new Promise(function (resolve, reject) {
            newGeneralReceiptData.save(function (err, document) {
                err ? reject({ "message": err.message }) : resolve({ "message": "Data saved successfully", "data": document });
            });
        });
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            generalReceiptModel.update({ "_id": data._id }, { $set: data }, function (err, document) {
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
