// 前端使用
var React = require('react')
var {bannerStyle,pagePannel,pagePannelDel,bannerPagePannel} = require('./style.js')

module.exports = React.createClass({
  render(){
    var {list,onDeleteBanner,onEdit,onUp,onDown,onEditBanner,onEditMode} = this.props
    return (
      <div>
        {list.map((item, index)=>{
          if(item.type === 'banner'){
            return (
              <div key={index} style={bannerPagePannel(item.fillWidth)}>
                <a className="client-hidden panel-del btn-xs btn btn-primary" title="删除" onClick={e=>onDeleteBanner&&onDeleteBanner(index)}>
                  <span className="iconfont">&#xe6b4;</span>
                </a>
                <a className="client-hidden panel-edit btn-xs btn btn-primary" title="修改" onClick={e=>onEditBanner&&onEditBanner(index)}>
                  <span className="iconfont">&#xe649;</span>
                </a>
                <a className="client-hidden panel-up btn-xs btn btn-primary" title="上移" onClick={e=>onUp&&onUp(index)}>
                  <span className="iconfont">&#xe69e;</span>
                </a>
                <a className="client-hidden panel-down btn-xs btn btn-primary" title="下移" onClick={e=>onDown&&onDown(index)}>
                  <span className="iconfont">&#xe703;</span>
                </a>
                {item.bType==1&&(
                  <a data-detail={item.itemId||''} href="javascript:void(0);"><img style={bannerStyle(item.fillWidth)} src={item.img}/></a>
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
              <div key={index} style={pagePannel}>
                <a className="client-hidden panel-del btn-xs btn btn-primary" title="删除" onClick={e=>onDeleteBanner&&onDeleteBanner(index)}>
                  <span className="iconfont">&#xe6b4;</span>
                </a>
                <a className="client-hidden panel-edit btn-xs btn btn-primary" title="修改" onClick={e=>onEdit&&onEdit(item,index)}>
                  <span className="iconfont">&#xe649;</span>
                </a>
                <a className="client-hidden panel-up btn-xs btn btn-primary" title="上移" onClick={e=>onUp&&onUp(index)}>
                  <span className="iconfont">&#xe69e;</span>
                </a>
                <a className="client-hidden panel-down btn-xs btn btn-primary" title="下移" onClick={e=>onDown&&onDown(index)}>
                  <span className="iconfont">&#xe703;</span>
                </a>
                <div style={{backgroundColor}} dangerouslySetInnerHTML={{__html:`<style>${item.style}</style>${item.html}`}}></div>
              </div>
            )
          }
          if(item.type === 'mode'){
            return (
              <div key={index} style={pagePannel}>
                <a className="client-hidden panel-del btn-xs btn btn-primary" title="删除" onClick={e=>onDeleteBanner&&onDeleteBanner(index)}>
                  <span className="iconfont">&#xe6b4;</span>
                </a>
                <a className="client-hidden panel-edit btn-xs btn btn-primary" title="修改" onClick={e=>onEditMode&&onEditMode(item,index)}>
                  <span className="iconfont">&#xe649;</span>
                </a>
                <a className="client-hidden panel-up btn-xs btn btn-primary" title="上移" onClick={e=>onUp&&onUp(index)}>
                  <span className="iconfont">&#xe69e;</span>
                </a>
                <a className="client-hidden panel-down btn-xs btn btn-primary" title="下移" onClick={e=>onDown&&onDown(index)}>
                  <span className="iconfont">&#xe703;</span>
                </a>
                <img style={bannerStyle()} src={item.url}/>
              </div>
            )
          }
        })}
      </div>
    )
  }
})
