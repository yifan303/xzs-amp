var pool = require('./pool.js')

module.exports = {
  create(params){
    return pool.query('INSERT INTO page SET ?',params)
  },
  find(params){
    return pool.query('select * from page where ?',params)
  },
  update(params){
    if(!params._id){
      return Promise.reject('请填写id')
    }
    var _id = params._id
    delete params._id
    return pool.query('UPDATE page SET ? where _id = ?',[params,_id])
  },
  short(){
    return pool.query('select name,description,author,createTime,_id,disabled from page')
  }
}
