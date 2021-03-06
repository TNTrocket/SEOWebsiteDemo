import $ from 'jquery'
import modal from '../plugin/modal'
import { locationStorage } from '../plugin/global'
import handlebars from 'handlebars'

export  default  class locationModal extends modal {
    constructor(option,callback) {
        super();
        let self = this;
        let pageType = $("#pageType").data("pagetype");
        let obj = {};
        let oldDate = JSON.parse(locationStorage().get("currentCity")) || {};
        let locationObj = Object.assign({},oldDate);
        this.locationArr = option.locationCode.map(function (value) {
          return value.code;
        })
          this.event = {
                "click:[data-role=close]": function () {
                    self.hide()
                },
                "click:[data-location]": function (e) {
                    let location = $(this).data("locationname");
                    let city = $(this).data("location");
                    let locationTxt = $(".locationTxt");
                    obj.city = city;
                    window.locationName = location;
                  locationObj.city = location;
                  locationStorage().set("currentCity",JSON.stringify(locationObj));
                    self.hide();
                    typeof callback === "function" && callback(obj);
                    if(pageType === "index"){
                        window.location.href = "/"+city+"?local=true"
                    }else{
                      for (let a of self.locationArr){
                        if(window.location.pathname.indexOf(a) >-1){
                          window.location.href = window.location.pathname.replace(a,city);
                          break;
                        }
                      }

                    }
                }
            }
            this.temp = '<div class="globalModal locationModal">'+
                '<div class="tooltip">'+
                '<div class="close" data-role ="close" ></div>'+
                '<div>当前城市：<span class="locationModalName"></span></div>'+
                '</div>'+
                '<ul>'+
                '{{#each this}}'+
                '<li data-locationname="{{name}}" data-location="{{code}}">{{name}}</li>'+
                '{{/each}}'+
                '</ul></div>';

        let temp = handlebars.compile(this.temp);
        let html = temp(option.locationCode);
        this.dom = html;

        self.init();
        let localstorage = locationStorage().get("currentCity") || "{}";
        let city = JSON.parse(localstorage).city || "广州市";
        $(".locationModalName").text(city)
    }
}

