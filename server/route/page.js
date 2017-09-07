var router = require('./instance.js')
var path = require('path')
var format = require('../util/format.js')
var {dist} = require('../util/config.js')
var pageController = require('../mysql-controller/page.js')

var React = require('react')
var thunkify = require('thunkify')
var fs = require('fs')
var existsFile = (distFile) => (callback) =>{
  fs.exists(distFile,(exist)=>{
    callback(null,exist)
  })
}
var dataTransform = require('../util/json.js')
var writeFile = thunkify(fs.writeFile)
var appendFile = thunkify(fs.appendFile)

// 获取webpack生成的页面  生成页面时不重名  防止和发布的页面冲突
var illegalNames = (()=>{
  var pagePath = path.join(process.cwd(),'src','page')
  return fs.readdirSync(pagePath)
})()

// 创建页面
router.post('/api/page/create.json',function *(next){
  try{
    var {body} = this.request
    if(illegalNames.indexOf(body.name)!==-1){
      return this.body = format('非法的页面名称')
    }
    body.author = this.session.user.name
    var result = yield pageController.create(dataTransform.page.toDb(body))
    this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})

// 修改页面
router.post('/api/page/update.json',function *(next){
  try{
    var {_id,list,globalStyle,description} = dataTransform.page.toDb(this.request.body)
    var result =yield pageController.update({_id,list,globalStyle,description})
    this.body = format(null,result)
  }catch(e){
    this.body = format(e)
  }
})

// 改变页面状态 前端根据页面状态进行分类展示
router.post('/api/page/status.json',function *(next){
  try{
    var {_id,disabled} = dataTransform.page.toDb(this.request.body)
    var result =yield pageController.update({_id,disabled})
    this.body = format(null,result)
  }catch(e){
    this.body = format(e)
  }
})

// 发布页面
var Page = require('../../src/widget/page/page-server.js')
var getPage = require('../util/getPage.js')
router.post('/api/page/createHtml.json',function *(next){
  try{
    var ReactDOMServer = require('react-dom/server')
    var {body} = this.request
    if(!body._id){
      return this.body = format("请输入id")
    }
    if(!this.session.user){
      return this.body = format('没有用户信息，请重新登陆')
    }
    var result = yield pageController.find({_id:body._id})
    result = result[0]
    if(result.length===0){
      return this.body = format('找不到改页面')
    }
    result = (dataTransform.page.toFront(result))[0]
    if(result.author!==this.session.user.name){
      return this.body = format('你不是改页面的创建者，无法发布')
    }
    var html=getPage(
      ReactDOMServer.renderToString(<Page list={result.list}/>),
      result.globalStyle,
      result.description||result.name
    )
    var distFile = path.join(process.cwd(),dist,result.name+'.html')
    if(yield existsFile(distFile)){
      yield writeFile(distFile,html,'utf8')
    }else{
      yield appendFile(distFile,html,'utf8')
    }
    this.body = format(null,result)
  }catch(e){
    this.body = format(e)
  }
})

// 页面详情
router.get('/api/page/detail.json',function *(next){
  try{
    var {query} = this.request
    if(!query._id){
      return this.body = format('请填写_id')
    }
    var search = yield pageController.find({_id:query._id})
    if(search[0].length === 0){
      return this.body = format('没有找到相应页面')
    }
    var result = dataTransform.page.toFront(search[0])
    return this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})

// 页面列表
router.get('/api/page/short.json',function *(next){
  try{
    var result = yield pageController.short()
    this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})
