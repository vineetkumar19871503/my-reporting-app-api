const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    high_court: new Schema({
        date: { type: Date },
        amount: { type: Number },
        card_type: { type: String },
        created_at: {type: Date },
        updated_at: {type: Date }
    },
    {
        collection: 'high_court'
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.high_court.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.high_court.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    highCourtModel: mongoose.model('high_court', schemas.high_court),
}

module.exports = {
    schemas,
    models
};