var router=require('./instance.js')
var path=require('path')
var format=require('../util/format.js')
var thunkify = require('thunkify')

var {dist} = require('../util/config.js')

var fs = require('fs')
var readFile = thunkify(fs.readFile).bind(fs)
var appendFile = thunkify(fs.appendFile).bind(fs)
var unlinkFile = thunkify(fs.unlink).bind(fs)

var imageController = require('../mysql-controller/image.js')

// 图片存放路径
var dest = path.join(process.cwd(),dist)

router.post('/api/upload.json',function *(next){
  const info = this.request.body.files.filename;
  const imgPath = path.basename(info.path);
  try{
     yield imageController.create({url:imgPath})
     this.body = format(null,imgPath)
  }catch(e){
    this.body = format(e)
  }
})

router.get('/api/image/all.json',function *(next){
  try{
    var result = yield imageController.all()
    this.body = format(null,result[0])
  }catch(e){
    this.body = format(e)
  }
})
