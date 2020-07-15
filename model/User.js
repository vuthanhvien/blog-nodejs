var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name :{
        type: String,
        unique : false,
        required : true
    },
    description : {
        type: String,
        unique : false,
    }
}, {
    timestamps: true
});

module.exports = schema;