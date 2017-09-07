import React from 'react'
import Upload from 'widget/upload/upload-react.js'
import resource from 'widget/config/resource.js'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import Clipboard from 'clipboard'


var clip = new Clipboard('.copy',{
  text(trigger){
    return trigger.getAttribute('data-text')
  }
})

clip.on('success',function(){

})

export default React.createClass({
  getInitialState(){
    return {
      list:[]
    }
  },
  getImages(){
    var promise = $.ajax('/api/image/all.json')
    promise.done(result=>{
      if(result.code===1){
        this.setState({list:result.msg})
      }
    })
  },
  componentDidMount(){
    this.getImages()
  },
  render(){
    var host = 'http:'+resource;
    return (
      <div>
        <div className="image-upload">
          <Upload onUpload={e=>this.getImages()}/>
        </div>
        <div className="image-body">
          {this.state.list.map(img=>(
            <div key={img._id} className="image-img">
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={img.url}>{host+'/'+img.url}</Tooltip>}>
                <img src={host+'/'+img.url} />
              </OverlayTrigger>
              <a data-text={host+'/'+img.url} className="btn btn-primary btn-xs copy" >复制</a>
            </div>
          ))}
        </div>
      </div>
    )
  }
})
