const bcrypt = require('bcrypt'),
    config = require('../../../config'),
    userSchema = require('../../db/schemas/UserSchema'),
    userModel = userSchema.models.userModel;

module.exports = {
    getUsers: function (conditions = {}, fields = {}) {
        const self = this;
        return new Promise(function (resolve, reject) {
            // if (Object.keys(fields).length) {
            //     query.push({ $project: fields });
            // }
            userModel.find(conditions)
                .exec(function (err, users) {
                    err ? reject(err) : resolve(users);
                });

        });

    },
    saveUser: function (data) {
        var newUser = new userModel(data);
        newUser.password = bcrypt.hashSync(data.password, config.bcryptSalt);
        newUser.full_name = data.fname + " " + data.lname;
        return new Promise(function (resolve, reject) {
            newUser.save(function (err, user) {
                err ? reject(err) : resolve(user);
            });
        });
    },
    updateUser: function (data) {
        return new Promise(function (resolve, reject) {
            userModel.update({ '_id': data.uid }, { $set: data })
                .then(function (res) {
                    resolve(res)
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}