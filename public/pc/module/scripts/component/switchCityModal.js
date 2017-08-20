import $ from 'jquery'
import pcModal from './pcModal'
import handlebars from 'handlebars'
import dispatch from '../global/dispatch'
import { localStorage } from '../global/global'



export  default  class switchCityModal extends pcModal {
  constructor(option,callback) {
    super(option);
    this.cityArr =option.cityArr;
    this.city = option.city || "广州市";
    this.init();
  }
  init(){
    let self = this;
    let pageType = $("#pageType").data("pagetype");
    this.event = {
     "click:[data-pinyin]":function (e) {
       let pathName = window.location.pathname;
       let pinyin = $(this).data("pinyin");
       let name = $(this).data("cityname");
       let obj = JSON.parse((localStorage().get('currentCity') || "{}"));
       obj.city = name
       localStorage().set("currentCity",obj);
       if(pageType !== "homePage"){
         window.location.href = ""+
           pathName.replace(CONFIG.cityPinyin,pinyin).replace(CONFIG.cityPinyin.toLowerCase(),pinyin);
       }else{
         window.location.href ="/"+pinyin +"?local=true";
       }

     },
      "click:.close":function (e) {
        self.hide();
      }
    };
    this.element = ".switchCityModal";
    let template = '<div class="switchCityModal globalModal">' +
      '<p class="title">当前城市为：<span class="cityModalTxt">'+this.city+'</span></p>' +
      '<ul>{{#each this}}'+
      '<li data-pinyin="{{code}}" data-cityname="{{name}}">{{name}}</li>{{/each}}'+
      '</ul>'+
      '<div class="close">关闭</div>'+
      '</div>';
    let templateDom = handlebars.compile(template);
    let templateHtml = templateDom(this.cityArr);
    this.dom = templateHtml;
    super.init();
    dispatch.on("cityChange",function (data) {
      $(".cityModalTxt").text(data)
    })
  }
}