import $ from "jquery"
import basic from '../global/basic'
import { fetchCity } from '../global/server'
import { localStorage }from'../global/global'
import handlebars from 'handlebars'
import demandModal from '../component/demandModal'

export default class teacherDetail extends basic{
  constructor(){
    super();
  }
  initData(){
    let self = this;
    this.gradeCode ="";
    this.areacode = null;
    this.commentType = "";
    this.goodCommentList = $(".goodCommentList");
    this.midCommentList = $(".midCommentList");
    this.badCommentList = $(".badCommentList");

    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this),
      "click:.bookBtn":function (e) {
        new demandModal({
          mask:true,
          areaId : self.cityAreaId || self.areacode,
          realname : self.gradeCode
        })
      },
      "click:[data-grade]":function (e) {
        self.gradeCode = $(this).data("grade");
        $(this).addClass("queryListActive").closest('li').siblings("li").children("a").removeClass("queryListActive");
      },
      "click:[data-areacode]":function (e) {
        self.areacode = $(this).data("areacode");
        $(this).addClass("queryListActive").closest('li').siblings("li").children("a").removeClass("queryListActive");
      },
      "click:[data-comment]":function (e) {
        self.commentType = $(this).data("comment");
        $(this).addClass("queryListActive").siblings("li").removeClass("queryListActive");
        switch (self.commentType){
          case "good":
            self.goodCommentList.fadeIn().siblings("div").hide();
            break;
          case "mid":
            self.midCommentList.fadeIn().siblings("div").hide();
            break;
          case "bad":
            self.badCommentList.fadeIn().siblings("div").hide();
            break;
        }

      }
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
  initArea(){
    let areaTpl = $("#areaTpl").html();
    let areaTplDom = handlebars.compile(areaTpl);
    let areaTplHtml = areaTplDom(this.areaArr);
    $(".areaTemp").append(areaTplHtml);
  }
  render(){
      this.areaArr = this.fecthCityData.city[this.cacheCity];
      this.cityAreaId = this.fecthCityData.cityCode[this.cacheCity].code;
      this.initArea();
      this.bindEVent();
  }
}