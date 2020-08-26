var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    comment: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', },
    rate: Number,
    totalFeedBack: {type: Number, default: 0}
}, {
    timestamps: true,
    versionKey: false
});