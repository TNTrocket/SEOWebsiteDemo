import $ from 'jquery'
import Swiper from 'swiper'
import {  navEvent, locationStorage, evaluate, getQueryString, cookie } from '../../plugin/global'
import locationModal from '../../component/locationModal'
import experienceAlert from  '../../component/experienceAlert'
import switchCityAlert from  '../../component/switchCityAlert'
import { fetchCity, searchCity } from '../../plugin/globalServer'
import { footerData } from '../../plugin/footArea'
import { needSearchCity }from '../../plugin/needSearchCity'
import { cookieCity, localCity }from '../../plugin/urlCity'

export default class homePage{
    constructor(){
        fetchCity().then((data)=>{
            console.log(data);
            this.city = Object.keys(data.city);
            this.cityCode = data.cityCode;
            this.locationCode = data.locationCode;
            this.currentRegion = [];
            this.location = {};
            localCity(data.locationCode);
            let storageCity = locationStorage().get("currentCity") ||"{}";
            this.location.cacheCity = JSON.parse(storageCity).city || "广州市";
            this.location.city = locationStorage().get("city") || "广州市";
            // if( this.location.currentCity !== this.location.city ){
            if(needSearchCity()) {
              searchCity().then((city) => {
                console.log("city", city);
                this.currentCity = (city && this.city.indexOf(city) > -1) ? city : "广州市";
                let currentObj = {
                    city: this.currentCity,
                    time: new Date().getTime()
                }
                if (this.currentCity !== this.location.cacheCity) {

                  if (getQueryString("local") === "true") {
                    currentObj.city = this.location.cacheCity
                    locationStorage().set("currentCity", JSON.stringify(currentObj));
                    this.currentRegion = data.city[this.location.cacheCity];
                    $(".locationTxt").text(this.location.cacheCity);

                  } else {

                    new switchCityAlert({
                      mask: true,
                      cityName: this.currentCity
                    }, (type) => {
                      console.log(this);
                      if (type === "confirm") {
                        locationStorage().set("currentCity", JSON.stringify(currentObj));
                        window.location.href = "/" + this.cityCode[this.currentCity].pinyin
                      } else {

                        currentObj.city = this.location.cacheCity;
                        locationStorage().set("currentCity", JSON.stringify(currentObj));
                        this.currentRegion = data.city[this.location.cacheCity];
                        $(".locationTxt").text(this.location.cacheCity);
                        this.footer = null;
                        this.footEvent();

                      }
                    });
                  }
                } else {
                  currentObj.city = this.currentCity;
                  locationStorage().set("currentCity", JSON.stringify(currentObj));
                  this.currentRegion = data.city[this.currentCity];
                  $(".locationTxt").text(this.currentCity);
                }

                this.domEvent();
              }, (error) => {
                this.currentCity =  this.location.cacheCity;
                $(".locationTxt").text(this.currentCity);
                this.currentRegion = data.city[this.currentCity];
                this.domEvent();
              })
            }else{

              this.currentCity =  this.location.cacheCity;
              $(".locationTxt").text(this.currentCity);
              this.currentRegion = data.city[this.currentCity];
              this.domEvent();

            }
            cookieCity();
        })
    }
    footEvent(){
        this.footer = new footerData({
            city:  (this.currentCity=== this.location.cacheCity)? this.currentCity : this.location.cacheCity,
            area:  this.currentRegion
        });
    }
    initBanner(){
        let bannerCount = $(".bannerSwiper").length;
        $(".bannerWrapper").css("width",bannerCount*100+"%");
    }
    domEvent(){
        navEvent();
        evaluate();
        this.footEvent();
        let self = this;
        this.initBanner();
        let mySwiper = new Swiper('.swiper-container', {
            autoplay: 2000,
            pagination : '.swiper-pagination',
            paginationElement : 'span',
            autoplayDisableOnInteraction : false
        })
        $(".i_e_button").click(function () {
            let city = JSON.parse(locationStorage().get("currentCity")).city;
            new experienceAlert({
                mask:true,
                areaId:self.cityCode[city].code
            })
        });
        $(".locationArea").click(function () {
            new locationModal({
                locationCode:self.locationCode
            });
        });
    }
}