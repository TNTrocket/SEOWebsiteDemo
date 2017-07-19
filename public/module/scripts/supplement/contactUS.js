/**
 * Created by Administrator on 2017/6/23.
 */
import $ from 'jquery'
import { navEvent, locationStorage, evaluate } from '../../plugin/global'
import { fetchCity } from '../../plugin/globalServer'
import {  footerData } from '../../plugin/footArea'
import locationModal from '../../component/locationModal'

export default class aboutUS{
    constructor(){
        this.cache = {}
        fetchCity().then((data)=>{
            console.log(data);
            this.city = Object.keys(data.city);
            this.cacheCity = locationStorage().getLocationStorage("city");
            this.cache.city = this.cacheCity || "广州市";
            this.currentRegion = data.city[this.cache.city];
            this.locationCode = data.locationCode;
            $(".locationTxt").text(this.cache.city);
            this.domEvent();
        })
    }
    domEvent(){
        let self = this;
        navEvent();
        evaluate();
        new footerData({
            city:   this.cache.city,
            area:  this.currentRegion
        });
        $(".locationArea").click(function () {
            new locationModal({
                locationCode:self.locationCode
            });
        });
    }
}