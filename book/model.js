var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = new Schema({
    name: {
        type: String,
        unique: false,
        required: true,
    },
    search: { type: String, index: true },
    slug: String,
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    authorSlug: String,
    categorySlug: String,
    dateReleased: Date,
    description: String,
    image: String,
    rate: Number,
    banner: String,
    url: String,
    linkPDF: String,
    linkEPUB: String,
    linkMOBI: String,
    linkONLINE: String,
    linkPRC: String
}, {
    timestamps: true,
    versionKey: false
}).index({ search: 'text' });
