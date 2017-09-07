import React from 'react'
import '../pit/pit.less'
import "codemirror/lib/codemirror.css"
import CodeMirror from 'codemirror/lib/codemirror.js'
import "codemirror/mode/htmlembedded/htmlembedded.js"
import "codemirror/mode/css/css.js"
import "codemirror/mode/javascript/javascript.js"
import Upload from 'widget/upload/upload-react.js'
import dialog from 'widget/dialog'
import {getUrlParam} from 'xzs-util'
import Modal from 'react-bootstrap/lib/Modal'

var _id = getUrlParam('id')
var btnStyle = {
  "position": "fixed",
  "right": "0",
  "bottom": "0",
  "zIndex": 10,
  "margin": 0,
  "padding": '10px',
  "backgroundColor": "#fff",
  "boxShadow": "0 0 2px rgba(0,0,0,.2)",
  "borderRadius": '4px 0 0 0'
}

export default React.createClass({
  getInitialState(){
    return {
      url:null,
      name:'',
      preview:false
    }
  },
  componentDidMount(){
    var extraKeys = {
      "Ctrl-S":e=>{

      },
      "Cmd-S":e=>{

      }
    }
    this.htmlEditor = CodeMirror.fromTextArea(this.refs.htmlEditor,{
      lineNumbers: true,
      mode:'application/x-ejs',
      extraKeys
    });

    this.lessEditor = CodeMirror.fromTextArea(this.refs.lessEditor,{
      lineNumbers: true,
      matchBrackets:true,
      mode:'text/x-less',
      extraKeys
    });

    this.jsEditor = CodeMirror.fromTextArea(this.refs.jsEditor,{
      lineNumbers: true,
      matchBrackets:true,
      mode:'javascript',
      extraKeys
    })

    if(_id){
      // 修改页面 数据回填
      var detail = $.ajax('/api/mode/detail.json',{
        data:{_id}
      })
      detail.done(result=>{
        if(result.code===1){
          var {html,js,css,name,url} = result.msg
          this.setState({
            url,name
          })
          this.htmlEditor.setValue(html)
          this.lessEditor.setValue(css)
          this.jsEditor.setValue(js)
        }
      })
    }

  },
  submit(){
    var {name,url} = this.state
    var html = this.htmlEditor.getValue()
    var css = this.lessEditor.getValue()
    var js = this.jsEditor.getValue()

    if(name===''){
      return dialog('请填写名字')
    }
    if(url===null){
      return dialog('请上传预览图')
    }
    if(html===''){
      return dialog('请填写html')
    }

    var promise=$.ajax('/api/mode/create.json',{
      method:'post',
      data:{
        html,
        css,
        js,
        name,
        url
      }
    })
    promise.done(result=>{
      if(result.code===1){
        dialog('页面添加成功,1秒之后跳转')
        window.setTimeout(()=>{
          window.location.href=`mode.html?id=${result.msg.insertId}`
        },1000)
      }
    })
  },
  save(){
    var {name,url} = this.state
    var html = this.htmlEditor.getValue()
    var css = this.lessEditor.getValue()
    var js = this.jsEditor.getValue()

    if(name===''){
      return dialog('请填写名字')
    }
    if(url===null){
      return dialog('请上传预览图')
    }
    if(html===''){
      return dialog('请填写html')
    }

    var promise=$.ajax('/api/mode/update.json',{
      method:'post',
      data:{
        _id,
        html,
        css,
        js,
        name,
        url
      }
    })
    promise.done(result=>{
      if(result.code===1){
        return dialog('页面修改成功')
      }else{
        return dialog(result.msg)
      }
    })
  },
  render(){
    var {url,name,preview} = this.state
    return (
      <div>
        <div className="pit">
          <div className="pit-editor-wrap box-shadow">
            <div className="pit-editor-head modal-header">
              <h5 className="modal-title">html</h5>
            </div>
            <textarea className="pit-editor" ref="htmlEditor"/>
          </div>
          <div className="pit-editor-wrap box-shadow">
            <div className="pit-editor-head modal-header">
              <h5 className="modal-title">less</h5>
            </div>
            <textarea className="pit-editor" ref="lessEditor" />
          </div>
          <div className="pit-editor-wrap box-shadow">
            <div className="pit-editor-head modal-header">
              <h5 className="modal-title">js</h5>
            </div>
            <textarea className="pit-editor" ref="jsEditor" />
          </div>
          <div className="pit-editor-wrap  box-shadow">
            <div className="pit-editor-head modal-header">
              <h5 className="modal-title">页面配置</h5>
            </div>
            <div className="pit-config form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label">名称</label>
                <div className="col-sm-10">
                  <input
                    onChange={e=>this.setState({name:e.target.value})}
                    value={name}
                    className="form-control"
                    placeholder="不能用中文,建议拼音缩写加日期,例如:czh-20170115"
                  />
                </div>
              </div>
              <div className="pit-img">
                <Upload onUpload={url=>this.setState({url})} />
              </div>
              <div className="pit-img-review" id="pitImgReview">
                {url&&<img src={url} />}
              </div>
            </div>
          </div>
        </div>
        <p style={btnStyle}>
          {!_id&&<a className="btn btn-primary" onClick={e=>this.submit()}>创建</a>}
          {_id&&<a className="btn btn-primary" onClick={e=>this.save()}>保存</a>}
          {' '}
          {_id&&<a href='javascript:void(0)' className="btn btn-success" onClick={e=>this.setState({preview:true})}>预览</a>}
        </p>
        <Modal show={preview} onHide={e=>this.setState({preview:false})}>
          {preview&&(
            <div key={Math.random()}>
              <iframe className="preview-iframe" src={`/api/mode/preview.json?_id=${_id}`}/>
            </div>
          )}
        </Modal>
      </div>
    )
  }
})
