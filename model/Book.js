var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Author = require('./Author');

var bookSchema = new Schema({
    slug: {
        type: String,
        unique: true,
        required : true
    },
    name :{
        type: String,
        unique : false,
        required : true
    },
    author: Author,
    description : {
        type: String,
        unique : false,
    }
}, {
    timestamps: true
});

module.exports = bookSchema;