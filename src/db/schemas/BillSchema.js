const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    bills: new Schema({
        consumer_id: { type: Schema.Types.ObjectId, required: true },
        // receipt_number: { type: String, default: ("" + Math.random()).substring(2, 13) },
        // trans_id: { type: String, default: ("" + Math.random()).substring(2, 14) },
        receipt_number: { type: String },
        trans_id: { type: String },
        amount: { type: Number },
        payment_mode: { type: String, default: 'cash' },
        paid: { type: Boolean, default: false },
        bill_submission_date: { type: Date, default: Date.now },
        added_by: { type: Schema.Types.ObjectId, required: true },
        created_at: { type: Date },
        updated_at: { type: Date }
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.bills.pre('save', function (next) {
    const now = Date.now();
    this.created_at = Date.now();
    next();
});
schemas.bills.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    billModel: mongoose.model('bills', schemas.bills),
}

module.exports = {
    schemas,
    models
};