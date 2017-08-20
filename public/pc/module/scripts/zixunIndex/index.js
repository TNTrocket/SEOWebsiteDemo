import $ from 'jquery'
import basic from '../global/basic'
import Swiper from 'swiper'
import { fetchCity,searchGradeAndSubject} from '../global/server'
import handlebars from 'handlebars'
import demandModal from '../component/demandModal'

window.jQuery =$;
require("dotdotdot");

export default class zixunIndex extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){
    this.wuyou = $(".z_wuyou_box");
    this.xiazai = $(".z_xiazai_box");
    this.schoolList = $(".z_schoolList_box");
    this.wuyouBox = $(".z_wuyou_box .z_x_box");
    this.xiazaiBox = $(".z_xiazai_box .z_x_box");
    this.schoolListBox = $(".z_schoolList_box .z_x_box");
    this.r_city = [];
    this.r_grade = [];
    this.r_subject = [];
    this.areaId = "";
    this.relname ="";
    this.relsubject = "";
    let self = this;
    this.eventList = {
      "click:.btnViewMore":this.btnViewMore.bind(this),
      "click:[data-wuyoustep]": function (e) {
        let page = $(this).data("wuyoustep") || 0;
        let width = self.wuyouBox.eq(0).width();
        let change = -page * width;
        self.move(change,self.wuyou,$(this));
      },
      "click:[data-xiazai]": function (e) {
        let page = $(this).data("xiazai") || 0;
        let width = self.xiazaiBox.eq(0).width();
        let change = -page * width;
        self.move(change,self.xiazai,$(this));
      },
      "click:[data-school]": function (e) {
        let page = $(this).data("school") || 0;
        let width = self.schoolListBox.eq(0).width();
        let change = -page * width;
        self.move(change,self.schoolList,$(this));
      },
      "click:[data-rightform]":function (e) {
        e.stopPropagation();
        $(this).children(".listUl").slideDown("fast");
        $(this).siblings("div").children(".listUl").hide();
      },
      "click:body":function (e) {
        e.stopPropagation();
        $(".listUl").hide();
      },
      "click:.listUl li":function (e) {
        e.stopPropagation();
        e.preventDefault();
        let rightform = $(this).closest("div").data("rightform");
        let code = $(this).data("rcode");
        let name = $(this).data("rname");
        switch (rightform){
          case "city":
            self.areaId = code;
            break;
          case "grade":
            self.relname = name;
            break;
          case "subject":
            self.relsubject = name;
            break;
        }
        $(this).closest("ul").hide().siblings(".txt").children("span").text(name);
      },
      "click:.bookForFree":function (e) {
        new demandModal({
          mask : true,
          areaId : self.areaId,
          realname : self.relname + self.relsubject
        })
      }
    }
  }
  move(distance,dom,target){
    target.addClass("blueColor").siblings("li").removeClass("blueColor");
    dom.css({
      "-webkit-transform": "translate3d(" + distance + "px,0,0)",
      "-webkit-transition": "-webkit-transform 1s ease",
      "transform": "translate3d(" + distance + "px,0,0)",
      "transition": "-webkit-transform 1s ease"
    });
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
  initRightForm(){
    let r_listTpl = $("#r_list").html();
    let r_listDom = handlebars.compile(r_listTpl);
    let r_cityHtml = r_listDom(this.r_city);
    let r_gradeHtml = r_listDom(this.r_grade);
    let r_subjectHtml = r_listDom(this.r_subject);
    $(".r_city").append(r_cityHtml);
    $(".r_grade").append(r_gradeHtml);
    $(".r_subject").append(r_subjectHtml);
  }
  initQueryDom(){
    let zixunIndexTpl = $("#zixunIndexTpl").html();
    let zixunIndexTplDom = handlebars.compile(zixunIndexTpl);
    let zixunIndexTplHtml = zixunIndexTplDom(this.r_grade);
    $(".z_x_query .grade").append(zixunIndexTplHtml);
  }
  render(){
    let wuyouBox = this.wuyouBox.length;
    let schoolListBox = this.schoolListBox.length;
    let xiazaiBox = this.xiazaiBox.length;


    this.wuyou.css("width",wuyouBox*100+"%");
    this.xiazai.css("width",xiazaiBox*100+"%");
    this.schoolList.css("width",schoolListBox*100+"%");


    let mySwiper = new Swiper('.swiper-container', {
      autoplay: 5000,
      pagination : '.swiper-pagination',
      paginationElement : 'span',
      autoplayDisableOnInteraction : false,
      paginationClickable :true
    });
      for(let a in this.fecthCityData.cityCode){
        this.r_city.push({
          name : a,
          code : this.fecthCityData.cityCode[a].code,
          pinyin : this.fecthCityData.cityCode[a].pinyin
        })
      }
      searchGradeAndSubject({
        method: "get"
      }).then((result)=>{
        for(let key in result.a){
          this.r_grade.push({
            name : result.a[key].name,
            typeno : result.a[key].aNO,
            code : result.a[key].code
          })
        }
        for(let bkey in result.b){
          this.r_subject.push({
            name : result.b[bkey].name,
            typeno : result.b[bkey].bNO,
            code : result.b[bkey].code
          })
        }
        $(".singleTeacher .desc").dotdotdot();
        this.initRightForm();
        this.initQueryDom();
        this.bindEVent();
      })
  }
}