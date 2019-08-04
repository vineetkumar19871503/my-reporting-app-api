const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    bsnl_connection: new Schema({
        date: { type: Date },
        customer_name: { type: String },
        father_name: { type: String },
        mobile_number: { type: String },
        address: { type: String },
        net_plan: { type: String },
        reminder_date: { type: Date },
        status: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date }
    },
    {
        collection: 'bsnl_connection'
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.bsnl_connection.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.bsnl_connection.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    bsnlConnectionModel: mongoose.model('bsnl_connection', schemas.bsnl_connection),
}

module.exports = {
    schemas,
    models
};