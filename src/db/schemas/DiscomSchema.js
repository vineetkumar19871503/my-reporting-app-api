const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    discom: new Schema({
        date: { type: Date },
        amount: { type: Number },
        bulb_type: { type: String },
        sell_status: { type: String },
        quantity: { type: Number },
        card_type: { type: String },
        created_by: { type: Schema.Types.ObjectId },
        created_at: {type: Date },
        updated_at: {type: Date }
    },
    {
        collection: 'discom'
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.discom.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.discom.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    discomModel: mongoose.model('discom', schemas.discom),
}

module.exports = {
    schemas,
    models
};