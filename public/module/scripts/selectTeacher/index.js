/**
 * Created by Administrator on 2017/6/26.
 */
import $ from 'jquery'
import handlebars from 'handlebars'
import { fetchCity } from '../../plugin/globalServer'
import { selectTeacherData, orderbyData } from './selectTeacherData'
import selectTeacherAlert from '../../component/selectTeacherAlert'
import { navEvent, locationStorage,isEmptyObject } from '../../plugin/global'

export default class foreignTeacher{
    constructor(){
        let cacheData = locationStorage().getLocationStorage("select");
        this.cache= cacheData ? JSON.parse(cacheData) : {} ;
        this.querySelect = null;
        this.touchMove = false;
        this.queryData =Object.assign({},this.cache);
        this.currentRegion =[];
        this.selectsubject = "unlimit"
        this.selectteachertype = "unlimit"
        this.selectteachergender = "unlimit"
        this.selectteacherfeature ="";
        fetchCity().then((data)=>{
            this.currentCity = (isEmptyObject(CONFIG.city) || this.city.indexOf(CONFIG.city) === -1)? "广州市" : CONFIG.city;
            locationStorage().setLocationStorage("city",this.currentCity);
            this.area = data;
            this.city = Object.keys(data);
            this.currentRegion = data[locationStorage().getLocationStorage("city")];
            this.domEvent();
            this.initCacheData();
        })
    }
    initCacheData(){
        console.log(this.cache)
        if(this.cache.orderby){
            let intelligentTxt = $(".intelligentTxt");
            intelligentTxt.text(orderbyData[this.cache.orderby]);
        }
        if(this.cache.selectgrade){
            let intelligentTxt = $(".gradeTxt");
            intelligentTxt.text(orderbyData[this.cache.selectgrade]);
        }
        if(this.cache.selectarea){
            let name ="";
            for(let region of this.currentRegion){
                if(this.cache.selectarea === region.code){
                    name = region.itemName
                }
            }
            let intelligentTxt = $(".areaTxt");
            intelligentTxt.text(name);
        }
    }
    domEvent(){
        let self = this;
        navEvent();
        $("[data-selecttype]").click(function () {
           let selecttype = $(this).data("selecttype");
           switch (selecttype){
               case "grade":
                   self.querySelectDom(selectTeacherData.grade);
                   break;
               case "area":
                   this.currentRegion = self.area[locationStorage().getLocationStorage("city")];
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

        let intelligentInput =$("input[name='intelligent']");
        $("[data-orderby]").click(function () {
            let orderby = $(this).data("orderby");

            self.queryData.orderby= orderby
            locationStorage().setLocationStorage("select",self.queryData);
            self.querySelect.hide();
             window.location.href = "/teacher/list/"+self.queryData.orderby
                +"/"+(self.cache.selectgrade || "unlimit" )+"/"+
                 (self.cache.selectarea || "unlimit") +
                "/"+(self.cache.selectsubject || "unlimit")+
                "/"+(self.cache.selectteachertype || "unlimit")+"/"+
                 (self.cache.selectteacherfeature || "unlimit")+"/"+
                 (self.cache.selectteachergender || "unlimit")+"/0"
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
            // $(".mask").css("height",this.scorllHeight());
        }else{
            this.querySelectDomEvent();
            this.touchMove =true;
            this.forbidTouch();
        }
        this.hideMask();
    }
    querySelectDomEvent(){
        let self = this;
        $("[data-selectgrade]").click(function () {
            $(this).addClass("activeListClickQuery");
             self.querySelect.hide();
             self.querySelect = null;
            self.queryData.selectgrade= $(this).data("selectgrade");
            locationStorage().setLocationStorage("select",self.queryData);
            window.location.href = "/teacher/list/"+(self.cache.orderby || "unlimit")
                +"/"+self.queryData.selectgrade+"/"+
                (self.cache.selectarea || "unlimit") +
                "/"+(self.cache.selectsubject || "unlimit")+
                "/"+(self.cache.selectteachertype || "unlimit")+"/"+
                (self.cache.selectteacherfeature || "unlimit")+"/"+
                (self.cache.selectteachergender || "unlimit")+"/0"
        })
        $("[data-selectarea]").click(function () {
            $(this).addClass("activeListClickQuery");
            self.querySelect.hide();
            self.querySelect = null;
            self.queryData.selectarea= $(this).data("selectarea");
            locationStorage().setLocationStorage("select",self.queryData);
            window.location.href = "/teacher/list/"+(self.cache.orderby || "unlimit")
                +"/"+(self.cache.selectgrade || "unlimit" )+"/"+
                (self.queryData.selectarea || "unlimit") +
                "/"+(self.cache.selectsubject || "unlimit")+
                "/"+(self.cache.selectteachertype || "unlimit")+"/"+
                (self.cache.selectteacherfeature || "unlimit")+"/"+
                (self.cache.selectteachergender || "unlimit")+"/0"
        })
    }
    selectEvent(){
        let self = this;
        $(".queryItemLi>li").off("click").click(function (e) {
            e.stopPropagation();
            e.preventDefault();

            let selectsubject = $(this).data("selectsubject")
            let selectteachertype = $(this).data("selectteachertype")
             self.selectteacherfeature = $(this).data("selectteacherfeature") ? self.selectteacherfeature +"+"
                 + $(this).data("selectteacherfeature") : "";
            let selectteachergender = $(this).data("selectteachergender")
            if( self.selectteacherfeature){
                $(this).addClass("activeListClickQuery");
                self.selectsubject = selectsubject ? selectsubject :self.selectsubject;
                self.selectteachertype = selectteachertype ? selectteachertype :self.selectteachertype;
                self.selectteacherfeature =  self.selectteacherfeature ?  self.selectteacherfeature : "unlimit";
                self.selectteachergender = selectteachergender ? selectteachergender :self.selectteachergender;
                self.selectteacherfeature = self.selectteacherfeature.replace(/^\+/,"");
                console.log( self.selectteacherfeature);
            }else{
                if(!$(this).hasClass('activeListClickQuery')){
                    $(this).addClass("activeListClickQuery");
                    $(this).siblings("li").removeClass("activeListClickQuery");
                    self.selectsubject = selectsubject ? selectsubject :self.selectsubject;
                    self.selectteachertype =selectteachertype ? selectteachertype :self.selectteachertype;
                    // self.selectteacherfeature =  self.selectteacherfeature ?  self.selectteacherfeature : "unlimit";
                    self.selectteachergender = selectteachergender ? selectteachergender :self.selectteachergender;
                }
            }

        })
        $(".queryBtn").click(function () {
            self.querySelect.hide();
            self.queryData.selectsubject=  self.selectsubject;
            self.queryData.selectteachertype=  self.selectteachertype;
            self.queryData.selectteacherfeature=  self.selectteacherfeature;
            self.queryData.selectteachergender=  self.selectteachergender;
            locationStorage().setLocationStorage("select",self.queryData);
            self.querySelect = null
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