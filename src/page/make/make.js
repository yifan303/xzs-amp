import React from 'react'
import {render} from 'react-dom'
import _ from 'underscore'
import "widget/common"

var content = document.getElementById('content')

import Nav from 'widget/nav/nav-react.js'
import Page from './page-react.js'

render((
  <div>
    <Nav select="make"/>
    <Page />
  </div>
),content)
