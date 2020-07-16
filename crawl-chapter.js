
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/books';


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const book = require('./book/api');
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
const getChapter = async (bookObj) => {
    var $ = await getPageContent(`${bookObj.url}`);
    var index = 0;
    $('#list-chapter li').each((e, el) => {
        var data = {
            index: index++,
            book: bookObj._id,
            name: $(el).text(),
            url: $(el).find('a').attr('href'),
            slug: bookObj.slug + '_' + $(el).text()
        }
        chapter.createOrUpdate({ slug: data.slug }, data, (e, r) => {})
    })
    console.log(count ++ )
}

book.listAll({}, async (e, all) => {
    var step = 80;
    for (let i = 0; i < all.length; i = i + step) {
        var actions  = []
        for(let a = 0; a < step; a++ ){
            actions.push(getChapter(all[i + a]));
        }
        await Promise.all(actions)

    }
})



