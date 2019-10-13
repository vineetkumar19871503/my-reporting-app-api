const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    users: new Schema({
        fname: String,
        lname: String,
        full_name: String,
        email: String,
        address: String,
        type: { type: String, default: 'employee' },
        // dob: { type: Date, default: Date.now },
        password: String,
        status: { type: Boolean, default: true },
        pagePermissions: { type: Object },
        permissionsSynchronized: { type: Boolean, default: true },
        created_by: { type: Schema.Types.ObjectId },
        created_at: { type: Date },
        updated_at: { type: Date, default: Date.now }
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.users.pre('save', function (next) {
    const now = Date.now();
    this.created_at = Date.now();
    next();
});
schemas.users.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    userModel: mongoose.model('users', schemas.users)
}

module.exports = {
    schemas,
    models
};