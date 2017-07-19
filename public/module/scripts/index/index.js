import $ from 'jquery'
import Swiper from 'swiper'
import {  navEvent, locationStorage, evaluate, getQueryString } from '../../plugin/global'
import locationModal from '../../component/locationModal'
import experienceAlert from  '../../component/experienceAlert'
import switchCityAlert from  '../../component/switchCityAlert'
import { fetchCity, searchCity } from '../../plugin/globalServer'
import { footerData } from '../../plugin/footArea'

export default class homePage{
    constructor(){
        fetchCity().then((data)=>{
            console.log(data);
            this.city = Object.keys(data.city);
            this.cityCode = data.cityCode;
            this.locationCode = data.locationCode;
            this.currentRegion = [];
            this.location = {};
            this.location.currentCity = locationStorage().getLocationStorage("currentCity") || "广州市";
            this.location.city = locationStorage().getLocationStorage("city") || "广州市";
            // if( this.location.currentCity !== this.location.city ){
                searchCity().then((city) =>{
                    console.log("city",city);
                    this.currentCity = (city && this.city.indexOf(city) > -1)? city : "广州市";
                    locationStorage().setLocationStorage("currentCity",this.currentCity);
                    if(this.currentCity !== this.location.city){
                        if(getQueryString("local") === "true"){
                            locationStorage().setLocationStorage("city",this.location.city);
                            this.currentRegion = data.city[this.location.city];
                            $(".locationTxt").text(this.location.city);
                        }else{
                            new switchCityAlert({
                                mask:true,
                                cityName : this.currentCity
                            },(type)=>{
                                console.log(this);
                                if(type === "confirm"){
                                    locationStorage().setLocationStorage("city",this.currentCity);
                                    window.location.href="/user/"+this.cityCode[this.currentCity]
                                }else{
                                    locationStorage().setLocationStorage("city",this.location.city);
                                    this.currentRegion = data.city[this.location.city];
                                    $(".locationTxt").text(this.location.city);
                                    this.footer = null;
                                    this.footEvent();
                                }});
                        }
                    }else{
                        locationStorage().setLocationStorage("city",this.currentCity);
                        this.currentRegion = data.city[this.currentCity];
                        $(".locationTxt").text(this.currentCity);
                    }

                    this.domEvent();
                },(error) =>{
                    this.currentCity = locationStorage().getLocationStorage("city") || "广州市";
                    $(".locationTxt").text(this.currentCity);
                    this.domEvent();
                })
            // }else{
            //     this.currentCity = locationStorage().getLocationStorage("city");
            //     this.currentRegion = data.city[this.currentCity];
            //     $(".locationTxt").text(this.currentCity);
            //     this.domEvent();
            // }

        })
    }
    footEvent(){
        this.footer = new footerData({
            city:  (this.currentCity===this.location.city)? this.currentCity : this.location.city,
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
            let city = locationStorage().getLocationStorage("city");
            new experienceAlert({
                mask:true,
                areaId:self.cityCode[city]
            })
        });
        $(".locationArea").click(function () {
            new locationModal({
                locationCode:self.locationCode
            });
        });
    }
}