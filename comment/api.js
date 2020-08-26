var mongoose = require('mongoose');
var schema = require('./model');
var crud = require('./../crud/api')
var bookApi = require('./../book/api')

schema.statics = {
    ...crud,
    list: async function (paging, cb) {
        paging.query.parent = paging.query.parent || null;
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
            .populate('book', 'name,image'.split(','))
            .populate('user', 'username,avatar'.split(','))
        cb(false, list, total)
    },
    create: async function (data, cb) {
        const commentList = await this.find({ book: data.book });
        var allRate = commentList.reduce((a, c) => a + c.rate, 0);
        var allComment = commentList.length;
        var newRate = (allRate + data.rate) / (allComment + 1);
        bookApi.update({ _id: data.book }, { rate: Math.round(newRate * 100) / 100 }, () => { })
        var commentData = new this(data);
        commentData.save(cb);
    },
}

var model = mongoose.model('Comment', schema);
module.exports = model;