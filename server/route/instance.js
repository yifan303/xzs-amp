var router=require('koa-router')()
var loginToken=require('../util/loginToken.js')
var format = require('../util/format.js')

router.post('/api/login.json',function *(next){
  var {body} = this.request
  try{
    var res = yield loginToken(body,process.env.NODE_ENV!=='development')
    var resBody = JSON.parse(res[1])
    if(resBody.success){
      this.session.user=resBody.module
    }
    this.body=res[1]
  }catch(e){
    this.body=format(e.toString())
  }
})
router.post('/api/logout.json',function *(next){
  this.session.user = null
  this.body = format(null,'登出成功')
})
router.get('/api/getUser.json',function *(next){
  this.body = format(null,this.session.user)
})
module.exports=router
