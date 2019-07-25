const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    bsnl_cable: new Schema({
        date: { type: Date },
        customer_name: { type: String },
        father_name: { type: String },
        mobile_number: { type: String },
        address: { type: String },
        net_plan: { type: String },
        reminder_date: { type: Date },
        status: { type: String }
    })
};


//creating models for collections
const models = {
    bsnlCableModel: mongoose.model('bsnl_cable', schemas.bsnl_cable),
}

module.exports = {
    schemas,
    models
};