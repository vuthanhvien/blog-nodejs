
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/book3';


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const category = require('./category/api')
const book = require('./book/api')
const author = require('./author/api')
 

book.find().distinct('authorSlug', function(error, ids) {
    // ids is an array of all ObjectIds
    console.log(ids)
    ids.map(i=>{
        var authorData = {
            name: i,
            description: i,
            slug: i,
            country: "Other",
        }
        author.createOrUpdate({slug: authorData.slug}, authorData, ()=>{})
    })
});