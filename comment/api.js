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
    // list: async function (paging, cb) {
    //     try {
    //         paging.query.parent = paging.query.parent || null;
    //         const limit = paging.limit || 500;
    //         const page = paging.page || 0;
    //         const offset = limit * page;
    //         const sortBy = paging.sortBy || 'createdAt';
    //         const sortType = paging.sortType || 'desc';
    //         const total = await this.countDocuments(paging.query || {})
    //         // const list = await this.find(paging.query || {})
    //         //     .limit(+limit)
    //         //     .skip(+offset)
    //         //     .sort({ [sortBy]: sortType })
    //         //     .populate('book', 'name,image'.split(','))
    //         //     .populate('user', 'username,avatar'.split(','))
    //         // cb(false, list, total)
    //         if (paging.query.book) {
    //             paging.query.book = new mongoose.Types.ObjectId(paging.query.book)
    //         }
    //         if (paging.query.parent) {
    //             paging.query.parent = new mongoose.Types.ObjectId(paging.query.parent)
    //         }
    //         this.aggregate([
    //             {
    //                 $match: paging.query
    //             },
    //             {
    //                 $lookup: {
    //                     localField: "_id",
    //                     from: "comments", foreignField: "parent",
    //                     as: "childs"
    //                 },
    //             },

    //             {
    //                 $lookup: {
    //                     localField: "book",
    //                     from: "books", foreignField: "_id",
    //                     as: "book"
    //                 },
    //             },
    //             { "$project": { 
    //                 "fullName": 1, 
    //                 "country": 1, 
    //                 "countryInfo": { "$arrayElemAt": [ "$countryInfo", 0 ] } 
    //             }} ,
    //             {
    //                 $lookup: {
    //                     localField: "user",
    //                     from: "users", foreignField: "_id",
    //                     as: "user"
    //                 },
    //             },
    //             {
    //                 $sort: {
    //                     [sortBy]: sortType == 'asc' ? 1 : -1
    //                 }
    //             },
    //             {
    //                 $skip: +offset
    //             },
    //             {
    //                 $limit: limit
    //             },

    //         ]).exec(function (err, list) {
    //             if (err) {
    //                 next(err);
    //             }
    //             cb(false, list, total)
    //         })
    //     } catch{
    //         () => {
    //             cb(true, [], 0)

    //         }
    //     }
    // },
    create: async function (data, cb) {
        const commentList = await this.find({ book: data.book, parent: null });
        var allRate = commentList.reduce((a, c) => a + c.rate, 0);
        var allComment = commentList.length;
        var newRate = (allRate + data.rate) / (allComment + 1);
        bookApi.update({ _id: data.book }, { rate: Math.round(newRate * 100) / 100 }, () => { });
        if(data.parent){
            const commentListChild = await this.countDocuments({ parent: data.parent });
            console.log(commentListChild)
            this.update({ _id: data.parent }, { totalFeedBack: commentListChild + 1 }, (e,r) => {
                console.log(e, r)
             });
        }

        var commentData = new this(data);
        commentData.save(cb);
    },
}

var model = mongoose.model('Comment', schema);
module.exports = model;