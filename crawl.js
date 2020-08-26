
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/book3';


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


// const getBook = async (url) => {
//     var $ = await getPageContent(url);

//     var name = $('.thong_tin_ebook .col-md-8 .ebook_title').text();
//     var authorName = $('.thong_tin_ebook .col-md-8 h5:nth-child(3)').text();

//     var categoryName = $('.thong_tin_ebook .col-md-8 h5:nth-child(4)').text();
//     categoryName = categoryName.substring(11)
//     authorName = authorName.substring(10)
//     var img = $('.thong_tin_ebook .cover img').attr('src');
//     var description = $('.gioi_thieu_sach').html().replace(/<br>/gm, '\n').replace(/<(?:.|\n)*?>/gm, '')

//     var dataBook = {
//         name: name,
//         image: img,
//         categorySlug: categoryName,
//         authorSlug: authorName,
//         slug: change_alias(name).toLowerCase().split(' ').filter(i => i).join('-'),
//         description: $($.parseHTML(description)).text(),
//         url: url,
//         rate: 4,
//     }
//     console.log(i++, dataBook.slug)
//     book.createOrUpdate({ slug: dataBook.slug }, dataBook, (e, r) => { })
// }
var a = 0;
const getBooks = async (url, end) => {
    for (let i = 1; i <= end; i++) {
        var $ = await getPageContent(`${url}/${i}`);
        $('.ebook').each(async (_i, el) => {
            var bookUrl = $(el).find('a').attr('href');
            var name = $(el).find('h5').text();
           var dataBook = {
                name:name,
                url: bookUrl,
                slug: change_alias(name).toLowerCase().split(' ').filter(i => i).join('-'),
            };
            console.log(a++, dataBook.slug)
            book.createOrUpdate({ slug: dataBook.slug }, dataBook, (e, r) => { })
        })
    }
}
const getCate = async (url) => {
    var $ = await getPageContent(`${url}`)
    var end = $('.pagination li:last-child a').data('ci-pagination-page');
    var nearEnd = $('.pagination li:last-child').prev("li").find('a').data('ci-pagination-page');
    var end = nearEnd > end ? nearEnd : end;
    console.log('url ======>', url)
    await  getBooks(url, +end || 1);
}

getPageContent(`${URL}`).then(async ($) => {

    var cates = [];

    $('.cat-item').each((i, el) => {
        var url = $(el).find('a').attr('href');
        cates.push(url);
        var categoryData = {
                "name":  $(el).find('a').text(),
                "description":  $(el).find('a').text(),
                "image": "",
                "banner": "",
                "slug": $(el).find('a').text(),
                "totalBook": 1000,
                "totalAuthor": 100
        }
        category.createOrUpdate({slug: categoryData.slug}, categoryData, (e, r) => { })

    })
    for (let i = 0; i < cates.length; i++) {
        getCate(cates[i]);
    }
})

