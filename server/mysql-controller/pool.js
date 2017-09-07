var mysql = require('mysql');
var config = require('../util/config.js')
var pool  = mysql.createPool(Object.assign({},config.mysql,{
  connectionLimit : 8
}));
var thunkify = require('thunkify')

module.exports = {
  query:thunkify(pool.query).bind(pool)
}
