var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    description: String,
    image: String,
    banner: String,
    slug: String
}, {
    timestamps: true,
    versionKey: false 
});
