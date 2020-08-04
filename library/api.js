var mongoose = require('mongoose');
var schema = require('./model');
var crud = require('./../crud/api')

schema.statics = {
    ...crud,
}

var model = mongoose.model('BookMark', schema);
module.exports = model;