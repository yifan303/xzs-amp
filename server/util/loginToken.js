var request = require('request')
var thunkify = require('thunkify')
var requestThunk = thunkify(request)

module.exports = (data,isOnline)=>{
  var host = isOnline?
    'http://purchaseop.xianzaishi.com':
    'http://purchaseop.xianzaishi.net/purchaseadmin';

  return requestThunk({
    url:host+'/user/login',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    method:"POST",
    body:`data=${JSON.stringify(data)}`
  })
}
