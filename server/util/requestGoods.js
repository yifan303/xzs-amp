// 根据skuId，获取商品信息
var request = require('request')
var config = require('./config.js')

module.exports = (data=[]) => (cb) =>{
  return request({
    url:config.requestGoodsUrl,
    json:false,
    method:'POST',
    body:JSON.stringify({
      version:1,
      data,
      appversion:'1',
      src:'node'
    })
  },(err,data,body) => {
    try{
      cb(err,JSON.parse(body))
    }catch(e){
      cb(e)
    }
  })
}
