import "./login.less"
import html from './login.html'
import dialog from 'widget/dialog'

const content=$('#content')
content.append(html)

$(()=>{

  var login = $('.login')
  var user = $('#user')
  var passwordEle = $('#password')
  var md5 = require('blueimp-md5')

  login.on('submit',function(e){
    if(user.val()===''||passwordEle.val()===''){
      dialog('请填写用户名和密码')
    }else{
      var userName=user.val()
      var password=passwordEle.val()
      var equipmentId=md5('chrome')
      var sysTime=+new Date
      var sign=md5(`${md5(password)}_${sysTime}_${equipmentId}`)
      var data={
        userName,
        equipmentId,
        sysTime,
        sign
      }
      var promise=$.ajax({
        url:'/api/login.json',
        method:'post',
        data
      })
      promise.done(result=>{
        if(result.success){
          window.location.href=`/pageList.html?_random=${Math.random()}`;
        }else{
          dialog(result.msg||result.errorMsg)
        }
      })
      promise.fail(()=>{
        dialog('登陆失败')
      })
    }
    e.preventDefault()
    return false
  })

})
