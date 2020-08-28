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
        const total = await this.countDocuments(paging.query || {})
        var fields = (paging.fields + '').split(',').join(' ');
        const list = await this.find(paging.query || {}, paging.fields ?  fields : '')
            .limit(+limit)
            .skip(+offset)
            .sort({ [sortBy]: sortType })
            
        cb(false, list, total)
    },
    listAll: function (paging, cb) {
        const sortBy = paging.sortBy || 'createdAt';
        const sortType = paging.sortType || 'desc';
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