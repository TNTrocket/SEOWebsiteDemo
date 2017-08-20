import $ from "jquery"
import basic from '../global/basic'
import Swiper from 'swiper'

window.jQuery =$;
require("dotdotdot");

export default class wuyou extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){
    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this)
    }
  }
  btnViewMore(){
    let btnViewMore = $(".btnViewMore");
    if(!btnViewMore.data("btnViewMore")){
      this.footerEvaluate = true;
      btnViewMore.text("收起")
      btnViewMore.data("btnViewMore",true)
    }else{
      btnViewMore.text("查看更多")
      this.footerEvaluate = false;
      btnViewMore.data("btnViewMore",false)
    }
  }
  render(){
    let mySwiper = new Swiper('.swiper-container', {
      autoplay: 5000,
      pagination : '.swiper-pagination',
      paginationElement : 'span',
      autoplayDisableOnInteraction : false,
      paginationClickable :true
    });

    $(".singleTeacher .desc").dotdotdot();
    this.bindEVent();
  }
}