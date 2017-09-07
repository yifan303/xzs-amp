import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import {render} from 'react-dom'

var Alert = React.createClass({
  show(message,title){
    this.setState({
      show:true,
      message,
      title:title||''
    })
  },
  getInitialState(){
    return {
      show:false,
      title:'',
      message:''
    }
  },
  render(){
    return (
      <Modal show={this.state.show} onHide={e=>this.setState({show:false})}>
        <Modal.Header>
          <Modal.Title>{this.state.title||"alert"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{this.state.message}</h5>
        </Modal.Body>
      </Modal>
    )
  }
})

var message = document.createElement('div')

var instance = render(<Alert />,message)

export default {
  show(){
    instance.show.apply(instance,arguments)
  }
}
