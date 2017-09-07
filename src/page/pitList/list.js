import React from 'react'
import "./list.less"
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import Image from 'react-bootstrap/lib/Image'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import "widget/common"

var formatDate = (str)=>{
  var date = new Date(str)
  return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+
    ' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
}
export default React.createClass({
  getInitialState(){
    return {
      list:[],
      status:1
    }
  },
  getList(){
    var promise = $.ajax('/api/pit/short.json')
    promise.done(result=>{
      if(result.code === 1){
        this.setState({list:result.msg})
      }
    })
  },
  componentDidMount(){
    this.getList()
  },
  disabled(_id){
    var promise = $.ajax('/api/pit/update.json',{
      method:'post',
      data:{
        disabled:0,
        _id
      }
    })
    promise.done(result=>{
      if(result.code===1){
        this.getList()
      }
    })
  },
  enabled(_id){
    var promise = $.ajax('/api/pit/update.json',{
      method:'post',
      data:{
        disabled:1,
        _id
      }
    })
    promise.done(result=>{
      if(result.code===1){
        this.getList()
      }
    })
  },
  render(){
    var {list,status} = this.state
    return (
      <div className="wrap">
        <div className="tab">
          <Nav bsStyle="tabs" activeKey={status} onSelect={status=>this.setState({status})}>
            <NavItem eventKey={1}>使用中</NavItem>
            <NavItem eventKey={0}>已废弃</NavItem>
          </Nav>
        </div>
        {status!==0&&<div>
          {list.filter(item=>item.disabled!==0).map(item=>(
            <div key={item.name} className="square">
              <Panel header={"坑位名称 : "+item.name}>
                <div className='line'>
                  <Image src={item.url} thumbnail/>
                </div>
                <div className="line">{'创建者 : '+item.author}</div>
                <div className='line'>
                  <a className="btn btn-xs btn-primary" href={`/pit.html?pit=${item._id}`}>修改</a>
                  {' '}
                  <a className="btn btn-xs btn-primary" onClick={e=>this.disabled(item._id)}>废弃</a>
                </div>
              </Panel>
            </div>
          ))}
        </div>}
        {status===0&&<div>
          {list.filter(item=>item.disabled===0).map(item=>(
            <div key={item.name} className="square">
              <Panel header={"坑位名称 : "+item.name}>
                <div className='line'>
                  <Image src={item.url} thumbnail/>
                </div>
                <div className="line">{'创建者 : '+item.author}</div>
                <div className='line'>
                  <a className="btn btn-xs btn-primary" href={`/pit.html?pit=${item._id}`}>修改</a>
                  {' '}
                  <a className="btn btn-xs btn-primary" onClick={e=>this.enabled(item._id)}>使用</a>
                </div>
              </Panel>
            </div>
          ))}
        </div>}
        <div className="buttons">
          <a className="btn-add btn btn-primary" href='/pit.html'>新增坑位</a>
        </div>
      </div>
    )
  }
})
