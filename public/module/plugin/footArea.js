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
        let footerAreaTpl = $("#footerAreaTpl")
        if(footerAreaTpl.length!==0){
        let dom = footerAreaTpl.html();
        let temp = handlebars.compile(dom);
        let domHtml = temp(option.area);
        $(".footerBox").append(domHtml);
        }
    }
}