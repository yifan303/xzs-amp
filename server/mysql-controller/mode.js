var pool = require('./pool.js')

module.exports = {
  create(params){
    return pool.query('insert into mode SET ?',params)
  },
  find(params){
    return pool.query('select * from mode where ?',params)
  },
  short(){
    return pool.query('select url,name,author,disabled,_id from mode')
  },
  update(params){
    if(!params._id){
      return Promise.reject('请填写id')
    }
    var _id = params._id
    delete params._id
    return pool.query('UPDATE mode SET ? where _id = ?',[params,_id])
  }
}
