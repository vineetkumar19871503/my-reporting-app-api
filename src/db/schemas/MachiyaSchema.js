const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    machiya: new Schema({
        date: { type: Date },
        amount: { type: Number },
        card_type: { type: String },
        bank_name: { type: String },
        description: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date }
    },
        {
            collection: 'machiya'
        })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.machiya.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.machiya.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    machiyaModel: mongoose.model('machiya', schemas.machiya),
}

module.exports = {
    schemas,
    models
};