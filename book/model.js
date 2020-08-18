var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = new Schema({
    name: {
        type: String,
        unique: false,
        required: true,
        index: true 
    },
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
    linkMOBI: String
}, {
    timestamps: true,
    versionKey: false
}).index({name: 'text'});
