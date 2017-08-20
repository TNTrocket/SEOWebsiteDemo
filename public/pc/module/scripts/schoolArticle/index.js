import $ from "jquery"
import basic from '../global/basic'
import Swiper from 'swiper'
import { fetchCity } from '../global/server'
import { localStorage }from'../global/global'

window.jQuery =$;
require("dotdotdot");

export default class schoolArticle extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){
    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this)
    }
    // this.cacheCity = JSON.parse((localStorage().get('currentCity') || "{}")).city || "广州市";
    this.currentCity = '';
  }
  btnViewMore(){
    let btnViewMore = $(".btnViewMore");
    if(!btnViewMore.data("btnViewMore")){
      this.footerEvaluate = true;
      btnViewMore.text("收起");
      btnViewMore.data("btnViewMore",true)
    }else{
      btnViewMore.text("查看更多");
      this.footerEvaluate = false;
      btnViewMore.data("btnViewMore",false)
    }
  }
  render(){
      let self = this;
      let mySwiper = new Swiper('.swiper-container', {
        autoplay: 5000,
        pagination : '.swiper-pagination',
        paginationElement : 'span',
        autoplayDisableOnInteraction : false,
        paginationClickable :true
      })
      $(".singleTeacher .desc").dotdotdot();
      this.bindEVent();
  }
}