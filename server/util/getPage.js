// 生成页面的外壳
var path = require('path')
var fs = require('fs')
var config = require('./config.js')

var nodeModulesPath=path.join(process.cwd(),'node_modules')

var zeptoJs = fs.readFileSync(path.join(nodeModulesPath,'zepto','dist','zepto.min.js'))
var remJs = fs.readFileSync(require.resolve('dwd-rem'))
var hybirdJs = fs.readFileSync(require.resolve('xzs-hybird'))
var messageJs = fs.readFileSync(require.resolve('xzs-message'))
var utilJs = fs.readFileSync(require.resolve('xzs-util'))
var underscoreJs = fs.readFileSync(path.join(nodeModulesPath,'underscore','underscore-min.js'))
var domain = config.isProd?"'.xianzaishi.com'":"'.xianzaishi.net'"
var itemUrl = config.isProd?'//item.xianzaishi.com':'//item.xianzaishi.net/wapcenter'
var mUrl = config.isProd?'//m.xianzaishi.com/mobile':'//m.xianzaishi.net/mobile'
var tradeUrl = config.isProd?'//trade.xianzaishi.com':'//trade.xianzaishi.net'

module.exports = (html,globalStyle,title) => {
  var styleStr = `
    background-color:${globalStyle.backgroundColor};
    background-image:${globalStyle.backgroundImage||'none'};
  `

  // 跳详情页  领取优惠卷  回到顶部
  var pageScript = `
    $(function(){

      var hybird = window["xzs-hybird"].default;
      var content = $(document);
      var isApp = function(){ return hybird.isAndroid()||hybird.isIos();} ;
      var openDetail = function(itemId){
        if(isApp()){
          hybird.openDetail(itemId)
        }else{
          window.location.href='${mUrl}/detail.html?id='+itemId
        }
      }

      content.on('click','a[detail]',function(e){
        var element=$(e.currentTarget);
        openDetail(element.attr('detail'));
      });
      content.on('click','a[data-detail]',function(e){
        var element=$(e.currentTarget);
        openDetail(element.attr('data-detail'));
      })
      content.on('click','.backToTop',function(e){
        $(window).scrollTop(0);
      });

      var cookie = window["xzs-util"].cookie;
      var domain = ${domain} ;
      var isNew = function(){ return hybird.getToken()!==undefined; };
      var message = function(str){
        return window['xzs-message'].default(str)
      };
      var tokenSign = 'token';
      var token = {
        get:function(){
          if(isApp()&&isNew()){
            return hybird.getToken()
          }
          return cookie.get(tokenSign)
        },
        set:function(tokenValue){
          if(isApp()&&isNew()){
            return hybird.sendToken(tokenValue)
          }
          return cookie.set(tokenSign,tokenValue,7,domain)
        },
        clear:function(){
          if(isApp()&&isNew()){
            return
          }
          return this.set('')
        }
      }
      var checkCache = null;
      var loginCheck = function(callback){
        var cb = callback||function(){}
        var tokenValue = token.get()
        if(!tokenValue){
          return cb(false)
        }
        if(checkCache){
          return cb(true,checkCache)
        }
        $.ajax({
          url:'${itemUrl}/requestuser/mine',
          contentType:'text/plain',
          processData:false,
          dataType:'html',
          type:'post',
          data:JSON.stringify({
            token:tokenValue
          }),
          success:function(res){
            var result = JSON.parse(res)
            if(result.success){
              cb(result.success,result.module)
              checkCache = result.module
            }else{
              cb(false)
            }
          }
        })
      }
      var during = 5000;
      var gotoLogin = function(){
        window.location.href='${mUrl}/login.html?redicret='+window.escape(window.location.href);
      };
      $('a[data-coupon]').on('click',function(e){
        var element=$(e.currentTarget);
        var callUrl = element.attr('data-url')
        var couponIds = (element.attr('data-coupon')||'').replace(/\\s/g,'').split(/[,，]/)

        loginCheck(function(sign,modules){
          if(sign){
            $.ajax({
              url:'${itemUrl}/promotion/sendDiscountCoupon',
              contentType:'application/json',
              type:'POST',
              data:'{"version":1,"src":"H5","data":{"token":"'+token.get()+'","key":"'+couponIds.join(',')+'"},"appversion":"1"}',
              success:function(res){
                var result = JSON.parse(res)
                if(result.success){
                  if(result.errorMsg&&result.errorMsg.indexOf('已拥有')>-1){
                    return message(result.errorMsg,during)
                  }
                  return message('优惠卷领取成功')
                }else{
                  message(result.errorMsg,during)
                }
              }
            })
          }else{
            gotoLogin()
          }
        });
      })
      var addItemToCart = function(itemId,skuId){
        if(isApp()){
          hybird.addItemToCart(itemId,skuId);
        }else{
          openDetail(itemId)
        }
      };
      var animatePit = function(dom){
        var img = dom.attr('data-img');
        if(!img){
          return
        }
        var imgDom = $('<img class="pit-animate" src="'+img+'"/>').css({
          top:dom.offset().top-$(window).scrollTop(),
          left:dom.offset().left
        })
        $('body').append(imgDom)
        window.setTimeout(function(){
          imgDom.css({
            left:'8rem',
            top:'-2rem',
            transform:'rotate(180deg)'
          })
          window.setTimeout(function(){
            imgDom.remove()
          },800)
        },10)
      };
      content.on('click','a[data-sku]',function(e){
        var element=$(e.currentTarget);
        var skuId = element.attr('data-sku');
        var itemId = element.attr('data-item');
        addItemToCart(itemId,skuId);
        if(isApp()&&token.get()){
          animatePit(element);
        }
      });

    })
  `

  // 渲染前端坑位
  var pitRenderScript = `
    $(function(){
      var pits = _.toArray($('.m-pit div[data-ids]'))
      var url = '${config.requestGoodsUrl.replace('http:','')}'
      var requestPit = function(){
        if(pits.length===0){
          return
        }
        var pit = $(pits.shift())
        var template = pit.find('script[type="text/template"]')
        $.ajax({
          url:url,
          type:'post',
          data:JSON.stringify({
            version:1,
            appversion:1,
            src:'h5',
            data:pit.attr('data-ids').split(',')
          }),
          contentType:'application/json',
          success(result){
            var res = JSON.parse(result)
            if(res.success){
              pit.append(_.template(template.html())({list:res.module||[]}))
            }
            requestPit()
          }
        });
      }
      requestPit()
    })
  `

  return (
    `<html style="${styleStr}">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <script type="text/javascript">${remJs}</script>
        <script type="text/javascript">${zeptoJs}</script>
        <script type="text/javascript">${hybirdJs}</script>
        <script type="text/javascript">
          $(function(){
            ${messageJs}
          })
        </script>
        <script type="text/javascript">${utilJs}</script>
        <script type="text/javascript">${pageScript}</script>
        <script type="text/javascript">${underscoreJs}</script>
        <script type="text/javascript">${pitRenderScript}</script>
        <style>
          p,body,html{
            margin:0;
            padding:0;
            font-family: sans-serif;
          }
          .client-hidden{
            display:none;
          }
          html{
            -webkit-font-smoothing: antialiased;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            outline: 0;
          }
          body{
            width:10rem;
            margin:0 auto;
          }
          .pit-animate{
            position:fixed;
            transform:rotate(0);
            transform-origin:50% 50%;
            transition:left .8s ease-in-out 0s,top .8s ease-in-out 0s,transform .8s ease-in-out 0s;
            width:2rem;
            height:2rem;
            border-radius:50%;
            border:2px solid #ddd;
            overflow:hidden;
            z-index:10;
          }
        </style>
      </head>
      <body>${html}</body>
    </html>`
  )
}
