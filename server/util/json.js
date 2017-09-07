// 转换page表的数据
var _ = require('underscore')
var page = {
  toDb(body){
    body = Object.assign({},body)

    if(!_.isArray(body.list)){
      body.list = _.toArray(body.list)
    }

    body.list = JSON.stringify(body.list)
    body.globalStyle = JSON.stringify(body.globalStyle)
    var disabled = parseInt(body.disabled)
    body.disabled = disabled===disabled?disabled:1
    return body
  },
  toFront(list){
    for(var i=0;i<list.length;i++){
      list[i].list = JSON.parse(list[i].list)
      list[i].globalStyle = JSON.parse(list[i].globalStyle)
    }
    return list
  }
}
module.exports = {
  page
}
