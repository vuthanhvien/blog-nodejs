
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/book3';

const TurndownService = require('turndown');
const turndownService = new TurndownService();


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });


const chapter = require('./chapter/api');

const getPageContent = (uri) => {
    const options = {
        uri,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        transform: (body) => {
            return cheerio.load(body)
        }
    }

    return request(options)
}
const getChapter = async (c = {}, count) => {
    try {
        var $ = await getPageContent(`${c.url}`);
        $('.doc-online h5').remove()
        $('.doc-online h3').remove()
        $('.doc-online hr').remove()
        $('.doc-online center').remove()
        $('.doc-online .btn-group ').remove()
        $('.doc-online ul ').remove()
        $('.doc-online a ').remove()
        $('.doc-online style ').remove()

        // var description = $('.doc-online').html() || '';
        var description = turndownService.turndown($('.doc-online').html());
        // description = description.replace(/<br>/gm, '\n').replace(/<(?:.|\n)*?>/gm, '');
        // description = $($.parseHTML(description)).text().trim();
        console.log(count, description.slice(0, 30), c.url);
        chapter.findByIdAndUpdate(c._id, { description: description }, (e, r) => {
         })
    }
    catch{
        (e) => {
            console.log(e)
        }
    }
}


chapter.list({ query: {description: null}, limit: 3000, page: 0 }, async (e, all) => {
    
    var step = 30;
    var start = 0;
    for (let i = start; i < all.length; i = i + step) {
        var actions = []
        for (let a = 0; a < step; a++) {
            actions.push(getChapter(all[i + a], i));
        }
      await  Promise.all(actions)
    }
})
