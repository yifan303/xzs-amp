import "./upload.less"
import React from 'react'
import resource from 'widget/config/resource.js'

export default React.createClass({
  getInitialState(){
    return {img:''}
  },
  uploadImg(e){
    var element = e.target
    var formData = new FormData()
    var callback = this.props.onUpload
    formData.append('filename',element.files[0])
    var promise=$.ajax({
      url:'/api/upload.json',
      method:'post',
      processData:false,
      contentType: false,
      data:formData
    })
    promise.done(result=>{
      if(result.code==1){
        var fullPath = `${resource}/${result.msg}`
        this.setState({img:fullPath})
        callback&&callback(fullPath)
      }
    });
    promise.fail(e=>{
      console.log(e.toString())
    })
  },
  render(){
    var backgroundImage = this.state.img?`url(${this.state.img})`:'none'
    return (
      <div className="upload" style={{backgroundImage}}>
        <i className="iconfont">&#xe739;</i>
        {this.props.placeholder||'上传图片'}
        <input
          accept="image/png,image/jpg"
          className="upload-input"
          type="file"
          onChange={e=>{this.uploadImg(e)}}
        />
      </div>
    )
  }
})
