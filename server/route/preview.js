var router = require('./instance.js')
var format = require('../util/format.js')
var _ = require('underscore')

var getPage = require('../util/getPage.js')

var pitController = require('../mysql-controller/pit.js')
var modeController = require('../mysql-controller/mode.js')
var thunkLess = require('../util/thunkLess.js')
var mockList = require('../util/mockData.js')

router.get('/api/preview.json',function *(next){
  this.set('Content-Type','text/html')
  var query = this.request.query
  var globalStyle = {backgroundColor:'rgb(118, 179, 86)'}
  var backgroundColor = '#ff6600'
  try{
    var result = yield pitController.find({_id:query.pit})
    if(result[0].length > 0){
      var wrapName=`n${+new Date}`
      var outputLess = yield thunkLess(`.${wrapName}{${result[0][0].css}}`,{backgroundColor})
      var html = _.template(`<div class="${wrapName}">${result[0][0].html}</div>`)({list:mockList,backgroundColor})
      this.body=getPage(`<style>${outputLess.css}</style>${html}`,globalStyle)
    }else{
      this.body = getPage('找不到模块',globalStyle)
    }

  }catch(e){
    this.body = getPage(e.toString(),globalStyle)
  }
})

router.get('/api/html/preview.json',function *(next){
  this.set('Content-Type','text/html')
  var globalStyle = {backgroundColor:'rgb(118, 179, 86)'}
  try{
    this.body = getPage('<a data-coupon="19">点击领卷</a>',globalStyle)
  }catch(e){
    this.body = getPage(e.toString(),globalStyle)
  }
})

router.get('/api/mode/preview.json',function *(next){
  try{
    this.set('Content-Type','text/html')
    var {_id} = this.request.query
    var result = yield modeController.find({_id})
    var globalStyle = {backgroundColor:'rgb(118, 179, 86)'}
    var param = '测试参数1,测试参数2'
    var param1 = '测试参数3'
    if(result[0].length>0){
      result = result[0]
      var wrapName=`m${+new Date}`
      var outputLess = yield thunkLess(`.${wrapName}{${result[0].css}}`)
      var html = _.template(`<div class="${wrapName}">${result[0].html}</div>`)({param,param1})
      var js = `<script>(function(param){ ${result[0].js} })('${param,param1}')</script>`
      this.body = getPage(`<style>${outputLess.css}</style>${html}${js}`,globalStyle)
    }else{
      this.body = getPage('模块ID有误',globalStyle)
    }
  }catch(e){
    this.body = getPage(`模块添加有误，错误为：${e.toString()}，请检查模块代码`,globalStyle)
  }
})
