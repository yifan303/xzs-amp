var router = require('./instance.js')
var path = require('path')
var format = require('../util/format.js')
var thunkLess = require('../util/thunkLess.js')
var modeController = require('../mysql-controller/mode.js')
var _ = require('underscore')
var requestGoods = require('../util/requestGoods.js')

// 创建坑位
router.post('/api/mode/create.json',function *(next){
  try{
    var body = this.request.body
    var search = yield modeController.find({name:body.name})
    if(search[0].length>0){
      return this.body = format('有重名的模块')
    }
    if(this.session.user){
      body.author = this.session.user.name
    }

    var result = yield modeController.create(body)
    return this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})

// 更新模块
router.post('/api/mode/update.json',function *(next){
  try{
    var body = this.request.body
    if(!this.session.user){
      return this.body = format('没有用户信息，请重新登陆')
    }
    var modes = yield modeController.find({_id:body._id})

    if(modes[0].length > 0){
      var mode = modes[0][0]
      if(mode.author!==this.session.user.name){
        return this.body = format('你不是该模块的创建者，不能修改该模块')
      }
      var result = yield modeController.update(body)
      this.body = format(null,result[0])
    }else{
      this.body = format('找不到相应模块')
    }
  }catch(e){
    this.body = format(e)
  }
})

// 根据模块id和数据  获取生成的html
router.get('/api/mode/html.json',function *(next){
  try{
    var {_id,param,param1} = this.request.query
    var result = yield modeController.find({_id})
    if(result[0].length>0){
      result = result[0]
      var wrapName=`m${+new Date}`
      var outputLess = yield thunkLess(`.${wrapName}{${result[0].css}}`)
      var html = _.template(`<div class="${wrapName}">${result[0].html}</div>`)({param,param1})
      var js = `<script>(function(param,param1){ ${result[0].js} })('${param}','${param1||''}')</script>`
      this.body=format(null,`<style>${outputLess.css}</style>${html}${js}`)
    }else{
      this.body = format('模块ID有误')
    }
  }catch(e){
    this.body = format(`模块添加有误，错误为：${e.toString()}，请检查模块代码`)
  }
})

// 模块列表
router.get('/api/mode/short.json',function *(next){
  try{
    var result = yield modeController.short({},{url:1,name:1,author:1})
    this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})


// 获取坑位详情
router.get('/api/mode/detail.json',function *(next){
  try{
    var query = this.request.query
    var result = yield modeController.find({_id:query._id})
    if(result[0].length > 0){
      this.body = format(null, result[0][0])
    }else{
      this.body = format('坑位信息输入不合法')
    }
  }catch(e){
    this.body = format(e)
  }
})
