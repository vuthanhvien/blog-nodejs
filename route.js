module.exports = function (router) {
    ['book', 'author', "category", "library", "love", "rate", "user", "comment", "chapter"].map(i => {
        const controller = require('./' + i + '/controller');
        
        router.post('/' + i, controller.create);
        router.get('/' + i, controller.list);
        router.get('/' + i +'-all' , controller.listAll);
        router.get('/' + i + '/:id', controller.detail);
        router.post('/' + i + '/:id', controller.update);
        router.delete('/' + i + '/:id', controller.remove);

    })
}