
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')
 
const URL = 'https://sachvui.com/'
const companyCount = 3491 // Cái này là mình thấy trên trang này nó ghi vậy. =))
const pageSize = 20 // Đã test. :)
const pageCount = parseInt(companyCount / pageSize)
 
// const urlDB = 'mongodb://localhost:27017/books';
// mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});


/**
 * Get content for each page
 *
 * @param {*} uri (Ex: ${URL}page/2)
 */
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
const getBook = (url) =>{
    getPageContent(url).then($=>{
       var name =  $('.thong_tin_ebook .col-md-8 .ebook_title').text();
       var author =  $('.thong_tin_ebook .col-md-8 h5:nth-child(3)').text();
       var category =  $('.thong_tin_ebook .col-md-8 h5:nth-child(4)').text();
       var img = $('.thong_tin_ebook .cover img').attr('src');

       $('#list-chapter li').each((i, el)=>{

        var urlChapter = $(el).find('a').attr('href') ;
        var nameChapter = $(el).text() ;
        console.log(urlChapter, nameChapter)

       });


    })
}
const getBooks = (url, end) => {
    for(let i = 1;  i <= end; i++){
        getPageContent(`${url}/${i}`).then($ => {
            $('.ebook').each((i ,el)=>{
                var bookUrl = $(el).find('a').attr('href') ;
                getBook(bookUrl);
            })
        })
    }
}
const getPages = (url) => {
    // console.log(url)
    getPageContent(`${url}`).then($=>{
        var end =  $('.pagination li:last-child a').data('ci-pagination-page');
        var nearEnd =  $('.pagination li:last-child').prev("li").find('a').data('ci-pagination-page');
        var end = nearEnd > end ? nearEnd : end;
        getBooks(url, +end || 1);
    })
   
}
 
getPageContent(`${URL}`).then($ => {
    $('.cat-item').each((i ,el)=>{
        var url = $(el).find('a').attr('href');
        getPages(url);
    })
})
 
