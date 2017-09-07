import "./common.less"

$( document ).ajaxSuccess(function(ev, xhr, settings){
  var response = JSON.parse(xhr.responseText)
  if(response.code === 5){
    window.location.href='/login.html'
  }
})
