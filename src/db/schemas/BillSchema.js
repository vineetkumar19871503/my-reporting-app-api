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
        amount: Number,
        payment_mode: { type: String, default: 'cash' },
        bill_submission_date: { type: Date, default: Date.now },
        added_by: { type: Schema.Types.ObjectId, required: true }
    })
};


//creating models for collections
const models = {
    billModel: mongoose.model('bills', schemas.bills),
}

module.exports = {
    schemas,
    models
};