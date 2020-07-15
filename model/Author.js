var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    birthday: Date,
    description: String,
}, {
    timestamps: true
});

module.exports = schema;