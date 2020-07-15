var mongoose = require('mongoose');
var schema = require('../model/Author');
var crud = require('./crud')

schema.statics = {
    ...crud,
    getBook: function(query, cb) {
        this.findOne(query, cb);
    }
}

var model = mongoose.model('Author', schema);
module.exports = model;