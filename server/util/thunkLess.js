module.exports = (less,globalVar) => (callback) =>{
  var globalVars = Object.assign({},globalVar||{},{
    base:750/10+"rem"
  })
  return require('less').render(less,{globalVars},callback)
}
