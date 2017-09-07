import React from 'react'
import {render} from 'react-dom'
import _ from 'underscore'

var content = document.getElementById('content')

import Nav from 'widget/nav/nav-react.js'
import List from './list.js'

render((
  <div>
    <Nav select="pit"/>
    <List />
  </div>
),content)
