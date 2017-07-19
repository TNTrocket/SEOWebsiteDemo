/**
 * Created by Administrator on 2017/6/26.
 */
import $ from 'jquery'
import handlebars from 'handlebars'
import { fetchCity } from '../../plugin/globalServer'
import { selectTeacherData, orderbyData } from './selectTeacherData'
import selectTeacherAlert from '../../component/selectTeacherAlert'
import { navEvent, locationStorage, isEmptyObject, evaluate } from '../../plugin/global'
import locationModal from '../../component/locationModal'
import {  footerData } from '../../plugin/footArea'

export default class selectTeacher{
    constructor(){
        let cacheData = CONFIG.cacheData || locationStorage().getLocationStorage("select");
        let cacheCity = locationStorage().getLocationStorage("city");
        this.cache = cacheData ||  {} ;
        this.cache.city =  cacheCity ? cacheCity : "广州市";
        this.querySelect = null;
        this.touchMove = false;
        this.queryData =Object.assign({},this.cache);
        this.currentRegion =[];
        this.selectsubject = "unlimit";
        this.selectteachertype = "unlimit";
        this.selectteachergender = "unlimit";
        this.selectteacherfeature ="";
        this.allTags =this.cache.tags ==="unlimit" ? "":this.cache.tags ;
        fetchCity().then((data)=>{
            this.area = data.city;
            this.city = Object.keys(data.city);
            this.cityCode = data.cityCode;
            this.locationCode = data.locationCode;
            this.currentRegion = data.city[this.cache.city];
            this.domEvent();
            this.initCacheData();
            this.initLocation();
        })
    }
    initRegion(){
        // if(this.cache.city !== locationStorage().getLocationStorage("city")){
        //     let intelligentTxt = $(".areaTxt");
        //     intelligentTxt.text("区域");
        //     this.cache.selectarea = "unlimit"
        // }
    }
    initLocation(){
        let self = this;
        $(".locationTxt").text(self.cache.city );
        $(".locationArea").click(function () {
            // let temp = handlebars.compile(locationTemp);
            // let dom = temp(self.cityCode);
            new locationModal({
                locationCode: self.locationCode
            },function (option) {
                window.location.href = "/teacher/list/auto/unlimit/unlimit/unlimit/unlimit/unlimit/unlimit/" +
                    option.city+"/0"
            });
        });
    }
    initCacheData(){
        console.log(this.cache)
        if(this.cache.orderBy){
            let intelligentTxt = $(".intelligentTxt");
            intelligentTxt.text(orderbyData[this.cache.orderBy]);
        }
        if(this.cache.grade!=="unlimit" && this.cache.grade){
            let intelligentTxt = $(".gradeTxt");
            intelligentTxt.text(orderbyData[this.cache.grade]);
        }
        if(this.cache.district!=="unlimit" && this.cache.district){
            let name ="";
            for(let region of this.currentRegion){
                if(this.cache.district == region.code){
                    name = region.itemName
                    break;
                }else{
                    name = "区域"
                }
            }
            let intelligentTxt = $(".areaTxt");
            console.log(name);
            intelligentTxt.text(name);
        }
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
           switch (selecttype){
               case "grade":
                   self.querySelectDom(selectTeacherData.grade);
                   break;
               case "area":
                   self.currentRegion = self.area[locationStorage().getLocationStorage("city")];
                   selectTeacherData.area.queryType[0].queryItem = self.currentRegion;
                   console.log(selectTeacherData.area)
                   self.querySelectDom(selectTeacherData.area);
                   break;
               case "select":
                   self.querySelectDom(selectTeacherData.select,"select");
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
        let html = temp({});
        self.querySelect = new selectTeacherAlert({html:html,mask:true});
        self.hideMask();

        $("[data-orderby]").click(function () {
            let orderBy = $(this).data("orderby");

            self.queryData.orderBy= orderBy
            // locationStorage().setLocationStorage("select",self.queryData);
            self.querySelect.hide();
             window.location.href = "/teacher/list/"+self.queryData.orderBy
                +"/"+(self.cache.grade || "unlimit" )+"/"+
                 (self.cache.district || "unlimit") +
                "/"+(self.cache.subject || "unlimit")+
                "/"+(self.cache.teacherType || "unlimit")+"/"+
                 (self.cache.tags || "unlimit")+"/"+
                 (self.cache.gender || "unlimit")+
                  "/"+CONFIG.cityID
                 +"/0"
        })
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
        $("[data-selectsubject="+this.cache.subject+"]").addClass("activeListClickQuery");
        $("[data-selectteachertype="+this.cache.teacherType+"]").addClass("activeListClickQuery");
        $("[data-selectteachergender="+this.cache.gender+"]").addClass("activeListClickQuery");
        if(this.cache.tags){
            let tag= this.cache.tags.split("+");
            tag.forEach(function (value) {
                $("[data-selectteacherfeature="+value+"]").addClass("activeListClickQuery");
            })
        }
        this.hideMask();
    }
    querySelectDomEvent(){
        let self = this;
        $("[data-selectgrade]").click(function () {
            $(this).addClass("activeListClickQuery");
             self.querySelect.hide();
             self.querySelect = null;
            self.queryData.grade= $(this).data("selectgrade");
            // locationStorage().setLocationStorage("select",self.queryData);
            window.location.href = "/teacher/list/"+(self.cache.orderBy || "unlimit")
                +"/"+self.queryData.grade+"/"+
                (self.cache.district || "unlimit") +
                "/"+(self.cache.subject || "unlimit")+
                "/"+(self.cache.teacherType || "unlimit")+"/"+
                (self.cache.tags || "unlimit")+"/"+
                (self.cache.gender || "unlimit")+"/"+CONFIG.cityID
                +"/0"
        })
        $("[data-selectarea]").click(function () {
            $(this).addClass("activeListClickQuery");
            self.querySelect.hide();
            self.querySelect = null;
            self.queryData.district= $(this).data("selectarea");
            // locationStorage().setLocationStorage("select",self.queryData);
            window.location.href = "/teacher/list/"+(self.cache.orderBy || "unlimit")
                +"/"+(self.cache.grade || "unlimit" )+"/"+
                (self.queryData.district || "unlimit") +
                "/"+(self.cache.subject || "unlimit")+
                "/"+(self.cache.teacherType || "unlimit")+"/"+
                (self.cache.tags || "unlimit")+"/"+
                (self.cache.gender || "unlimit")+"/"+CONFIG.cityID
                +"/0"
        })
    }
    selectEvent(){
        let self = this;
        $(".queryItemLi>li").off("click").click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            let tagData = $(this).data("selectteacherfeature");
            let selectsubject = $(this).data("selectsubject") || self.cache.subject;
            let selectteachertype = $(this).data("selectteachertype") || self.cache.teacherType;
            let selectteacherfeature = tagData || self.cache.tags;
            let selectteachergender = $(this).data("selectteachergender")|| self.cache.gender;
            if( tagData){
                if($(this).hasClass('activeListClickQuery')){
                   if(self.allTags.indexOf(selectteacherfeature)>-1 ){
                       $(this).removeClass("activeListClickQuery");
                       self.allTags = self.allTags.replace(selectteacherfeature,"").replace("++","+")
                           .replace(/^\+|\+$/,"");
                   }
                }else{
                    $(this).addClass("activeListClickQuery");
                    self.allTags = self.allTags ? self.allTags +"+"+selectteacherfeature : self.allTags +selectteacherfeature;
                    console.log( self.selectteacherfeature);
                }
            }else{
                if(!$(this).hasClass('activeListClickQuery')){
                    $(this).addClass("activeListClickQuery");
                    $(this).siblings("li").removeClass("activeListClickQuery");
                }
            }
            self.selectsubject = selectsubject ||  "unlimit";
            self.selectteachertype = selectteachertype ||" unlimit";
            self.selectteachergender = selectteachergender || "unlimit";
            self.selectteacherfeature =  self.allTags || "unlimit";
        })
        $(".queryBtn").click(function () {
            self.querySelect.hide();
            self.queryData.subject = self.selectsubject;
            self.queryData.teacherType =  self.selectteachertype;
            self.queryData.tags =  self.selectteacherfeature || self.cache.tags;
            self.queryData.gender =  self.selectteachergender;

            self.querySelect = null;
            window.location.href = "/teacher/list/"+(self.cache.orderBy || "unlimit")
                +"/"+(self.cache.grade || "unlimit" )+"/"+
                (self.cache.district || "unlimit") +
                "/"+(self.queryData.subject || "unlimit")+
                "/"+(self.queryData.teacherType || "unlimit")+"/"+
                (self.queryData.tags || "unlimit")+"/"+
                (self.queryData.gender || "unlimit")+"/"+CONFIG.cityID
                +"/0"
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
                self.querySelect.hide();
                self.querySelect = null;
            }
        })
    }
    scorllHeight(){
      return document.body.scrollHeight
    }
}