
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/books';


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const chapter = require('./chapter/api');

const getPageContent = (uri) => {
    const options = {
        uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        transform: (body) => {
            return cheerio.load(body)
        }
    }

    return request(options)
}
var count = 0;
const getChapter = async (c) => {
    if(c && c.url){
        var $ = await getPageContent(`${c.url}`);
        var description = $('.doc-online').text();
        console.log(count++ + '===>'+c.url);
        chapter.findByIdAndUpdate(c._id, {description: description}, ()=>{})
    }
}

chapter.listAll({limit: 5000, page: 0}, async (e, all) => {
    var step = 100;
    for (let i = 0; i < all.length; i = i + step) {
        var actions  = []
        for(let a = 0; a < step; a++ ){
            actions.push(getChapter(all[i + a]));
        }
        await Promise.all(actions)

    }
})



