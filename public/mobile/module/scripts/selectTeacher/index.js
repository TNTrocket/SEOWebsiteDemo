/**
 * Created by Administrator on 2017/6/26.
 */
import $ from 'jquery'
import handlebars from 'handlebars'
import { fetchCity, selectTeacherAPI } from '../../plugin/globalServer'
import selectTeacherAlert from '../../component/selectTeacherAlert'
import { navEvent, locationStorage, evaluate, parseParams } from '../../plugin/global'
import locationModal from '../../component/locationModal'
import {  footerData } from '../../plugin/footArea'
import { cookieCity, localCity }from '../../plugin/urlCity'

export default class selectTeacher{
    constructor(){
        this.querySelect = null;
        this.touchMove = false;
        this.currentRegion =[];
        this.data = {};
        fetchCity().then((data)=>{
          cookieCity();
          localCity(data.locationCode);
          let cacheData = CONFIG.cacheData;
          let localStorage = locationStorage().get("currentCity") || "{}";
          let cacheCity = JSON.parse(localStorage).city;
          this.cache = JSON.parse(JSON.stringify(cacheData)) ||  {} ;
          this.cache.city =  cacheCity ? cacheCity : "广州市";
          this.cache.querySelectData = {};
          this.cache.querySelectData.arr = [];
          this.cache.queryString = this.cache.queryString.substring(2)
          this.area = data.city;
          this.city = Object.keys(data.city);
          this.cityCode = data.cityCode;
          this.locationCode = data.locationCode;
          this.currentRegion = data.city[this.cache.city];
              selectTeacherAPI(  {
                method : "get",
                data:{ "cityPinyin" : this.cityCode[this.cache.city].pinyin
                }}).then((teacherData)=>{
                  console.log(teacherData)
                  this.data.grade = teacherData.a;
                  this.data.subject = teacherData.b;
                  this.data.area = teacherData.c;
                  this.data.gender = teacherData.d;
                  this.data.teacherType = teacherData.e;
                  this.data.tags = teacherData.f;
                  this.data.orderBy = teacherData.g;
                  this.initCacheData();
                  this.domEvent();
                  this.initLocation();
                })

        })
    }
    initLocation(){
        let self = this;
        $(".locationTxt").text(self.cache.city );
        $(".locationArea").click(function () {
            new locationModal({
                locationCode: self.locationCode
            });
        });
    }
    initCacheData(){
      let param = parseParams(this.cache.queryString);
      let intelligentTxt = $(".intelligentTxt");
      let gradeTxt = $(".gradeTxt");
      let areaTxt = $(".areaTxt");
      console.log(param)
      if(param.g){
        for(let g of this.data.orderBy){
          if(g.typeno === param.g){
            intelligentTxt.text(g.name);
            break;
          }
        }
      }
      if(param.a){
        for(let a of this.data.grade){
          if(a.typeno === param.a){
            gradeTxt.text(a.name);
            break;
          }
        }
      }
      if(param.c){
        for(let c of this.data.area){
          if(c.typeno === param.c){
            areaTxt.text(c.name);
            break;
          }
        }
      }
      this.cache.querySelectData = param;
    }
    domEvent(){
        let self = this;
        navEvent();
        evaluate();
        new footerData({
            city: this.cache.city,
            area:  this.currentRegion
        });
        $("[data-selecttype]").click(function () {
           let selecttype = $(this).data("selecttype");
           let selectData ={};
            selectData.selectDataArr =[];
          let queryItem  = {}
           switch (selecttype){
               case "grade":
                   queryItem.name = "年级"
                   queryItem.item = self.data.grade
                   selectData.selectDataArr.push(queryItem)
                   self.querySelectDom(selectData);
                   break;
               case "area":
                   queryItem.name = "地区"
                   queryItem.item = self.data.area
                   selectData.selectDataArr.push(queryItem)
                   self.querySelectDom(selectData);
                   break;
               case "select":
                  let obj1 = {name:"科目",item:self.data.subject,inputName:"subject"}
                  let obj2 = {name:"老师类型",item:self.data.teacherType,inputName:"teachertype"}
                  let obj3 = {name:"老师特点",item:self.data.tags,inputName:"teachertags"}
                  let obj4 = {name:"性别",item:self.data.gender,inputName:"teachergender"}
                 selectData.selectDataArr.push(obj1,obj2,obj3,obj4);
                  selectData.target = "select"
                   self.querySelectDom(selectData,"select");
                   break;
               case "intelligent":
                   self.intelligentDom();
                   break;
           }
        })
    }
    intelligentDom(){
        let self = this;
        let temp = handlebars.compile($("#intelligentTpl").html());
        let html = temp(self.data.orderBy);
        self.querySelect = new selectTeacherAlert({html:html,mask:true});
        self.hideMask();

        $("[data-orderby]").click(function () {
            let orderBy = $(this).data("typeno");
            self.querySelect.hide();
            let query = self.replaceQuery(orderBy);
             window.location.href = "/teachers/"+CONFIG.cityPinyin+"/s-"+query+"/"
        })
    }
    replaceQuery(query){
      let paramQuery = parseParams(query);
      let newQuery =""
      let obj =Object.assign(this.cache.querySelectData,paramQuery);
      for(let key of Object.keys(obj)){
        if(key ==="arr"){
          continue
        }
        newQuery += obj[key]
      }
      console.log(newQuery);
      return newQuery;
    }
    querySelectDom(data,type){
        let temp = handlebars.compile($("#tpl").html());
        let html = temp(data);
        console.log("html",html)
        this.querySelect = new selectTeacherAlert({html:html,mask:true});
        if(type === "select"){
            this.selectEvent();
            this.touchMove = false;

        }else{
            this.querySelectDomEvent();
            this.touchMove =true;
            this.forbidTouch();
        }
        this.hideMask();
    }
    querySelectDomEvent(){
        let self = this;
        $("[data-typeno]").click(function () {
              $(this).addClass("activeListClickQuery");
               self.querySelect.hide();
               self.querySelect = null;
                let query = $(this).data("typeno");
                 query = self.replaceQuery(query);
            window.location.href = "/teachers/"+CONFIG.cityPinyin+"/s-"+query+"/"
        })
    }
    selectEvent(){
        let self = this;
       if(self.cache.querySelectData.arr){
         for(let data of self.cache.querySelectData.arr){
           $("[data-typeno="+data+"]").addClass("activeListClickQuery")
         }
       }
        $("[data-subject]").click(function (e) {
              e.stopPropagation();
              e.preventDefault();
          if(!$(this).hasClass('activeListClickQuery')){
              let subject = $(this).data("typeno")
              $("input[name='subject']").val(subject);
             $(this).addClass("activeListClickQuery");
             $(this).siblings("li").removeClass("activeListClickQuery");
         }
        })
      $("[data-teachertype]").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(!$(this).hasClass('activeListClickQuery')){
          let teachertype = $(this).data("typeno")
          $("input[name='teachertype']").val(teachertype);
          $(this).addClass("activeListClickQuery");
          $(this).siblings("li").removeClass("activeListClickQuery");
        }
      })
      $("[data-teachertags]").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(!$(this).hasClass('activeListClickQuery')){
          let teachertags = $(this).data("typeno")
          $("input[name='teachertags']").val(teachertags);
          $(this).addClass("activeListClickQuery");
          $(this).siblings("li").removeClass("activeListClickQuery");
        }
      })
      $("[data-teachergender]").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        if(!$(this).hasClass('activeListClickQuery')){
          let teachergender = $(this).data("typeno")
          $("input[name='teachergender']").val(teachergender);
          $(this).addClass("activeListClickQuery");
          $(this).siblings("li").removeClass("activeListClickQuery");
        }
      })

        $(".queryBtn").click(function () {
          let subject = $("input[name='subject']").val() || "";
          let teachertype = $("input[name='teachertype']").val() || "";
          let teachertags = $("input[name='teachertags']").val() || "";
          let teachergender = $("input[name='teachergender']").val() || "";
          let query = subject + teachertype + teachertags +teachergender
          query = self.replaceQuery(query);
          window.location.href = "/teachers/"+CONFIG.cityPinyin+"/s-"+query+"/"
        })
    }
    forbidTouch(){
        let self = this;
        $("body").on("touchmove",function (e) {
            if(self.touchMove){
                e.preventDefault();
            }
        })
    }
    hideMask(){
        let mask = $(".mask");
        let self = this;
        mask.click(function () {
            if( self.querySelect){
                // self.querySelect = null;
                self.querySelect.hide();
            }
        })
    }
    scorllHeight(){
      return document.body.scrollHeight
    }
}