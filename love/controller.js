
var API = require('./api');
var crud = require('./../crud/controller')

module.exports = {
    ...crud(API),
    create: function (req, res, next) {
        var data = {
            ...req.body,
            name: commonService.generateName()
        };
        API.create(data, function (err, r) {
            if (err) res.json(err)
            res.json({
                msg: "data created successfully",
                success: true
            })
        })
    },
}