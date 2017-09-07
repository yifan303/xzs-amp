var pool = require('./pool.js')

module.exports = {
  create(params){
    return pool.query('INSERT INTO image SET ?',params)
  },
  all(params){
    return pool.query('select * from image order by createTime desc')
  }
}
