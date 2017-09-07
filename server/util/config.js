// 环境配置

var isProd = process.env.NODE_ENV==='production'
var isQa = process.env.NODE_ENV==='qa'

var mysql = {
  host            : 'localhost',
  user            : 'root',
  password        : '123456',
  database        : 'activity'
}
var dist = 'resource'

var port = 8005

// 获取商品信息url
var requestGoodsUrl = 'http://item.xianzaishi.net/wapcenter/requesthome/activitypageinfo'

if(isQa){
  mysql = {
    host:'10.10.0.6',
    port:3306,
    user : 'root',
    password : 'xzs16888',
    database : 'activity'
  }
  port = 8007
}

if(isProd){
  // 线上环境配置
  requestGoodsUrl = 'http://item.xianzaishi.com/requesthome/activitypageinfo'
  mysql = {
    host:'rm-uf6448xs2f13o8v32.mysql.rds.aliyuncs.com',
    port:3306,
    user : 'activity',
    password : 'activIty1618_h',
    database : 'activity'
  }
}
module.exports = {
  mysql,dist,requestGoodsUrl,port,front:9003,isProd
}
