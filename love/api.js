var mongoose = require('mongoose');
var schema = require('./model');
var crud = require('./../crud/api')

schema.statics = {
    ...crud,
}

var model = mongoose.model('Love', schema);
module.exports = model;