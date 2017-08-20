import $ from 'jquery'


export  function evaluate() {
  let viewMoreEvaluateBtn = $(".viewMoreEvaluateBtn");
  let evaluate = $(".evaluate");
  let packUpEvaluate = $(".packUpEvaluate")
  viewMoreEvaluateBtn.click(function () {
    evaluate.show();
    viewMoreEvaluateBtn.hide();
    packUpEvaluate.show();
  })
  packUpEvaluate.click(function () {
    evaluate.hide();
    viewMoreEvaluateBtn.show();
    packUpEvaluate.hide();
  })
}
export function navEvent() {
  let navMoreList = $(".navMoreList");
  $(".homePageNav a").click(function () {
    let nav = $(this).data("nav");
    switch (nav){
      case "more":
        $(this).toggleClass("blueColor");
        navMoreList.toggleClass("toggleList");
        break;
    }
  })
}

export function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2]; return null;
}

export function localStorage() {
  function set(name,value) {
    if(typeof value === "object"){
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(name,value)
  }
  function get(name) {
    return window.localStorage.getItem(name)
  }
  function remove(name) {
    window.localStorage.removeItem(name)
  }
  function clear() {
    window.localStorage.clear()
  }

  return{
    get : get,
    set : set,
    remove : remove,
    clearLocationStorage : clear
  }
}


export function isEmptyObject(e) {
  let t;
  for (t in e){
    return false;
  }
  return true
}

export function cookie() {
  function set(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  function get(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  function clear(name) {
    set(name,'',-1)
  }
  return{
    set : set,
    get : get,
    clear : clear
  }
}

export  function parseParams(queryString){
  if (!queryString){
    return [];
  }
  let alphabets = queryString.match(/[a-z]+/g);
  let params = queryString.match(/\d+/g);
  let obj = {};
  obj.arr =[];
  for (let i = 0; i < params.length; i++) {
    obj.arr.push(alphabets[i] + params[i])
    obj[alphabets[i]] = alphabets[i] + params[i]
  }
  return obj;
}

export function footerEvaluate(){

}