const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    bills: new Schema({
        k_number: String,
        receipt_number: { type: String, default: (""+Math.random()).substring(2,13) },
        consumer_name: {type: String, default: 'employee'},
        amount: Number,
        payment_mode: String,
        bill_submission_date: {type: Date, default: Date.now},
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