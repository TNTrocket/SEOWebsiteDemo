/**
 * Created by Administrator on 2017/6/23.
 */
import $ from 'jquery'
import { fetchCity } from '../../plugin/globalServer'
import handlebars from 'handlebars'
import { teacherDetailData } from './teacherDetailData'
import { navEvent, locationStorage,isEmptyObject } from '../../plugin/global'

export default class teacherDetail{
    constructor(){
        fetchCity().then((data)=>{
            this.currentCity = (isEmptyObject(CONFIG.city) || this.city.indexOf(CONFIG.city) === -1)? "广州市" : CONFIG.city;
            locationStorage().setLocationStorage("city",this.currentCity);
            this.area = data;
            this.city = Object.keys(data);
            this.currentRegion = data[locationStorage().getLocationStorage("city")];
            this.domEvent();
        })
    }
    domEvent(){
        navEvent();
        this.gradeEvent();
        this.regionEvent();
    }
    gradeEvent(){
        let temp = handlebars.compile($("#tpl").html());
        let html = temp(teacherDetailData.grade.queryItem);
        $(".selectClassContent").append(html);
        $(".selectClassContent > ul >li").click(function () {
            if(!$(this).hasClass('activeListClickQuery')){
                $(this).addClass("activeListClickQuery");
                $(this).siblings("li").removeClass("activeListClickQuery");
            }
        })
    }
    regionEvent(){
        let temp = handlebars.compile($("#tpl").html());
        let html = temp(this.currentRegion);
        $(".selectAreaContent").append(html);
        $(".selectAreaContent > ul >li").click(function () {
            if(!$(this).hasClass('activeListClickQuery')){
                $(this).addClass("activeListClickQuery");
                $(this).siblings("li").removeClass("activeListClickQuery");
            }
        })
    }
}