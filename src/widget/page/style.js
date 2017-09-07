var formatWidth = function(fillWidth){
  var widthInt = parseInt(fillWidth)
  if(!widthInt||widthInt<10||widthInt>100){
    return 100
  }
  return widthInt
}
module.exports = {
  bannerStyle(fillWidth){
    var widthInt = formatWidth(fillWidth)
    if(widthInt===100){
      return {
        width:"10rem",
        height:"auto",
        display:"block"
      }
    }
    return {
      display:'block',
      width:10*widthInt/100+'rem',
      height:"auto"
    }
  },
  bannerPagePannel(fillWidth){
    var widthInt = formatWidth(fillWidth)
    if(widthInt===100){
      return {
        position: "relative"
      }
    }
    return {
      display:'inline-block',
      width:10*widthInt/100+'rem',
      height:"auto",
      position:'relative',
      verticalAlign:'top'
    }
  },
  pagePannel:{
    position:'relative'
  }
}
