var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    userName: String,
    avatar: String

}, {
    timestamps: true,
    versionKey: false 
});