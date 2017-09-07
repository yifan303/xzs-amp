
const bannerSign='banner';
const bannerStore={
  set(url){
    var list=this.get()
    list.unshift(url)
    return window.localStorage.setItem(bannerSign,JSON.stringify(list))
  },
  get(){
    return JSON.parse(window.localStorage.getItem(bannerSign)||'[]')
  },
  del(url){
    var list=this.get()
    var nlist=list.filter(item=>item!==url)
    return window.localStorage.setItem(bannerSign,JSON.stringify(nlist))
  }
};

export default {
  bannerStore
}
