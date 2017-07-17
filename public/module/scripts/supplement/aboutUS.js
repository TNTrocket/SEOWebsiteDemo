/**
 * Created by Administrator on 2017/6/23.
 */
import $ from 'jquery'
import { navEvent, locationStorage, evaluate } from '../../plugin/global'
import { fetchCity } from '../../plugin/globalServer'
import {  footerData } from '../../plugin/footArea'

export default class aboutUS{
    constructor(){
        fetchCity().then((data)=>{
            console.log(data);
            this.city = Object.keys(data.city);
            this.cacheCity = locationStorage().getLocationStorage("city");
            this.currentCity = this.cacheCity || "广州市";
            this.locationCode = data.locationCode;
            $(".locationTxt").text(this.currentCity);
            this.domEvent();
        })
    }
    domEvent(){
        navEvent();
        evaluate();
        footerData(this.currentCity);
    }
}