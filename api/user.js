var mongoose = require('mongoose');
var schema = require('../model/User');
var crud = require('./crud')

schema.statics = {
    ...crud,
}

var model = mongoose.model('User', schema);
module.exports = model;