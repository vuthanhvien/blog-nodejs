var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', index: true },
    name: String,
    url: String,
    description: String,
    slug: String,
    index: Number

}, {
    timestamps: true,
    versionKey: false 
});
