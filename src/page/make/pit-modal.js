import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import HelpBlock from 'react-bootstrap/lib/HelpBlock'
import msg from 'widget/msg'

export default React.createClass({
  getInitialState(){
    return {
      data:{},
      pending:false
    }
  },
  componentDidMount(){
    this.setState({data:this.props.pitModalData})
  },
  componentWillReceiveProps(props){
    this.setState({
      data:props.pitModalData
    })
  },
  getValidationState(){
    var {goodIds} = this.state.data
    if(!goodIds){
      return 'error'
    }
    var ids = goodIds.split(',')
    if(ids.length===1&&ids[0]===''){
      return 'error';
    }
    for(var i=0;i<ids.length;i++){
      var num = parseInt(ids[i])
      if(num!==num){
        return 'error'
      }
    }
    return 'success'
  },
  submit(){
    var validState = this.getValidationState()
    var {onSuccess,onHide} = this.props
    var {data} = this.state
    if(validState === 'error'){
      return false
    }
    this.setState({pending:true})
    var promise = $.ajax('/api/pit/html.json',{
      data:{
        ids:data.goodIds,
        pit:data._id,
        backgroundColor:data.backgroundColor
      }
    })
    promise.done(result=>{
      if(result.code===1){
        var data = Object.assign({},this.state.data)
        var {html,htmlTemplate,style,ids} = result.msg
        data.html = html
        data.htmlTemplate = htmlTemplate
        data.style = style
        onSuccess&&onSuccess(data)
        onHide&&onHide()
      }else{
        msg.show(result.msg)
        onHide&&onHide()
      }
    })
    promise.always(()=>{
      this.setState({pending:false})
    })
  },
  render(){
    var {pitModal,onHide} = this.props
    var {data,pending} = this.state
    return (
      <Modal show={pitModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>坑位设置</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <ControlLabel>商品id</ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder="输入商品skuId,以逗号分割"
              value={this.state.data.goodIds}
              onChange={e=>{
                var data = Object.assign({},this.state.data)
                data.goodIds = e.target.value.replace('，',',').replace(/[^0-9\,]/g,'')
                this.setState({data})
              }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>背景色</ControlLabel>
            <FormControl type="color" value={this.state.data.backgroundColor} onChange={e=>{
              var result = Object.assign({},this.state.data)
              result.backgroundColor = e.target.value
              this.setState({data:result})
            }}/>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          {pending&&<Button bsStyle="primary" disabled>正在获取数据</Button>}
          {!pending&&<Button onClick={e=>this.submit(e)} bsStyle="primary">确定</Button>}
        </Modal.Footer>
      </Modal>
    )
  }
})
