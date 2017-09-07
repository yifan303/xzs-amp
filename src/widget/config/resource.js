var url = ''

// 开发环境 host
if(process.env.NODE_ENV==='development'){
  url = '//h5-dev.xianzaishi.net/'
}

// 测试环境 host
if(process.env.NODE_ENV==='qa'){
  url = '//h5.xianzaishi.net/'
}

// 线上环境 host
if(process.env.NODE_ENV==='production'){
  url ='//h5.xianzaishi.com/'
}
export default url
