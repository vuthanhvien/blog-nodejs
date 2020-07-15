var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    book: { type: Schema.Types.ObjectId, ref: 'Book' },
    comment: String,
}, {
    timestamps: true,
    versionKey: false 
});