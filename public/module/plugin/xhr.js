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
                "Content-Type" : "application/json"
            }
        }
        this.jQCallApi = this.jQCallApi.bind($)
    }
    jQCallApi(url,options){
        // let deferred = this.Deferred();
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
            window.fetch(url,options).then(function (data) {
                if(data.status == 404){
                    return reject()
                }
                resolve(data)
            }).catch((error) =>{

            })
        })

    }
    simpleCall(url,options){
        options =deepAssign({},this.config,options);
        console.log(options)
        if(window.fetch){
          return  this.fetchCallApi(url,options)
        }else{
           return this.jQCallApi(url,options)
        }
    }

}

export let apiCall = new call()
