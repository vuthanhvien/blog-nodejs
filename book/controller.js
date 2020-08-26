
var API = require('./api');
var crud = require('./../crud/controller')

module.exports = {
    ...crud(API),
    categories:  function (req, res, next){
        this.find().distinct('cagegorySlug', function(error, list) {
            res.json({
                list: list,
                success: true,
                total: 0
            })
        });
    },
}