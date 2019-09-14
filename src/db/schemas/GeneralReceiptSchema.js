const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    generalReceipt: new Schema({
        date: { type: Date },
        name: { type: String },
        mobile: { type: String },
        card_type: { type: String },
        amount: { type: Number },
        description: { type: String },
        receipt_number: { type: String },
        bill_submission_date: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId }
    },
        {
            collection: 'general_receipts'
        })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.generalReceipt.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.generalReceipt.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    generalReceiptModel: mongoose.model('general_receipts', schemas.generalReceipt),
}

module.exports = {
    schemas,
    models
};