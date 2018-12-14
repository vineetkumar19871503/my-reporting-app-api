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
        return new Promise(function (resolve, reject) {
            newUser.save(function (err, user) {
                err ? reject(err) : resolve(user);
            });
        });
    }
}