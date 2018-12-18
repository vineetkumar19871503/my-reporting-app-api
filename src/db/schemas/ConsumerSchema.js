const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    consumers: new Schema({
        k_number: String,
        consumer_name: String
    })
};


//creating models for collections
const models = {
    consumerModel: mongoose.model('consumers', schemas.consumers),
}

module.exports = {
    schemas,
    models
};