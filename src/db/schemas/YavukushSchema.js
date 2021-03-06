const config = require('../../../config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//defining schemas
const schemas = {
    yavukush: new Schema({
        date: { type: Date },
        amount: { type: Number },
        card_type: { type: String },
        description: { type: String },
        entry_type: { type: String },
        created_by: { type: Schema.Types.ObjectId },
        created_at: {type: Date },
        updated_at: {type: Date }
    },
    {
        collection: 'yavukush'
    })
};

// adding pre-save/pre-update hooks for updating the created_at and updated_at dates
schemas.yavukush.pre('save', function (next) {
    const now = Date.now();
    this.date = now;
    this.created_at = now;
    next();
});
schemas.yavukush.pre('update', function () {
    this.update({}, { $set: { updated_at: new Date() } });
});


//creating models for collections
const models = {
    yavukushModel: mongoose.model('yavukush', schemas.yavukush),
}

module.exports = {
    schemas,
    models
};