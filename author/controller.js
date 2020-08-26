
var API = require('./api');
var crud = require('./../crud/controller')

var commonService  = require('./../util/common')

module.exports = {
    ...crud(API),
}