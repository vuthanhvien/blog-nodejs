
const mongoose = require('mongoose')
const request = require('request-promise')
const cheerio = require('cheerio')
 
const URL = 'https://sachvui.com/'
const companyCount = 3491 // Cái này là mình thấy trên trang này nó ghi vậy. =))
const pageSize = 20 // Đã test. :)
const pageCount = parseInt(companyCount / pageSize)
 
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
       var name =  $('.ebook_title').text();
       var author =  $('.ebook_title').text();

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
        // console.log(`name > `, $(el).text() );
        // console.log(`url > `, $(el).find('a').attr('href') );
        var url = $(el).find('a').attr('href');
        getPages(url);
    })
})
 
