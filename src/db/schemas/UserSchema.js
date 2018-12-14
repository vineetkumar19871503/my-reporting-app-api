const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    users: new Schema({
        name: String,
        email: String,
        type: {type: String, default: 'employee'},
        dob: { type: Date, default: Date.now },
        password: String
    })
};


//creating models for collections
const models = {
    //roleModel: mongoose.model('roles', schemas.roles),
    userModel: mongoose.model('users', schemas.users),
    //permissionModuleModel: mongoose.model('permission_modules', schemas.permission_modules),
}

module.exports = {
    schemas,
    models
};