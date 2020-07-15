// var Book = require('./book/controller');
// var Author = require('./author/controller');
// var Category = require('./category/controller');
// var Library = require('./library/controller');
// var Love = require('./love/controller');
// var Rate = require('./rate/controller');
// var User = require('./user/controller');
// var Comment = require('./comment/controller');


module.exports = function (router) {
    ['book', 'author', "category", "library", "love", "rate", "user", "comment"].map(i => {
        const controller = require('./' + i + '/controller');
        
        router.post('/' + i, controller.create);
        router.get('/' + i, controller.list);
        router.get('/' + i +'_all' , controller.listAll);
        router.get('/' + i + '/:id', controller.detail);
        router.post('/' + i + '/:id', controller.update);
        router.delete('/' + i + '/:id', controller.remove);

    })
}