const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    discom_wallet: new Schema({
        date: { type: Date },
        amount: { type: Number },
        card_type: { type: String },
        bank_name: { type: String },
        description: { type: String },
        created_by: { type: Schema.Types.ObjectId },
        created_at: {type: Date },
        updated_at: {type: Date }
    },
    {
        collection: 'discom_wallet'
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.discom_wallet.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.discom_wallet.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    discomWalletModel: mongoose.model('discom_wallet', schemas.discom_wallet),
}

module.exports = {
    schemas,
    models
};