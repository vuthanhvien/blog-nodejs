module.exports = {
    create: function (data, cb) {
        new this(data).save(cb);
    },
    createOrUpdate: function (query, updateData, cb) {
        this.updateOne(query, { $set: updateData  }, { upsert: true,  new: true }, cb);
    },

    list: async function (paging, cb) {
        const limit = paging.limit || 20;
        const page = paging.page || 0;
        const offset = limit * page;
        const sortBy = paging.sortBy || 'createdAt';
        const sortType = paging.sortType || 'desc';
        const total = await this.countDocuments()
        const list = await this.find(paging.query || {})
            .limit(+limit)
            .skip(+offset)
            .sort({ [sortBy]: sortType })
            // .populate('book', 'name')
            // .populate('author', 'name')
            // .populate('category', 'name')
        cb(false, list, total)
    },
    listAll: function (paging, cb) {
        const sortBy = paging.sortBy || 'createdAt';
        const sortType = paging.sortType || 'desc';
        console.log('paging.query',paging.query)
        this.find(paging.query || {}, cb).sort({ [sortBy]: sortType })
    },

    detail: function (query, cb) {
        this.findOne(query, cb);
    },

    update: function (query, updateData, cb) {
        this.findOneAndUpdate(query,   updateData , {  new: true}, cb);
    },

    delete: function (query, cb) {
        this.findOneAndDelete(query, cb);
    }
};