
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
const getChapter = async (c = {}, total) => {
    console.log(count++ + ' ===>' + c.url);
    if (c.url) {
        var $ = await getPageContent(`${c.url || URL}`);
        $('.doc-online h5').remove()
        $('.doc-online h5').remove()
        $('.doc-online .btn-group ').remove()
        $('.doc-online .btn-group ').remove()
        $('.doc-online a ').remove()
        var description = $('.doc-online').text() || 'No data';
        chapter.findByIdAndUpdate(c._id, { description: description }, () => { })
    } else {
        var $ = await getPageContent('https://sachvui.com/doc-sach/bai-hoc-vo-gia-tu-dieu-binh-di-francis-xavier/chuyen-7-khat-vong-song.html');
    }
}

chapter.listAll({}, async (e, all) => {
    var step = 100;
    for (let i = 0; i < all.length; i = i + step) {
        var actions = []
        for (let a = 0; a < step; a++) {
            actions.push(getChapter(all[i + a]), all.length);
        }
        await Promise.all(actions)

    }
})



