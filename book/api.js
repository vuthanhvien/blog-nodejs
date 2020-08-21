var mongoose = require('mongoose');
var schema = require('./model');
var crud = require('./../crud/api')

schema.statics = {
    ...crud,
    list: async function (paging, cb) {
        // paging.query.description = paging.query.description || null;
        const limit = paging.limit || 20;
        const page = paging.page || 0;
        const offset = limit * page;
        const sortBy = paging.sortBy || 'createdAt';
        const sortType = paging.sortType || 'desc'; 
        const total = await this.countDocuments(paging.query || {})
        const list = await this.find(paging.query || {})
            .limit(+limit)
            .skip(+offset)
            .sort({ [sortBy]: sortType })
        cb(false, list, total)
    },
}

var model = mongoose.model('Book', schema);
module.exports = model;