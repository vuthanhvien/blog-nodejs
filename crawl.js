
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/books';


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const category = require('./category/api')
const book = require('./book/api')
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


var i = 0;
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
const getBook = (url) => {
    getPageContent(url).then($ => {
        var name = $('.thong_tin_ebook .col-md-8 .ebook_title').text();
        var url = $('.thong_tin_ebook .col-md-8 a').attr('src');
        var authorName = $('.thong_tin_ebook .col-md-8 h5:nth-child(3)').text();

        var categoryName = $('.thong_tin_ebook .col-md-8 h5:nth-child(4)').text();
        categoryName = categoryName.substring(11)
        authorName = authorName.substring(10)
        var img = $('.thong_tin_ebook .cover img').attr('src');
        var description = $('.gioi_thieu_sach').text();

        var dataBook = {
            name: name,
            image: img,
            categorySlug: categoryName,
            authorSlug: authorName,
            slug: change_alias(name).toLowerCase().split(' ').filter(i => i).join('-'),
            rate: 0,
            description: description,
            ref: url

        }
        book.createOrUpdate({ slug: dataBook.slug }, dataBook, (i, r) => {
            console.log(i, r)
        })

    })
}
const getBooks = (url, end) => {
    for (let i = 1; i <= end; i++) {
        getPageContent(`${url}/${i}`).then($ => {
            $('.ebook').each((i, el) => {
                var bookUrl = $(el).find('a').attr('href');
                getBook(bookUrl);
            })
        })
    }
}
const getPages = (url) => {
    getPageContent(`${url}`).then($ => {
        var end = $('.pagination li:last-child a').data('ci-pagination-page');
        var nearEnd = $('.pagination li:last-child').prev("li").find('a').data('ci-pagination-page');
        var end = nearEnd > end ? nearEnd : end;
        getBooks(url, +end || 1);
    })

}

getPageContent(`${URL}`).then($ => {
    $('.cat-item').each((i, el) => {
        var url = $(el).find('a').attr('href');
        getPages(url);
    })
})



