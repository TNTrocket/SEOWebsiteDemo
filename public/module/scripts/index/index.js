import $ from 'jquery'
import Swiper from 'swiper'
import {  navEvent, locationStorage, evaluate } from '../../plugin/global'
import locationModal from '../../component/locationModal'
import experienceAlert from  '../../component/experienceAlert'
import { fetchCity, searchCity } from '../../plugin/globalServer'
import { footerData } from '../../plugin/footArea'

export default class homePage{
    constructor(){
        fetchCity().then((data)=>{
            console.log(data);
            this.city = Object.keys(data.city);
            this.cityCode = data.cityCode;
            this.locationCode = data.locationCode;
            searchCity().then((city) =>{
                console.log("city",city);
                this.currentCity = (city && this.city.indexOf(city) > -1)? city : "广州市";
                locationStorage().setLocationStorage("city",this.currentCity);
                $(".locationTxt").text(this.currentCity);
                this.domEvent();
            },(error) =>{
                this.currentCity = "广州市";
                locationStorage().setLocationStorage("city",this.currentCity);
                $(".locationTxt").text(this.currentCity);
                this.domEvent();
            })
        })
    }
    domEvent(){
        navEvent();
        evaluate();
        new footerData({

        });
        let self = this;
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
            // let temp = handlebars.compile(locationTemp);
            // let dom = temp(self.locationCode);
            new locationModal({
                locationCode:self.locationCode
            });
        });
        this.initFooterData()
    }
    initFooterData(){
        let txt = this.currentCity || locationStorage().getLocationStorage("city");
        txt = txt.replace("市","");
        $(".familyEducationBox .placeName").text(txt);
    }
}