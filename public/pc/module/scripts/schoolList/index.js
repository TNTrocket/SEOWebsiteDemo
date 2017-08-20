import $ from "jquery"
import basic from '../global/basic'
import Swiper from 'swiper'
import handlebars from 'handlebars'

window.jQuery =$;
require("dotdotdot");

export default class schoolList extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){
    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this)
    };

    this.regionArr = [];
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
    let queryString = CONFIG.queryString.substring(7);
    let active = false;
    let unlimitActive = false;
    this.fecthCityData.city[this.currentCity].forEach(function (value, index) {
      let typeno = "b" + (index + 1);
      let indexParse = queryString;
      if (indexParse.indexOf("b") > -1) {
        active = indexParse.match(/b\d+/)[0] === typeno;
        typeno = indexParse.replace(/b\d+/, typeno);
      } else {
        unlimitActive = true;
        typeno = indexParse + typeno;
      }
      if (index === 0) {
        let unlimit = indexParse.replace(/b\d+/, "");
        self.regionArr.unshift({typeno: unlimit, active: unlimitActive})
      }
      let temp = {name: value.itemName, code: value.code, typeno: typeno, active: active};
      self.regionArr.push(temp);
    });
    let tempDom = $("#regionTpl").html();
    let areaTemp = handlebars.compile(tempDom);
    let areaHtml = areaTemp(this.regionArr);

    $(".navAndQuery .query").append(areaHtml);
    let mySwiper = new Swiper('.swiper-container', {
      autoplay: 5000,
      pagination: '.swiper-pagination',
      paginationElement: 'span',
      autoplayDisableOnInteraction: false,
      paginationClickable: true
    });
    $(".singleTeacher .desc").dotdotdot();
    this.bindEVent();
  }
}