
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'http://truyentranhtuan.com/'
const urlDB = 'mongodb://localhost:27017/book3s';


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const category = require('./category/api')
const bookAPI = require('./book/api')
const author = require('./author/api')

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}


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
var i = 0;

var count = 0;
 
const getBook = async (c = {}, total) => {
    console.log(count++ + ' ===>' + c.url);
    if (c.url) {
        var $ = await getPageContent(`${c.url || URL}`);
        const data ={
            name: $('#infor-box h1'),
            image: $('.manga-cover img').attr('src'),
            categorySlug:  $('.misc-infor:nth-child(3)').text(),
            authorSlug: $('.misc-infor:nth-child(2)').text(),
            slug: change_alias(name).toLowerCase().split(' ').filter(i => i).join('-'),
            rate: 0,
            description: $('#manga-summary p').text(),
        }
        bookAPI.findByIdAndUpdate(c._id, data , () => { })
    } else {
        var $ = await getPageContent('https://sachvui.com/doc-sach/bai-hoc-vo-gia-tu-dieu-binh-di-francis-xavier/chuyen-7-khat-vong-song.html');
    }
}
bookAPI.listAll({}, async (res, all) => {
    var step = 100;
    for (let i = 0; i < all.length; i = i + step) {
        var actions = []
        for (let a = 0; a < step; a++) {
            actions.push(getBook(all[i + a]), all.length);
        }
        await Promise.all(actions)

    }
});




