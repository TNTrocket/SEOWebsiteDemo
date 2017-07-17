import Swiper from 'swiper'
import $ from 'jquery'
import locationModal from '../../component/locationModal'
import { evaluate, isEmptyObject, navEvent,locationStorage } from '../../plugin/global'
import { fetchCity } from '../../plugin/globalServer'
import { footerData } from '../../plugin/footArea'

export  default class information{
   constructor(){
       this.locationModalDom = "";
       this.city = null;
       fetchCity().then((data)=>{
           console.log(data);
           this.city = Object.keys(data.city);
           this.cacheCity = locationStorage().getLocationStorage("city");
           this.currentCity = this.cacheCity? this.cacheCity : "广州市";
           this.locationCode = data.locationCode;
           $(".locationTxt").text(this.currentCity);
           this.domEvent();
       })
   }
   domEvent(){
        let self = this;
        let mySwiper = new Swiper('.swiper-container', {
            autoplay: 2000,
            pagination : '.swiper-pagination',
            paginationElement : 'span',
            autoplayDisableOnInteraction : false
        })
       navEvent();

        $(".paginationUL li").on("click",function (e) {
            e.stopPropagation();
            // var type = e.currentTarget.className;
            let selfDom =$(this);
            let type = selfDom.data("information"),worryFreeInfoContent = $(".worryFreeInfoContent"),
                downloadList = $(".downloadList"),questionsList = $(".questionsList"),step = selfDom.data("step");
            console.log(step);
        });

        $(".locationArea").click(function () {
            // let temp = handlebars.compile(locationTemp);
            // let dom = temp(self.locationCode);
            new locationModal({locationCode:self.locationCode});
        });

        evaluate();
       footerData(this.currentCity);
       this.initFooterData();
    }
   move(pageStep,dom,self) {
        if(self){
            self.children("a").addClass("activeBorder").closest("li").siblings("li").children("a").removeClass("activeBorder");
        }
        let page = pageStep || 0;
        let width = $(".slide").eq(0).width();
        let change = - page * width;
        dom.css({
            "-webkit-transform":"translate3d("+change+"px,0,0)",
            "-webkit-transition":"-webkit-transform 1s ease",
            "transform":"translate3d("+change+"px,0,0)",
            "transition":"-webkit-transform 1s ease"
        });

    }
}

