/**
 * Created by Administrator on 2017/6/23.
 */
import $ from 'jquery'
import Swiper from 'swiper'
import experienceAlert from  '../../component/experienceAlert'
import { navEvent,evaluate, locationStorage } from '../../plugin/global'
import { fetchCity } from '../../plugin/globalServer'
import { footerData } from '../../plugin/footArea'

export default class foreignTeacher{
    constructor(){
        this.cache ={};
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
        let mySwiper = new Swiper('.swiper-container', {
            autoplay: 2000,
            pagination : '.swiper-pagination',
            paginationElement : 'li',
            autoplayDisableOnInteraction : false
        });
        $(".formButton").click(function () {
            new experienceAlert({
                mask:true
            })
        });
        navEvent();
        evaluate();
        new footerData({
            city:   this.cache.city,
            area:  this.currentRegion
        });
    }
}