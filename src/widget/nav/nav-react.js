import React from 'react'
import "./nav.less"

export default React.createClass({
  getInitialState(){
    return {
      userName:''
    }
  },
  componentDidMount(){
    var promise = $.ajax('/api/getUser.json')
    promise.done(result=>{
      if(result.code===1){
        this.setState({userName:result.msg.name})
      }
    })
  },
  logout(){
    var promise = $.ajax('/api/logout.json',{
      method:'post'
    })
    promise.done(result=>{
      if(result.code===1){
        window.location.href='/login.html'
      }
    })
  },
  render(){
    var {select} = this.props
    return (
      <nav className="navbar navbar-default navbar-page" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">活动制作平台</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={select==='make'?'active':''}><a href="/pageList.html">页面</a></li>
              <li className={select==='pit'?'active':''}><a href="/pitList.html">坑位</a></li>
              <li className={select==='mode'?'active':''}><a href="/modeList.html">模块</a></li>
              <li className={select==='image'?'active':''}><a href="/image.html">图片</a></li>
            </ul>
          </div>
        </div>
        <a className="user" onClick={e=>this.logout()}>
          <span className="iconfont">&#xe7cb;</span>
          {' '}
          {this.state.userName}
        </a>
      </nav>
    )
  }
})
