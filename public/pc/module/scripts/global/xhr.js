/**
 * Created by Administrator on 2017/6/16.
 */
import $ from 'jquery'
import deepAssign from 'deep-assign'

class call{
  constructor(){
    this.config = {
      method : "post",
      headers : {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      }
    }
    this.jQCallApi = this.jQCallApi.bind($)
  }
  jQCallApi(url,options){
    let self = this;
    return new Promise((resolve,reject) => {
      self.ajax(url,options).done(function (data, textStatus, jqXHR) {
        resolve(data)
      }).fail(function (jqXHR, textStatus, errorThrown) {
        reject(jqXHR, textStatus, errorThrown);
      })
    })

  }
  fetchCallApi(url,options){
    return  new Promise((resolve,reject) => {
      window.fetch(url,options).then(function (response) {
        console.log(response);
        if(response.status === 404){
          return reject()
        }
        if(response.ok === false){
          return reject()
        }
        return response.json()
      }).then(function (data) {
        console.log(data)
        resolve(data)
      }).catch((error) =>{
        console.log(error)
      })
    })
  }
  simpleCall(url,options,type){
    options =deepAssign({},this.config,options);
    type = type!==false;
    if(window.fetch && type){
      if(options.method === "get"){
        url = this.packageUrl(url,options);
        console.log(url);
      }
      if(options.data && options.method === "post"){
        options.body = options.data;
      }
      return  this.fetchCallApi(url,options)
    }else{
      return this.jQCallApi(url,options)
    }
  }
  packageUrl(url,options) {
    if(options.data){
      url = url+ "?"
      for (let a of Object.keys(options.data)){
        url = url + a + "="+options.data[a]+"&";
      }
    }

    return url.replace(/\&$/,"");
  }

}

export let apiCall = new call();
