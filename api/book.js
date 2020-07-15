var mongoose = require('mongoose');
var schema = require('../model/Book');
var crud = require('./crud')

schema.statics = {
    ...crud,
}

var model = mongoose.model('Book', schema);
module.exports = model;