/**
 * Created by Administrator on 2017/6/23.
 */
import $ from 'jquery'
import { fetchCity } from '../../plugin/globalServer'
import handlebars from 'handlebars'
import { teacherDetailData, orderbyData } from './teacherDetailData'
import {  locationStorage, evaluate } from '../../plugin/global'
import experienceAlert from '../../component/experienceAlert'
import {  footerData } from '../../plugin/footArea'

export default class teacherDetail{
    constructor(){
        this.currentRegionCode = "";
        this.gradeName = "";
        this.cache = {};
        fetchCity().then((data)=>{
            this.area = data.city;
            this.city = Object.keys(data.city);
            this.cityCode = data.cityCode;
            this.cache.City = locationStorage().get("city") || "广州市";
            this.currentRegion = data.city[ this.cache.City];
            this.domEvent();
        })
    }
    domEvent(){
        this.gradeEvent();
        this.regionEvent();
        this.evaluateEvent();
        this.bookEvent();
        evaluate();
        new footerData({
            city:   this.cache.city,
            area:  this.currentRegion
        });
    }
    bookEvent(){
        let self = this;

        $(".bookNow").click(function () {
            // if(self.currentRegionCode) {
            let city = locationStorage().get("city");
            //暂时传城市id
            // self.currentRegionCode
                new experienceAlert({
                    mask: true,
                    areaId: self.cityCode[city] ,
                    realname: self.gradeName || "官网用户"
                });
            // }else{
            //     new alert({ mask: true, text:""});
            // }
        })
    }
    evaluateEvent(){
        let goodEvaluate = $(".goodEvaluate");
        let middleEvaluate = $(".middleEvaluate");
        let badEvaluate = $(".badEvaluate");

        $("[data-evaluatetype]").click(function () {
           let evaluateType = $(this).data("evaluatetype");
            $(this).addClass("blueColor").siblings("div").removeClass("blueColor");
            $(this).children("span").addClass("activeBorder").closest("div").siblings("div").children("span").removeClass("activeBorder");
           switch (evaluateType){
               case "good":
                   goodEvaluate.fadeIn();
                   middleEvaluate.hide();
                   badEvaluate.hide();
                     break;
               case "middle":
                   goodEvaluate.hide();
                   middleEvaluate.fadeIn();
                   badEvaluate.hide();
                   break;
               case "bad":
                   goodEvaluate.hide();
                   middleEvaluate.hide();
                   badEvaluate.fadeIn();
                   break;
           }
        })
    }
    gradeEvent(){
        let temp = handlebars.compile($("#tpl").html());
        let html = temp(teacherDetailData.grade.queryItem);
        let self = this;
        $(".selectClassContent").append(html);
        $(".selectClassContent > ul >li").click(function () {
            if(!$(this).hasClass('activeListClickQuery')){
                $(this).addClass("activeListClickQuery");
                $(this).siblings("li").removeClass("activeListClickQuery");
                self.gradeName = orderbyData[$(this).data("regioncode")] + "官网用户";
            }
        })
    }
    regionEvent(){
        let temp = handlebars.compile($("#tpl").html());
        let html = temp(this.currentRegion);
        let self = this;
        $(".selectAreaContent").append(html);
        $(".selectAreaContent > ul >li").click(function () {
            if(!$(this).hasClass('activeListClickQuery')){
                $(this).addClass("activeListClickQuery");
                $(this).siblings("li").removeClass("activeListClickQuery");
                self.currentRegionCode = $(this).data("regioncode");
            }
        })
    }
}