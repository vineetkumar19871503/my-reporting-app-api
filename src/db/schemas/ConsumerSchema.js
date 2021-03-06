const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    consumers: new Schema({
        k_number: String,
        consumer_name: String,
        created_at: {type: Date },
        updated_at: {type: Date }
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.consumers.pre('save', function (next) {
    const now = Date.now();
    this.created_at = Date.now();
    next();
});
schemas.consumers.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    consumerModel: mongoose.model('consumers', schemas.consumers),
}

module.exports = {
    schemas,
    models
};