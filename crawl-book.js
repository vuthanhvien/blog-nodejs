
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
const getBook = async (bookObj, count) => {
    try {
        var $ = await getPageContent(`${bookObj.url}`);

        var name = $('.thong_tin_ebook .col-md-8 .ebook_title').text();
        var authorName = $('.thong_tin_ebook .col-md-8 h5:nth-child(3)').text();

        var categoryName = $('.thong_tin_ebook .col-md-8 h5:nth-child(4)').text();
        categoryName = categoryName.substring(11)
        authorName = authorName.substring(10)
        var img = $('.thong_tin_ebook .cover img').attr('src');
        var description = $('.gioi_thieu_sach').html().replace(/<br>/gm, '\n').replace(/<(?:.|\n)*?>/gm, '');

        var dataBook = {
            name: name,
            image: img,
            categorySlug: categoryName,
            authorSlug: authorName,
            slug: change_alias(name).toLowerCase().split(' ').filter(i => i).join('-'),
            description: $($.parseHTML(description)).text(),
            url: bookObj.url,
            rate: 4,
            linkPRC: $('.thong_tin_ebook .btn-info').attr('href'),
            linkPDF: $('.thong_tin_ebook .btn-danger').attr('href'),
            linkEPUB: $('.thong_tin_ebook .btn-primary').attr('href'),
            linkMOBI: $('.thong_tin_ebook .btn-success').attr('href'),
            linkONLINE: $('.thong_tin_ebook .btn-warning').attr('href'),
        }
        console.log(count, dataBook.slug)
        book.createOrUpdate({ slug: dataBook.slug }, dataBook, (e, r) => { })
    } catch (e) {
        console.log(e)
    }
}

// book.listAll({}, async (e, all) => {
book.listAll({ sortBy: 'slug', sortType: 'asc' }, async (e, all) => {
    console.log('all', all.length)
    var step = 25;
    let i = 0;
    for (i = 3575; i < all.length; i = i + step) {
        var actions = []
        for (let a = 0; a < step; a++) {
            actions.push(getBook(all[i + a], i ));
        }
        try {
            await Promise.all(actions)
        } catch (e) {
            console.log(e)
        }
    }
})


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
