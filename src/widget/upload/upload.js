import "./upload.less"
import resource from 'widget/config/resource.js'

export default (file,callback,placeholder)=>{
  file.wrap('<div class="upload"></div>')
  file.addClass('upload-input')
  file.attr('accept','image/png,image/jpg')
  var getFullPath=img=>`${resource}/${img}`
  var wrap=file.parent()
  wrap.append('<i class="iconfont">&#xe739;</i>'+(placeholder||'上传图片'))
  file.on('change',function(e){
    var element=$(this)
    var formData=new FormData();
    formData.append('filename',element[0].files[0])
    var promise=$.ajax({
      url:'/api/upload.json',
      method:'post',
      processData:false,
      contentType: false,
      data:formData
    })
    promise.done(result=>{
      if(result.code==1){
        wrap.css('background-image',`url(${getFullPath(result.msg)})`)
        callback&&callback(getFullPath(result.msg))
      }
    });
    promise.fail(e=>{
      console.log(e.toString())
    })
  })
}
