import React from 'react'
import './make.less'
import Upload from 'widget/upload/upload-react.js'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Button from 'react-bootstrap/lib/Button'
import FormControl from 'react-bootstrap/lib/FormControl'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import Radio from 'react-bootstrap/lib/Radio'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Store from 'widget/store'
import Page from 'widget/page'
import msg from 'widget/msg'
import {getUrlParam} from 'xzs-util'
import PitModal from './pit-modal.js'
import resource from 'widget/config/resource.js'
import Qrcode from './qrcode-modal.js'
import message from 'xzs-message'
import _ from 'underscore'

var {bannerStore} = Store

var id = getUrlParam('id')

//各种事件
var eventGroup = {
  changeGlobal(globalStyle){
    this.setState({globalStyle})
  },
  uploadBackgroundImage(result){
    var {globalStyle} = this.state
    globalStyle = Object.assign({},globalStyle)
    globalStyle.backgroundImage = result?`url(${result})`:'none'
    this.setState({globalStyle})
  },
  emptyBackgroundImage(){
    var {globalStyle} = this.state
    globalStyle = Object.assign({},globalStyle)
    globalStyle.backgroundImage = 'none'
    this.setState({globalStyle})
  },
  uploadBanner(result){
    var {banners} = this.state
    banners = Object.assign([],banners)
    banners.unshift(result)
    this.setState({banners})
    bannerStore.set(result)
  },
  // 右侧删除banner
  delectBanner(img){
    var {banners} = this.state
    this.setState({banners:banners.filter(image=>image!=img)})
    bannerStore.del(img)
  },
  // 拖拽右侧的banner
  dragBanner(e,img){
    e.dataTransfer.setData("item",JSON.stringify({type:'banner',img}))
  },
  // 拖拽右侧的坑位
  dragPit(e,pit){
    pit.backgroundColor = '#ffffff'
    pit.goodIds = ''
    pit.type = 'pit'
    e.dataTransfer.setData('item',JSON.stringify(pit))
  },
  // 拖拽右侧的模块
  dragMode(e,mode){
    mode.type = 'mode'
    mode.param = ''
    mode.param1 = ''
    e.dataTransfer.setData('item',JSON.stringify(mode))
  },

  // 拖放右侧东西到左侧的页面上
  dropPage(e){
    var item = e.dataTransfer.getData("item")
    if(item){
      var {list} = this.state
      list = Object.assign([],list)
      item = JSON.parse(item)

      //  拖放banner
      if(item.type === 'banner'){
        list.push(item)
        this.setState({bannerModal:true,bannerEditIndex:list.length-1})
      }
      // 拖放坑位 弹出对话框  要求输入商品id
      if(item.type === 'pit'){
        this.setState({pitModal:true,pitModalData:item})
      }
      if(item.type === 'mode'){
        list.push(item)
        this.setState({modeModal:true,modeEditIndex:list.length-1})
      }
      this.setState({list})
    }
  },
  // 添加坑位
  appendPit(e){
    var list = Object.assign([],this.state.list)
    var result = Object.assign({},e)
    result.type = 'pit'
    list.push(result)
    this.setState({list})
  },

  // 左侧删除banner
  deletePageBanner(index){
    this.setState({list:this.state.list.filter((item,idx)=>idx!==index)})
  },

  // 左侧修改坑位弹框
  editPagePit(data,index){
    this.setState({
      pitEditModal:true,
      pitEditModalData:data,
      pitEditIndex:index
    })
  },
  // 左侧修改坑位
  editPit(e){
    var {pitEditIndex,list} = this.state
    var result = Object.assign({},e)
    list = Object.assign([],list)
    result.type = 'pit'
    list[pitEditIndex] = result
    this.setState({list})
  },
  // 修改左侧模块
  editMode(item,index){
    this.setState({modeEditIndex:index,modeModal:true})
  },
  // 右侧点击切换tab
  changeTab(tab){
    this.setState({tab})
  },

  // 上移模块
  upPanel(index){
    var list = Object.assign([],this.state.list)
    if(index<=0){ return }
    var flag = list[index-1]
    list[index-1] = list[index]
    list[index] = flag
    this.setState({list})
  },
  // 下移模块
  downPanel(index){
    var list = Object.assign([],this.state.list)
    if(index>=list.length-1){ return }
    var flag = list[index+1]
    list[index+1] = list[index]
    list[index] = flag
    this.setState({list})
  },

  //修改banner
  editBanner(index){
    this.setState({bannerModal:true,bannerEditIndex:index})
  },

  // 设置banner类型
  setBType(bType){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].bType=bType
    this.setState({list})
  },
  setBItemId(itemId){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].itemId=itemId
    this.setState({list})
  },
  setBSkuId(skuId){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].skuId=skuId
    this.setState({list})
  },
  setBHref(href){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].href=href
    this.setState({list})
  },
  setBCouponId(couponId){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].couponId=couponId
    this.setState({list})
  },
  setBFillWidth(fillWidth){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].fillWidth=fillWidth
    this.setState({list})
  },
  setBCallUrl(callUrl){
    var {list,bannerEditIndex} = this.state
    list = Object.assign([],list)
    list[bannerEditIndex].callUrl=callUrl
    this.setState({list})
  },
  // 设置模块参数
  setMParam(param){
    var {list,modeEditIndex} = this.state
    list = Object.assign([],list)
    list[modeEditIndex].param=(param||'').replace(/，/g,',')
    this.setState({list})
  },

  // 设置另一个模块参数
  setMParam1(param1){
    var {list,modeEditIndex} = this.state
    list = Object.assign([],list)
    list[modeEditIndex].param1=(param1||'').replace(/，/g,',')
    this.setState({list})
  },

  // 获取模块的html
  getModeHtml(){
    var {modeEditIndex,list} = this.state
    var item = list[modeEditIndex]
    var promise = $.ajax('/api/mode/html.json',{
      data:{
        _id:item._id,
        param:item.param,
        param1:item.param1
      }
    })
    promise.done(result=>{
      if(result.code===1){
        item.insertHtml = result.msg
        this.setState({list,modeModal:false})
      }else{
        return msg.show(result.msg)
      }
    })
  },

  // 提交页面
  submit(){
    var nameState = this.getValidationState()
    if(nameState === 'error'){
      return msg.show('请填写页面名称')
    }
    var {list,globalStyle,name,description} = this.state
    if(list.length === 0){
      return msg.show('页面没有内容')
    }
    if(!id){
      var promise = $.ajax('/api/page/create.json',{
        method:'post',
        data:{
          list,globalStyle,name,description
        }
      })
      promise.done(result=>{
        if(result.code === 1){
          var timeout = 1;
          msg.show(`添加页面成功,${timeout}秒后跳转`)
          window.setTimeout(()=>{
            window.location.href=`/make.html?id=${result.msg.insertId}`;
          },timeout*1000)
        }else{
          msg.show(result.msg)
        }
      })
    }else{
      var updatePromise = $.ajax('/api/page/update.json',{
        method:'post',
        data:{
          _id:id,list,globalStyle,name,description
        }
      })
      updatePromise.done(result=>{
        if(result.code === 1){
          msg.show('修改页面成功')
        }else{
          msg.show(result.msg)
        }
      })
    }
  },
  createHtml(){
    this.sendingCreateRequest = this.sendingCreateRequest || false
    if(this.sendingCreateRequest){
      return;
    }
    this.sendingCreateRequest = true
    var promise = $.ajax('/api/page/createHtml.json',{
      data:{_id:id},
      method:'post'
    })
    promise.done(result=>{
      if(result.code===1){
        var url = `${resource}/${result.msg.name}.html`
        msg.show(<span>页面发布成功,url为<a target="_blank" href={url}>{url}</a></span>)
      }else{
        msg.show(result.msg)
      }
    })
    promise.always(()=>{
      this.sendingCreateRequest = false
    })
  },
  getValidationState(){
    var {name} = this.state
    if(name===''){
      return 'error'
    }
    return 'success'
  }

}

// 生命周期
var lifeGroup = {
  getInitialState(){
    return {
      tab:0,
      banners:[],
      pits:[],
      modes:[],

      // 添加坑位
      pitModal:false,
      pitModalData:{},

      // 修改坑位
      pitEditModal:false,
      pitEditModalData:{},
      pitEditIndex:0,
      pitEditGoodIds:'',

      //修改banner
      bannerModal:false,
      bannerEditIndex:0,

      // 修改自定义模块
      modeModal:false,
      modeEditIndex:0,

      name:'',
      description:'',
      list:[],
      globalStyle:{
        "backgroundColor":'#000000',
        'backgroundImage':''
      },

      //qrcode
      qrModal:false

    }
  },
  componentDidMount(){
    this.setState({banners:bannerStore.get()})

    // 获取坑位列表
    var promise = $.ajax('/api/pit/short.json')
    promise.done(result=>{
      if(result.code===1){
        this.setState({pits:result.msg.filter(item=>item.disabled!==0)})
      }
    })

    // 获取模块列表
    var modePromise = $.ajax('/api/mode/short.json')
    modePromise.done(result=>{
      if(result.code===1){
        this.setState({modes:result.msg.filter(item=>item.disabled!==0)})
      }
    })

    // 如果是修改  回填数据
    if(id){
      var detailPromise = $.ajax('/api/page/detail.json',{
        data:{_id:id}
      })
      detailPromise.done(result=>{
        if(result.code === 1){
          var {name,list,globalStyle,description} = result.msg
          if(!_.isArray()){
            list = _.toArray(list)
          }
          this.setState({
            name,list,globalStyle,description
          })
        }
      })
    }

  },

  render(){
    var {
      globalStyle,tab,banners,list,pits,name,modes,
      pitModal,pitModalData,
      pitEditModalData,pitEditModal,pitEditGoodIds,
      bannerModal,bannerEditIndex,
      modeModal,modeEditIndex,
      qrModal
    } = this.state

    var item = list[bannerEditIndex]
    var mode = list[modeEditIndex]

    return (
      <div className="page">
        <div className="page-left">
          <div className="page-make">
            <div id="pageContent" onDragOver={e=>e.preventDefault()} onDrop={e=>this.dropPage(e)} style={globalStyle}>
              <Page
                list={list}
                onEdit={(data,index)=>this.editPagePit(data,index)}
                onEditMode={(data,index)=>this.editMode(data,index)}
                onDeleteBanner={e=>this.deletePageBanner(e)}
                onEditBanner={e=>this.editBanner(e)}
                onUp={e=>this.upPanel(e)}
                onDown={e=>this.downPanel(e)}
              />
            </div>
          </div>
        </div>
        <div className="page-right">
          <Nav className="nav nav-tabs nav-right" activeKey={tab} onSelect={e=>{this.changeTab(e)}}>
            <NavItem eventKey={0}>页面设置</NavItem>
            <NavItem eventKey={1}>banner设置</NavItem>
            <NavItem eventKey={2}>坑位设置</NavItem>
            <NavItem eventKey={3}>模块设置</NavItem>
          </Nav>
          {tab===0&&<div className="page-config">
            <form className="form-horizontal" role="form">
              <FormGroup
                validationState={this.getValidationState()}
              >
                <label className="col-sm-3 control-label" style={{"marginTop":"7px"}}>页面名称</label>
                <div className="col-sm-9">
                  <FormControl
                    type="text"
                    value={this.state.name}
                    onChange={e=>!id&&this.setState({name:e.target.value.replace(/[^a-zA-Z0-9\-]/g,'')})}
                    placeholder="页面名称,不可重名,禁空格,如czh20170605"
                  />
                  <FormControl.Feedback />
                </div>
              </FormGroup>
              <FormGroup>
                <label className="col-sm-3 control-label" style={{"marginTop":"7px"}}>页面标题</label>
                <div className="col-sm-9">
                  <FormControl
                    componentClass="textarea"
                    value={this.state.description||''}
                    onChange={e=>this.setState({description:e.target.value})}
                    placeholder="页面标题"
                  />
                </div>
              </FormGroup>
              <div className="form-group">
                <label className="col-sm-3 control-label">背景色</label>
                <div className="col-sm-9">
                  <input type="color" value={globalStyle.backgroundColor} onChange={e=>{this.changeGlobal({"backgroundColor":e.target.value})}} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label">背景图片</label>
                <div className="col-sm-9">
                  <Upload onUpload={e=>{this.uploadBackgroundImage(e)}}/>
                  {' '}
                  <a className="btn btn-primary btn-xs" onClick={e=>this.emptyBackgroundImage()} style={{"verticalAlign":"top","position":"relative","top":"3px"}}>删除背景图片</a>
                </div>
              </div>
            </form>
          </div>}
          {tab===1&&<div className="page-config">
            <div className="form-group">
              <div className="page-banner">
                <Upload placeholder="上传banner" onUpload={e=>{this.uploadBanner(e)}} />
              </div>
              <div className="banner-container">
                {banners.map(img=>(
                  <div key={img} className="banner-item">
                    <a className="banner-del" onClick={e=>{this.delectBanner(img)}}>x</a>
                    <img draggable onDragStart={e=>this.dragBanner(e,img)} className="banner-img" src={img} />
                  </div>
                ))}
              </div>
            </div>
          </div>}
          {tab===2&&<div className="page-config">
            <div className="page-pits">
              {pits.map(item=>(
                <div key={item.name} className="page-pits-wrap">
                  <span>{item.name}</span>
                  <img draggable src={item.url} onDragStart={e=>this.dragPit(e,item)}/>
                </div>
              ))}
            </div>
          </div>}
          {tab===3&&<div className="page-config">
            <div className="page-pits">
              {modes.map(item=>(
                <div key={item.name} className="page-pits-wrap">
                  <span>{item.name}</span>
                  <img draggable src={item.url} onDragStart={e=>this.dragMode(e,item)}/>
                </div>
              ))}
            </div>
          </div>}
        </div>
        <PitModal
          pitModalData = {pitModalData}
          pitModal = {pitModal}
          onHide = {e=>this.setState({pitModal:false})}
          onSuccess = {e=>this.appendPit(e)}
        />
        <PitModal
          pitModalData = {pitEditModalData}
          pitModal = {pitEditModal}
          onHide = {e=>this.setState({pitEditModal:false})}
          onSuccess = {e=>this.editPit(e)}
        />

        <Qrcode
          modal = {qrModal}
          name = {name}
          onHide = {e=>this.setState({qrModal:false})}
        />

        <Modal show={modeModal} onHide={e=>{}}>
          <Modal.Header>模块设置</Modal.Header>
          <Modal.Body>
            {mode&&(
              <FormGroup>
                <ControlLabel>填写参数</ControlLabel>
                {' '}
                <FormControl placeholder="逗号分割" value={mode.param||''} onChange={e=>this.setMParam(e.target.value)}/>
              </FormGroup>
            )}
            {mode&&(
              <FormGroup>
                <ControlLabel>填写参数</ControlLabel>
                {' '}
                <FormControl value={mode.param1||''} onChange={e=>this.setMParam1(e.target.value)} />
              </FormGroup>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={e=>this.getModeHtml()}>确定</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={bannerModal} onHide={e=>this.setState({bannerModal:false})}>
          <Modal.Header>
            <Modal.Title>banner设置</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {item&&item.type==='banner'&&(
              <div>
                <FormGroup>
                  <Radio checked={item.bType==0} onChange={e=>this.setBType(0)} inline>无</Radio>
                  {' '}
                  <Radio checked={item.bType==1} onChange={e=>this.setBType(1)} inline>跳转app详情页</Radio>
                  {' '}
                  <Radio checked={item.bType==2} onChange={e=>this.setBType(2)} inline>跳转页面url</Radio>
                  {' '}
                  <Radio checked={item.bType==3} onChange={e=>this.setBType(3)} inline>回到顶部</Radio>
                  {' '}
                  <Radio checked={item.bType==4} onChange={e=>this.setBType(4)} inline>优惠劵</Radio>
                </FormGroup>
                {item.bType==1&&(
                  <FormGroup>
                    <ControlLabel>item-id</ControlLabel>
                    {' '}
                    <FormControl
                      value={item.itemId||''}
                      placeholder="item-id必填"
                      type="number"
                      onChange={e=>this.setBItemId(e.target.value)}
                    />
                  </FormGroup>
                )}
                {item.bType==1&&(
                  <FormGroup>
                    <ControlLabel>sku-id</ControlLabel>
                    {' '}
                    <FormControl
                      value={item.skuId||''}
                      placeholder="不填sku-id,则为打开详情页"
                      type="number"
                      onChange={e=>this.setBSkuId(e.target.value)}
                    />
                  </FormGroup>
                )}
                {item.bType==2&&(
                  <FormGroup>
                    <ControlLabel>url链接</ControlLabel>
                    {' '}
                    <FormControl value={item.href||''} onChange={e=>this.setBHref(e.target.value)}/>
                  </FormGroup>
                )}
                {item.bType==4&&(
                  <div>
                    <FormGroup>
                      <ControlLabel>优惠劵id</ControlLabel>
                      {' '}
                      <FormControl value={item.couponId||''} type="text" placeholder="多个优惠劵可以使用逗号分隔" onChange={e=>this.setBCouponId(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>领取成功跳转url</ControlLabel>
                      {' '}
                      <FormControl value={item.callUrl||''} onChange={e=>this.setBCallUrl(e.target.value)} />
                    </FormGroup>
                  </div>
                )}
                <FormGroup>
                  <ControlLabel>宽度 - {(item.fillWidth||100)+'%'}</ControlLabel>
                  {' '}
                  <FormControl value={item.fillWidth||100} type="range" min={10} max={100} step={10} onChange={e=>this.setBFillWidth(e.target.value)}/>
                </FormGroup>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={e=>this.setState({bannerModal:false})}>确定</Button>
          </Modal.Footer>
        </Modal>
        <div className="page-buttons">
          <Button onClick={e=>this.submit(e)} bsStyle="primary">保存页面</Button>
          {' '}
          {id&&<Button onClick={e=>this.createHtml(e)} bsStyle='primary'>发布页面</Button>}
          {' '}
          {id&&<Button onClick={e=>{this.setState({qrModal:true})}} bsStyle="primary">查看二维码</Button>}
        </div>
      </div>
    )
  }
}

export default React.createClass(Object.assign({},eventGroup,lifeGroup))
