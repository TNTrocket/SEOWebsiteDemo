/**
 * Created by Administrator on 2017/6/26.
 */
import $ from 'jquery'
import handlebars from 'handlebars'
import { selectTeacherData } from './selectTeacherData'
import selectTeacherAlert from '../../component/selectTeacherAlert'

export default class foreignTeacher{
    constructor(){
        this.domEvent();
        this.querySelect = null;
        this.touchMove = false;
    }
    domEvent(){
        let self = this;
        $("[data-selecttype]").click(function () {
           let selecttype = $(this).data("selecttype");
           switch (selecttype){
               case "grade":
                   self.querySelectDom(selectTeacherData.grade);
                   break;
               case "area":
                   self.querySelectDom(selectTeacherData.area);
                   break;
               case "select":
                   self.querySelectDom(selectTeacherData.select,"select");
                   break;
               case "intelligent":
                   console.log("intelligent")
                   self.intelligentDom();
                   break;
           }
        })
    }
    intelligentDom(){
        let temp = handlebars.compile($("#intelligentTpl").html());
        let html = temp({});
        this.querySelect = new selectTeacherAlert({html:html,mask:true});
        this.hideMask();
    }
    querySelectDom(data,type){
        let temp = handlebars.compile($("#tpl").html());
        let html = temp(data);
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
        $(".queryItemLi>li").off("click").click(function () {
           $(this).addClass("activeListClickQuery");
           self.querySelect.hide();
           self.querySelect = null
     })
    }
    selectEvent(){
        let self = this;
        $(".queryItemLi>li").off("click").click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            if($(this).hasClass('activeListClickQuery')){

            }else{
                $(this).addClass("activeListClickQuery");
                $(this).siblings("li").removeClass("activeListClickQuery");
            }
        })
        $(".queryBtn").click(function () {
            self.querySelect.hide();
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