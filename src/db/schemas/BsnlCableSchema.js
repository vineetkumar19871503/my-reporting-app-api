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
        status: { type: String },
        source: { type: String, default: 'admin' },
        created_at: { type: Date },
        updated_at: { type: Date }
    },
        {
            collection: 'bsnl_cable'
        })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.bsnl_cable.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.bsnl_cable.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    bsnlCableModel: mongoose.model('bsnl_cable', schemas.bsnl_cable),
}

module.exports = {
    schemas,
    models
};