var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    birthday: Date,
    description: String,
    image: String,
    country: String,
    tag: String
}, {
    timestamps: true,
    versionKey: false 
});

module.exports = schema;