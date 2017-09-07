import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import resource from 'widget/config/resource.js'

export default React.createClass({

  render(){
    var {name,modal,onHide} = this.props
    var url = `https:${resource}/${name}.html`
    return (
      <Modal show={modal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>页面二维码</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{textAlign:"center"}}>
            <img style={{"width":300,"height":300}} src={`http://qr.liantu.com/api.php?text=${url}`} />
            <p>页面发布后，使用app扫描上面二维码</p>
            <p>页面url:<a href={url} target="_blank">{url}</a></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide} bsStyle="primary">确定</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})
