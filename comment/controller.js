
var API = require('./api');
var crud = require('./../crud/controller')

module.exports = {
    ...crud(API),
}