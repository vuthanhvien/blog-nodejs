
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
            timeout: 2000,
        },
        transform: (body) => {
            return cheerio.load(body)
        }
    }
    return request(options)
}
const getChapter = (c = {}, count) => {
    return new Promise((resolve, reject) => {
        getPageContent(`${c.url}`).then($ => {
            $('.doc-online>h5').remove()
            $('.doc-online>h3').remove()
            $('.doc-online>hr').remove()
            $('.doc-online>center').remove()
            $('.doc-online .btn-group ').remove()
            $('.doc-online ul ').remove()
            $('.doc-online a ').remove()
            $('.doc-online style ').remove()

            var description = turndownService.turndown($('.doc-online').html());
            console.log(count, description.slice(0, 30), c.url);
            chapter.findByIdAndUpdate(c._id, { description: description }, (e, r) => {
                if(e){
                    console.log(e)
                }
            })
            resolve(true);
        }).catch(e => {
            console.log(e)
            chapter.findByIdAndUpdate(c._id, { description: 'error' }, (e, r) => {
                if(e){
                    console.log(e)
                }
            })
            reject(e)
        });

    })
}


chapter.list({ query: { description: 'error' }, limit: 5000, page: 0, orderType: 'asc' }, async (e, all) => {
    var step = 30;
    var start = 0;
    for (let i = start; i < all.length; i = i + step) {
        var actions = []
        for (let a = 0; a < step; a++) {
            actions.push(getChapter(all[i + a], i));
        }
        try {
            await Promise.all(actions)
        } catch{
            (e) => {
                console.log(e)
            }
        }
    }
})

chapter.countDocuments({ description: null }, function (err, c) {
    console.log('Count is ' + c);
});

chapter.countDocuments({ description: 'error' }, function (err, c) {
    console.log('Count error is ' + c);
});

