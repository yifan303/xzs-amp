module.exports=function(error,json){
  if(error){
    return JSON.stringify({
      code:0,
      msg:error.toString()
    })
  }
  return JSON.stringify({
    code:1,
    msg:json
  })
}
