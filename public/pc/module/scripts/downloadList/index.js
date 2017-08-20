import $ from "jquery"
import basic from '../global/basic'
import Swiper from 'swiper'

window.jQuery =$;
require("dotdotdot");

export default class downloadList extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){
    // this.eventList={
    //
    // }
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