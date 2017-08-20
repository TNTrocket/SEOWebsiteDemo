import $ from 'jquery'
import basic from '../global/basic'
import alert from '../component/alert'
import demandModal from '../component/demandModal'
import switchCityModal from '../component/switchCityModal'
import { fetchCity, searchCity } from '../global/server'
import { localStorage, getQueryString } from '../global/global'
import { isSearchCity } from '../global/isSearchCity'
import dispatch from '../global/dispatch'
import handlebars from 'handlebars'
import normalModal from '../component/normalModal'

window.jQuery = $;
require("dotdotdot");

export default class homePage extends basic{
   constructor(){
    super({
      isHomePage:true
    });
  }
  initData(){
    let h_primaryUL = $(".h_primaryUL");
    let h_midUL = $(".h_midUL");
    let h_highUL = $(".h_highUL");
    let allcourse = $(".allCourse");
    let self = this;
    this.eventList = {
     "mouseover:[data-allcourse]": function (e) {
        let allcourse = $(this).data("allcourse");
        $(this).addClass("queryListActive").siblings("div").removeClass("queryListActive");
        switch (allcourse){
          case "primarySchool":
            h_primaryUL.show().siblings("ul").hide();
            break;
          case "middleSchool":
            h_midUL.show().siblings("ul").hide();
            break;
          case "highSchool":
            h_highUL.show().siblings("ul").hide();
            break;
        }
     },
      "mouseout:.allCourse":function (e) {
        e.stopPropagation();
        allcourse.hide();
      },
      "mouseover:[data-course='homePage']":function (e) {
        e.stopPropagation();
        allcourse.show();
      },
      "mouseout:[data-course='homePage']":function (e) {
        e.stopPropagation();
        allcourse.hide();
      },
      "click:.btnViewMore":this.btnViewMore.bind(this),
      "click:.left":function (e) {
        self.phoneBoxSwiper.slidePrev();
      },
      "click:.right":function (e) {
        self.phoneBoxSwiper.slideNext();
      },
      "mouseover:.followQRCode":function (e) {
        self.floatWindowCode = true;
      },
      "mouseout:.followQRCode":function(e){
        self.floatWindowCode = false;
      },
      "click:.f_b_btn":this.bookTeacher.bind(this),

      "click:.switchCity":(e)=>{
        new switchCityModal({
          cityArr : this.cityArr,
          mask : true
        });
        dispatch.emit("cityChange",this.currentCity);
      }
   }
  }
  bookTeacher(){
    let name = $("input[name='name']").val();
    let grade = $("input[name='grade']").val();
    let subject = $("input[name='subject']").val();
    if(!name){
      new alert({text:'请输入姓名',mask:true});
      return false;
    }
    if(!grade){
      new alert({text:'请输入年级',mask:true});
      return false;
    }
    if(!subject){
      new alert({text:'请输入科目',mask:true});
      return false;
    }

    new demandModal({
      mask:true,
      realname:name+"、"+grade+subject,
      areaId : this.cityId
    });
  }

  initBanner(){
    let bannerCount = $(".bannerSwiper").length;
    $(".bannerWrapper").css("width",bannerCount*100+"%");
  }
  initPhoneBoxSwiper(){
    let slide = $(".b_slide");
    let count = slide.length;
    let width = slide.width();
    $(".phoneBox-wrapper").css("width",count*width);
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
  initFooterArea(){
   let footerAreaTpl = $("#footerAreaTpl").html();
   let footerAreaTplDom = handlebars.compile(footerAreaTpl);
   let footerAreaTplHtml = footerAreaTplDom(this.areaArr);
   $(".footerQuery .areaBox .area").html(footerAreaTplHtml);
  }
   commonRender(){
     this.cityId = this.data.cityCode[this.currentCity].code;
     this.cityArr = this.data.locationCode;
     this.areaArr = this.data.city[this.currentCity];
     this.initBanner();
     this.initPhoneBoxSwiper();
     let mySwiper = new Swiper('.homeBanner', {
       autoplay: 5000,
       pagination: '.swiper-pagination',
       paginationElement: 'span',
       autoplayDisableOnInteraction: false,
       paginationClickable: true
     });
     this.phoneBoxSwiper = new Swiper('.phoneBox_swiper', {
       autoplay: 8000,
       autoplayDisableOnInteraction: false,
       onlyExternal: true
     });
     $(".teacherTxt .desc").dotdotdot();
     $(".switchCity .city").text(this.currentCity.replace(/市$/,""));
     this.initFooterArea();
     for(let value of this.data.locationCode){
       if(value.code === CONFIG.cityPinyin){
         this.initFooterCity(value.name);
         break;
       }
     }
     this.bindEVent();
   }

   render(){
   this.currentCity = JSON.parse((localStorage().get('currentCity') || "{}")).city || "广州市";
   fetchCity().then((data)=>{

     this.data = data;
      if(isSearchCity()){
        let cityNameList = Object.keys(data.city);
        searchCity().then((city) => {
          let nowTime = new Date().getTime();
          let currentCityObj = null;
          let cityNow = cityNameList.indexOf(city) > -1 ? city : "广州市";
          if(cityNow !== this.currentCity){
            if(getQueryString("local") !== "true") {

              new normalModal({
                txt: "当前城市定位为" + cityNow + "是否切换？",
                mask: true
              });
              dispatch.on("modalConfirm", function () {
                currentCityObj = {
                  city: cityNow,
                  time: nowTime
                };
                localStorage().set("currentCity", currentCityObj);
                window.location.href = "/" + data.cityCode[cityNow].pinyin
              });
              dispatch.on("modalCancel", function () {

              });
              this.commonRender();
              return false;
            }

          }else{
            this.currentCity = cityNow
          }

          currentCityObj = {
            city: this.currentCity,
            time: nowTime
          };
          localStorage().set("currentCity", currentCityObj);
          this.commonRender();
        })

      }else{
        this.commonRender();
      }
   })
  }
}