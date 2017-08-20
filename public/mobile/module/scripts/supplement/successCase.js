/**
 * Created by Administrator on 2017/6/26.
 */
import $ from 'jquery'
import { navEvent, evaluate } from '../../plugin/global'
import { fetchCity } from '../../plugin/globalServer'
import {  locationStorage } from '../../plugin/global'
import {  footerData } from '../../plugin/footArea'
import experienceAlert from '../../component/experienceAlert'
import locationModal from '../../component/locationModal'
import { cookieCity, localCity }from '../../plugin/urlCity'

export default class successCase{
    constructor(){
        this.cache = {};
        this.currentRegionCode = "";
        this.gradeName = "";

        fetchCity().then((data)=>{
            cookieCity();
            localCity(data.locationCode);
            let localStorage = locationStorage().get("currentCity") || "{}";
            let cacheCity = JSON.parse(localStorage).city;
            this.cache.city =  cacheCity || "广州市";
            this.area = data.city;
            this.city = Object.keys(data.city);
            this.cityCode = data.cityCode;
            this.locationCode = data.locationCode;
            this.currentRegion = data.city[this.cache.city];
            this.domEvent();
        })
    }
    domEvent(){
        navEvent();
        this.initLocation();
        this.buttonEvent();
        new footerData({
            city:   this.cache.city,
            area:  this.currentRegion
        });
        evaluate();
    }
    initLocation(){
        let self = this;
        $(".locationTxt").text(self.cache.city);
        $(".locationArea").click(function () {
            new locationModal({
                locationCode: self.locationCode
            },function () {

            });
        });
    }
    buttonEvent(){
        let self = this;
      $(".btnNOW").click(function () {
          let city = locationStorage().get("city");
          new experienceAlert({
              mask:true,
              areaId:self.cityCode[city]
          })
      })
    }
}