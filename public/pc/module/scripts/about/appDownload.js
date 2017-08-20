import $ from "jquery"
import basic from '../global/basic'
import { fetchCity } from '../global/server'
import { localStorage } from'../global/global'



export default class appDownload extends basic{
  constructor(){
    super();
  }
  initData(){

    let self = this;
    this.cacheCity = JSON.parse((localStorage().get("currentCity") || "{}")).city || "广州市";
    this.eventList={

    }
  }


  render(){
    fetchCity().then((data)=>{

      this.bindEVent();
    })
  }
}