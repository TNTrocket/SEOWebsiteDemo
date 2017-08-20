import $ from "jquery"
import basic from '../global/basic'
import Swiper from 'swiper'
import demandModal from '../component/demandModal'


export default class successCase extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){

    let self = this;
    this.areaId = "";
    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this),
      "click:.left":function (e) {
        self.mySwiper.slidePrev();
      },
      "click:.right":function (e) {
        self.mySwiper.slideNext();
      },
      "click:.s_button":function (e) {
        new demandModal(
          {
            mask:true
          }
        );
      }
    }
  }
  btnViewMore(){
    let btnViewMore = $(".btnViewMore");
    if(!btnViewMore.data("btnViewMore")){
      this.footerEvaluate = true;
      btnViewMore.text("收起");
      btnViewMore.data("btnViewMore",true);
    }else{
      btnViewMore.text("查看更多");
      this.footerEvaluate = false;
      btnViewMore.data("btnViewMore",false);
    }
  }
  initSwiper(){
    let slide = $(".swiper-slide");
    let count = slide.length;
    let width = slide.width();
    $(".swiper-wrapper").css("width",count*width);
  }

  render(){
      this.initSwiper();
        this.mySwiper = new Swiper('.swiper-container', {
         autoplay: 8000,
         autoplayDisableOnInteraction : false,
         onlyExternal : true
       });
      this.bindEVent();
  }
}