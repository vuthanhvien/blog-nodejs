var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book' },
    name: String,
    description: String

}, {
    timestamps: true,
    versionKey: false 
});