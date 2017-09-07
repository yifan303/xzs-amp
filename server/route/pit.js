var router = require('./instance.js')
var path = require('path')
var format = require('../util/format.js')
var thunkLess = require('../util/thunkLess.js')
var pitController = require('../mysql-controller/pit.js')
var _ = require('underscore')
var requestGoods = require('../util/requestGoods.js')

// 创建坑位
router.post('/api/pit/create.json',function *(next){
  try{
    var body = this.request.body
    var search = yield pitController.find({name:body.name})
    if(search[0].length>0){
      return this.body = format('有重名的模块')
    }
    if(this.session.user){
      body.author = this.session.user.name
    }

    var result = yield pitController.create(body)
    return this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})

// 更新坑位
router.post('/api/pit/update.json',function *(next){
  try{
    var body = this.request.body
    if(!this.session.user){
      return this.body = format('没有用户信息，请重新登陆')
    }
    var pits = yield pitController.find({_id:body._id})

    if(pits[0].length > 0){
      var pit = pits[0][0]
      if(pit.author!==this.session.user.name){
        return this.body = format('你不是该模块的创建者，不能修改该坑位')
      }
      var result = yield pitController.update(body)
      this.body = format(null,result[0])
    }else{
      this.body = format('找不到相应坑位')
    }
  }catch(e){
    this.body = format(e)
  }
})

// 根据坑位id和数据  获取生成的html
router.get('/api/pit/html.json',function *(next){
  try{
    var {pit,ids,backgroundColor} = this.request.query
    var result = yield pitController.find({_id:pit})
    var goodsData = yield requestGoods(ids.split(','))
    if(!goodsData.success){
      throw goodsData.errorMsg
    }
    
    if(!goodsData.module||goodsData.module.length===0){
      return this.body = format('没有商品数据，请检查填入的skuId')
    }
    if(result[0].length>0){
      result = result[0]
      var wrapName=`n${+new Date}`
      var outputLess = yield thunkLess(`.${wrapName}{${result[0].css}}`,{backgroundColor})
      var html = _.template(`<div class="${wrapName}">${result[0].html}</div>`)({list:goodsData.module,backgroundColor})
      var moduleResult = {
        html,
        htmlTemplate:`<div class="${wrapName}">${result[0].html}</div>`,
        style:outputLess.css,
        ids
      }
      this.body = format(null,moduleResult)
      // this.body=format(null,`<style>${outputLess.css}</style>${html}`)
    }else{
      this.body = format('坑位ID有误')
    }
  }catch(e){
    this.body = format(`坑位添加有误，错误为：${e.toString()}，请检查坑位代码`)
  }
})

router.get('/api/pit/short.json',function *(next){
  try{
    var result = yield pitController.short({},{url:1,name:1,author:1})
    this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})

// 获取坑位详情
router.get('/api/pit/detail.json',function *(next){
  try{
    var query = this.request.query
    var result = yield pitController.find({_id:query.pit})
    if(result[0].length > 0){
      this.body = format(null, result[0][0])
    }else{
      this.body = format('坑位信息输入不合法')
    }
  }catch(e){
    this.body = format(e)
  }
})
