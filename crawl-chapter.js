
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const urlDB = 'mongodb://localhost:27017/book3';


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
const getChapter = async (bookObj, end = 1) => {
    var index = 0;
    for (let i = 1; i <= end; i++) {
        var $ = await getPageContent(`${bookObj.url}/${i}`);
        var chapters = $('#list-chapter li a[target="_blank"]');
        chapters.each((e, el) => {
            var data = {
                index: +index++,
                book: bookObj._id,
                name: $(el).text(),
                url: $(el).attr('href'),
                slug: bookObj.slug + '_' + $(el).text()
            }
            chapter.createOrUpdate({ slug: data.slug }, data, (e, r) => { })
            console.log(index, data.slug)
        })


    }
}
const getBook = async (bookObj) => {
    try {
        var $ = await getPageContent(`${bookObj.url}`);

        var end = $('#list-chapter .pagination li:last-child a').data('ci-pagination-page');
        var nearEnd = $('#list-chapter  .pagination li:last-child').prev("li").find('a').data('ci-pagination-page');
        var end = nearEnd > end ? nearEnd : end;
        await getChapter(bookObj, end);
    } catch (e) {
        console.log(e)
    }
}

book.listAll({ sortBy: 'slug', sortType: 'asc' }, async (e, all) => {
    console.log('all', all.length)
    var step = 10;
    let i = 0;
    for (i = 2430; i < all.length; i = i + step) {
        var actions = []
        for (let a = 0; a < step; a++) {
            actions.push(getBook(all[i + a]));
        }
        try {
            console.log('~~~~~~' + i + '~~~~~~~')
            await Promise.all(actions)
        } catch (e) {
            console.log(e)
        }
    }
})