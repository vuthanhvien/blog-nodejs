
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')

const URL = 'https://sachvui.com/'
const urlDB = 'mongodb://localhost:27017/book3';


mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


const category = require('./category/api')
const book = require('./book/api')
const author = require('./author/api')
 

// book.find().distinct('authorSlug', function(error, ids) {
//     // ids is an array of all ObjectIds
//     // console.log(ids)
//     // ids.map(i=>{
//     //     var authorData = {
//     //         name: i,
//     //         description: i,
//     //         slug: i,
//     //         country: "Other",
//     //     }
//     //     author.createOrUpdate({slug: authorData.slug}, authorData, ()=>{})
//     // })
// });
book.dropIndexes(function(){
    book.reIndex(function(finished){
            console.log("finished re indexing")
     })
})

// book.find((e,res)=>{
//     res.map(i=>{
//         var searchText = i.name + ' ' + change_alias(i.name) + ' ';
//         searchText += i.categorySlug + ' ' + change_alias(i.categorySlug) + ' ';
//         searchText += i.authorSlug + ' ' + change_alias(i.authorSlug) + ' ';
//         console.log(searchText);
//         book.findByIdAndUpdate(i._id, {search: searchText}, ()=>{})
//     })
// })


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
