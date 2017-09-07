import React from 'react'
import {render} from 'react-dom'
import "widget/common"
import Nav from 'widget/nav/nav-react.js'
import Page from './page.js'

var content = document.getElementById('content')

render((
  <div>
    <Nav select="mode"/>
    <Page />
  </div>
),content)
