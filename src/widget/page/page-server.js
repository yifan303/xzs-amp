// 后端使用
var React = require('react')
var {bannerStyle,pagePannel,pagePannelDel,bannerPagePannel} = require('./style.js')

var renderPit = (item) => {
  return `
    <style>${item.style}</style><script type="text/template">${item.htmlTemplate}</script>
  `
}

module.exports = React.createClass({
  render(){
    var {list} = this.props
    return (
      <div>
        {list.map((item, index)=>{
          if(item.type === 'banner'){
            return (
              <div className="m-banner m-panel" key={index} style={bannerPagePannel(item.fillWidth)}>
                {item.bType==1&&!item.skuId&&(
                  <a data-detail={item.itemId||''} href="javascript:void(0);">
                    <img style={bannerStyle(item.fillWidth)} src={item.img}/>
                  </a>
                )}
                {item.bType==1&&item.skuId&&(
                  <a
                    data-sku={item.skuId}
                    data-item={item.itemId||''}
                    href="javascript:void(0);"
                  >
                    <img style={bannerStyle(item.fillWidth)} src={item.img}/>
                  </a>
                )}
                {item.bType==2&&(
                  <a href={item.href||'#'}><img style={bannerStyle(item.fillWidth)} src={item.img}/></a>
                )}
                {item.bType==3&&(
                  <div className="backToTop"><img style={bannerStyle(item.fillWidth)} src={item.img}/></div>
                )}
                {item.bType==4&&(
                  <a data-url={item.callUrl||''} data-coupon={item.couponId}><img style={bannerStyle(item.fillWidth)} src={item.img}/></a>
                )}
                {[1,2,3,4].indexOf(parseInt(item.bType||'-100'))===-1&&(
                  <img style={bannerStyle(item.fillWidth)} src={item.img}/>
                )}
              </div>
            )
          }
          var backgroundColor = item.backgroundColor
          if(item.type === 'pit'){
            return (
              <div className="m-pit m-panel" key={index} style={pagePannel}>
                <div style={{backgroundColor}} data-ids={item.goodIds}  dangerouslySetInnerHTML={{__html:renderPit(item)}}></div>
              </div>
            )
          }
          if(item.type === 'mode'){
            return (
              <div className="m-mode m-panel" key={index} style={pagePannel}>
                <div style={{backgroundColor}} dangerouslySetInnerHTML={{__html:item.insertHtml}}></div>
              </div>
            )
          }
        })}
      </div>
    )
  }
})
