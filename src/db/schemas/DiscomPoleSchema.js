const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    discom_pole: new Schema({
        date: { type: Date },
        number_of_poles: { type: Number },
        address: { type: String },
        an_jn_office: { type: String },
        staywire: { type: String },
        created_at: {type: Date },
        updated_at: {type: Date }
    },
    {
        collection: 'discom_pole'
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.discom_pole.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.discom_pole.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});

//creating models for collections
const models = {
    discomPoleModel: mongoose.model('discom_pole', schemas.discom_pole),
}

module.exports = {
    schemas,
    models
};