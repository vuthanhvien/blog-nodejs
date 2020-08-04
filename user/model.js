var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    avatar: String,
    config: String,
}, {
    timestamps: true,
    versionKey: false
});