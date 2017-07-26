import $ from 'jquery'
import { fetchCity } from '../../plugin/globalServer'
import {  locationStorage, evaluate } from '../../plugin/global'
import {  footerData } from '../../plugin/footArea'

export default class teacherEvaluate{
    constructor(){
        this.cache = {};
        fetchCity().then((data)=>{
            console.log(data);
            this.city = Object.keys(data.city);
            this.cacheCity = locationStorage().get("city");
            this.cache.city = this.cacheCity || "广州市";
            this.currentRegion = data.city[this.cache.city];
            this.locationCode = data.locationCode;
            $(".locationTxt").text(this.cache.city);
            this.domEvent();
        })
    }
    domEvent(){
        this.evaluateEvent();
        new footerData({
            city:   this.cache.city,
            area:  this.currentRegion
        });
        evaluate();
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
}