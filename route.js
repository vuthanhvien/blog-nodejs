
var userController = require('./user/controller');
var auth = require('./user/auth');

module.exports = function (router) {

    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.post('/sendcode', userController.sendcode);
    router.post('/forgotpassword', userController.forgotpassword);
    router.get('/profile', auth.isAuth, userController.profile);
    router.post('/profile', auth.isAuth, userController.update);
    router.post('/resetpassword', auth.isAuth, userController.resetpassword);
    router.post('/refreshtoken', auth.isAuth, userController.refreshtoken);

    ['book', 'author', "category", "library", "love", "rate", "comment", "chapter"].map(i => {
        const controller = require('./' + i + '/controller');
        router.post('/' + i, controller.create);
        router.get('/' + i, controller.list);
        router.get('/' + i + '-all', controller.listAll);
        router.get('/' + i + '/:id', controller.detail);
        router.post('/' + i + '/:id', controller.update);
        router.delete('/' + i + '/:id', controller.remove);
    })

    router.get('**', (req, res) => res.json({ msg: "404", success: false }));
    router.post('**', (req, res) => res.json({ msg: "404", success: false }));
    router.delete('**', (req, res) => res.json({ msg: "404", success: false }));
    router.put('**', (req, res) => res.json({ msg: "404", success: false }));
}

