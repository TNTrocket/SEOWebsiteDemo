import Swiper from 'swiper'
import $ from 'jquery'
import locationModal from '../../component/locationModal'
import { evaluate, locationTemp, isEmptyObject, navEvent,locationStorage } from '../../plugin/global'
import { fetchCity } from '../../plugin/globalServer'
import handlebars from 'handlebars'


export  default class information{
   constructor(){
       this.locationModalDom = "";
       this.city = null;
       this.currentCity = (isEmptyObject(CONFIG.city) || this.city.indexOf(CONFIG.city) === -1)? "广州市" : CONFIG.city;
       locationStorage().setLocationStorage("city",this.currentCity);
       let schoolListNav = $('#schoolListNav');
       schoolListNav.attr("href","/information/schoolList/unlimit/unlimit/0?city="+this.currentCity+"&region=unlimit");
       $(".locationTxt").text(this.currentCity);
       fetchCity().then((data)=>{
           console.log(data);
           this.city = Object.keys(data);
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
            switch (type){
                case "eduInfo":
                    self.move(step,worryFreeInfoContent,selfDom);
                    break;
                case "entranceStrategy":
                    self.move(step,worryFreeInfoContent,selfDom);
                    break;
                case "cupInfo":
                    self.move(step,worryFreeInfoContent,selfDom);
                    break;
                case "attainment":
                    self.move(step,worryFreeInfoContent,selfDom);
                    break;
                case "recommend":
                    self.move(step,worryFreeInfoContent,selfDom);
                    break;
                case "psData":
                    self.move(step,downloadList,selfDom);
                    break;
                case "jhsData":
                    self.move(step,downloadList,selfDom);
                    break;
                case "shsData":
                    self.move(step,downloadList,selfDom);
                    break;
                case "firstGrade":
                    self.move(step,questionsList,selfDom);
                    break;
                case "secondGrade":
                    self.move(step,questionsList,selfDom);
                    break;
                case "Exam":
                    self.move(step,questionsList,selfDom);
                    break;
                case "collegeExam":
                    self.move(step,questionsList,selfDom);
                    break;
                case "primary":
                    self.move(step,questionsList,selfDom);
                    break;
            }
        });

        $(".locationArea").click(function () {
            let temp = handlebars.compile(locationTemp);
            let dom = temp(self.city);
            new locationModal({dom});
        });

        evaluate();
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

