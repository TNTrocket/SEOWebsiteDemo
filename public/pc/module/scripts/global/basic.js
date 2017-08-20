import $ from 'jquery'
import { isEmptyObject } from './global'
import { fetchCity } from '../global/server'
import { localStorage, cookie }from'../global/global'
import dispatch from '../global/dispatch'
import switchCityModal from '../component/switchCityModal'
import handlebars from 'handlebars'


/**
  *pc端基类
 */
export default class basic{
  constructor(option){
    if(option) {
      this.isHomePage = option.isHomePage;
      this.isNeedFetchCity = option.isNeedFetchCity;
    }
    this.init();
  }
  init(){
    if(!this.isHomePage){
     this.isNeedFetchCity ? this.isFetchCity() : this.commonInit();
     return false;
    }
    this.commonInit();
  }
  isFetchCity(){
    this.currentCity = JSON.parse((localStorage().get('currentCity') || "{}")).city || "广州市";
    fetchCity().then((data)=> {
      this.fecthCityData = data;
      this.cityId = this.fecthCityData.cityCode[this.currentCity].code;
      this.cityArr = this.fecthCityData.locationCode;
      this.areaArr = this.fecthCityData.city[this.currentCity];
      let footerAreaTpl = $("#footerAreaTpl").html();
      let footerAreaTplDom = handlebars.compile(footerAreaTpl);
      let footerAreaTplHtml = footerAreaTplDom(this.areaArr);
      $(".footerQuery .areaBox .area").html(footerAreaTplHtml);
      for(let value of data.locationCode){
        if(value.code === CONFIG.cityPinyin){
          this.initFooterCity(value.name);
          break;
        }
      }
      $(".switchCity .city").text(this.currentCity.replace(/市$/,""));
     this.commonInit();
    })
  }
  commonInit(){
    this.initData();
    this.render();
    this.initCookie();
    this.isNeedFetchCity && this.switchCityBasic();
  }
  initCookie(){
    let city = CONFIG.cityPinyin;
    if(city){
      cookie().set("cityPinyin",city,1)
    }
  }
  switchCityBasic(){
    $(".switchCity").click(()=>{
        new switchCityModal({
          cityArr : this.cityArr,
          mask : true
        });
        dispatch.emit("cityChange",this.currentCity);
    })
  }
  initData(){

  }
  render(){

  }
  bindEVent(){
    if(!isEmptyObject(this.eventList)){
      for(let a of Object.keys(this.eventList)){
        let event = a.split(":");
        $(event[1]).on(event[0],this.eventList[a])
      }
    }
  }
  initFooterCity(cityName){
    $(".cityPlace").text(cityName);
  }

  get footerEvaluate(){
    let footerEvaluate = $(".footerEvaluate");
    if(this.evaluate){
      footerEvaluate.show();
    }else{
      footerEvaluate.hide();
    }
  }
  set footerEvaluate(value){
    this.evaluate = value;
    this.footerEvaluate
  }

  get floatWindowCode(){
    let f_QRCode = $(".f_QRCode");
    if(this.isNeedFloatWindowCode){
      f_QRCode.show();
    }else{
      f_QRCode.hide();
    }
  }
  set floatWindowCode(value){
    this.isNeedFloatWindowCode = value;
    this.floatWindowCode
  }
}