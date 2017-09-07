import _ from 'underscore'
import html from './nav.html'
import "./nav.less"

export default (select)=>{
  return _.template(html)({select})
}
