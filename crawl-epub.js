
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio');
const EPUBToText = require('./epubToText')

const urlDB = 'mongodb://localhost:27017/book3';
 

mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const book = require('./book/api');
const chapter = require('./chapter/api');

const convertFile=(file)=>{
    var epubToText = new EPUBToText;
    epubToText.extract(file, (err, txt, n) => {
        console.log((err, txt, n))
    // txt is the plain text version of chapter number n
    })
}
 
// book.listAll({}, async (e, all) => {
book.listAll({ sortBy: 'slug', sortType: 'asc',   limit: 10}, async (e, all) => {
    var alll = all.filter(i=>i.linkEPUB);
    let i = 0;
    for (i = 0; i < alll.length; i++) {
        var item  = alll[i];
        convertFile(item.linkEPUB)
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
