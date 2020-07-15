var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = new Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    dateReleased: Date,
    description: String,
    image: { type: String, required: true },
    rate: Number,
    banner: String
}, {
    timestamps: true,
    versionKey: false
});
