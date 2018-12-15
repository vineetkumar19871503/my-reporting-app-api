const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    users: new Schema({
        name: String,
        email: String,
        type: { type: String, default: 'employee' },
        dob: { type: Date, default: Date.now },
        password: String,
        status: { type: Boolean, default: true }
    })
};


//creating models for collections
const models = {
    userModel: mongoose.model('users', schemas.users)
}

module.exports = {
    schemas,
    models
};