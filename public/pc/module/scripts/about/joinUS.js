import $ from "jquery"
import basic from '../global/basic'
import { fetchCity } from '../global/server'
import { localStorage } from'../global/global'



export default class joinUS extends basic{
  constructor(){
    super();
  }
  initData(){

    let self = this;
    this.cacheCity = JSON.parse((localStorage().get("currentCity") || "{}")).city || "广州市";
    this.eventList={
      "mouseover:.followQRCode":function (e) {
        self.floatWindowCode = true;
      },
      "mouseout:.followQRCode":function(e){
        self.floatWindowCode = false;
      }
    }
  }


  render(){
    fetchCity().then((data)=>{

      this.bindEVent();
    })
  }
}