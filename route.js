var Book = require('./controller/book');
var Author = require('./controller/author');

module.exports = function(router) {
    router.post('/book', Book.create);
    router.get('/book', Book.list);
    router.get('/book/:id', Book.detail);
    router.post('/book/:id', Book.update);
    router.delete('/book/:id', Book.remove);



    router.post('/author', Author.create);
    router.get('/author', Author.list);
    router.get('/author/:id', Author.detail);
    router.post('/author/:id', Author.update);
    router.delete('/author/:id', Author.remove);

    router.get('/author/:id/book', Author.book);

    
}