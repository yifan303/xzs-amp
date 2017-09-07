import _ from 'underscore'
import "widget/common"
import Nav from 'widget/nav/nav-react.js'
import html from './pit.html'
import "./pit.less"
import "codemirror/lib/codemirror.css"
import CodeMirror from 'codemirror/lib/codemirror.js'
import "codemirror/mode/htmlembedded/htmlembedded.js"
import "codemirror/mode/css/css.js"
import upload from 'widget/upload'
import {getUrlParam} from 'xzs-util'
import dialog from 'widget/dialog'
import React from 'react'
import {render} from 'react-dom'

const content=$('#content')
content.append(html)

var body = document.getElementsByTagName('body')[0]
var header = document.createElement('div')
render(<Nav select="pit"/>,header)
body.insertBefore(header,content[0])

$(()=>{
  var extraKeys = {
    "Ctrl-S":e=>{

    },
    "Cmd-S":e=>{

    }
  }
  var htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'),{
    lineNumbers: true,
    mode:'application/x-ejs',
    extraKeys
  });

  var lessEditor = CodeMirror.fromTextArea(document.getElementById('lessEditor'),{
    lineNumbers: true,
    matchBrackets:true,
    mode:'text/x-less',
    extraKeys
  });
  upload($('#pitImg'),img=>{
    var review=$('#pitImgReview')
    if(review.find('img').length===0){
      return review.append(`<img src="${img}" />`)
    }
    var imgDom=review.find('img')
    imgDom.attr('src',img)
  },'上传预览图')

  // 修改坑位  回填坑位详情
  var pit = getUrlParam('pit')
  if(pit){
    var detail = $.ajax('/api/pit/detail.json',{
      data:{pit}
    })
    detail.done(result=>{
      if(result.code==1){
        var {msg} = result
        htmlEditor.setValue(msg.html)
        lessEditor.setValue(msg.css)
        $('#inputName').val(msg.name)
        $('#pitImgReview').append(`<img src="${msg.url}" />`)
      }
    })
  }

  $('#save').on('click',function(e){
    var html = htmlEditor.getValue()
    var css = lessEditor.getValue()
    var name = $('#inputName').val()
    var img = $('#pitImgReview').find('img')
    var modal = $('#msgDialog')

    if(!html||!css||!name||img.length===0){
      return dialog('坑位信息不全，不能添加','坑位提示')
    }

    if(pit){
      var savePromise = $.ajax('/api/pit/update.json',{
        method:'post',
        data:{
          _id:pit,
          html,
          css,
          name,
          url:img.attr('src')
        }
      })
      savePromise.then(result => {
        if(result.code === 1){
          return dialog('坑位更新成功')
        }else{
          return dialog(result.msg)
        }
      })
      return
    }

    var promise=$.ajax('/api/pit/create.json',{
      method:'post',
      data:{
        html,
        css,
        name,
        url:img.attr('src')
      }
    })
    promise.done(result=>{
      if(result.code===1){
        dialog('坑位添加成功','坑位提示')
        window.setTimeout(()=>{
          window.location.href="/pitList.html"
        },2000)
      }else{
        return dialog(result.msg)
      }
    })

  })

  // 预览
  var pit = getUrlParam('pit')
  var iframe = $('#previewIframe')
  if(pit){
    iframe.attr('src',`/api/preview.json?pit=${pit}`)
  }
  $('#preview').on('click',()=>{
    iframe.attr('src',iframe.attr('src'))
    $('#iframeModal').modal('show')
  })

})
