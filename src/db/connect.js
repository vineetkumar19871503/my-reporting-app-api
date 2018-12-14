/**
 * database connection
 */

const { db } = require('../../config'),
    mongoose = require('mongoose');
   // var MongoClient = require('mongodb').MongoClient;
module.exports = function () {
   // getting rid of "mongoose default promise library is deprecated" warning
   mongoose.Promise = global.Promise;

   // connecting to the db
    mongoose.connect(db.url, { useMongoClient: true }, function (err, db) {
        if (err) {
            console.log('Unable to connect to the server with mongoose. Please start the server. Error:', err);
        } else {
            console.log('Connected to database successfully with mongoose!');
        }
    });

}