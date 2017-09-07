var pool = require('./pool.js')

module.exports = {
  create(params){
    return pool.query('INSERT INTO pit SET ?',params)
  },
  find(params){
    return pool.query('select * from pit where ?',params)
  },
  short(){
    return pool.query('select url,name,author,disabled,_id from pit')
  },
  update(params){
    if(!params._id){
      return Promise.reject('请填写id')
    }
    var _id = params._id
    delete params._id
    return pool.query('UPDATE pit SET ? where _id = ?',[params,_id])
  }
}
