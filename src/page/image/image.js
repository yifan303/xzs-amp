import React from 'react'
import {render} from 'react-dom'
import _ from 'underscore'
import "widget/common"
import "./image.less"
import Body from './body.js'

var content = document.getElementById('content')

import Nav from 'widget/nav/nav-react.js'

render((
  <div>
    <Nav select="image" />
    <div className="image-upload">
      <Body />
    </div>
  </div>
),content)
