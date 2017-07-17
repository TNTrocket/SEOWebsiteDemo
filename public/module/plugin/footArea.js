/**
 * Created by Administrator on 2017/7/17.
 */
import $ from 'jquery'
import handlebars from 'handlebars'

import {  locationStorage } from './global'
export class footerData{
    constructor(option){
        this.areaTextDom(option);
        let txt = option.city || locationStorage().getLocationStorage("city");
        txt = txt.replace("市","");
        $(".familyEducationBox .placeName").text(txt);
    }
    areaTextDom(option){
        let dom = $("#footerAreaTpl").html();
        let temp = handlebars.compile(dom);
        let domHtml = temp(option.area);
        $(".footerBox").append(domHtml);
    }
}