module.exports = {
    create: function (data, cb) {
        new this(data).save(cb);
    },

    list: async function (paging, cb) {
        const limit = paging.limit || 20;
        const page = paging.page || 0;
        const offset = limit * page;
        const sortBy = paging.sortBy || 'createdAt';
        const sortType = paging.sortType || 'desc';
        const total = await this.count()
        const list = await this.find({}).limit(+limit).skip(+offset).sort({ [sortBy]: sortType });

        cb(false, list, total)
    },

    detail: function (query, cb) {
        this.findOne(query, cb);
    },

    update: function (query, updateData, cb) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true }, cb);
    },

    delete: function (query, cb) {
        this.findOneAndDelete(query, cb);
    }
};