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
                    switch (location) {
                        case "广州市":
                            locationTxt.text(location);
                            locationStorage().setLocationStorage("city",location);
                            break;
                        case "深圳市":
                            locationTxt.text(location);
                            locationStorage().setLocationStorage("city",location);
                            break;
                        case "珠海市":
                            locationTxt.text(location);
                            locationStorage().setLocationStorage("city",location);
                            break;
                    }
                    self.hide();
                    typeof callback === "function" && callback(obj);
                    if(pageType === "selectTeacher"){

                    }else if(pageType === "index"){
                        window.location.href = city+"?local=true"
                    }else{
                        window.location.href = city
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
        console.log("option.locationCode===",option.locationCode)
        let temp = handlebars.compile(this.temp);
        let html = temp(option.locationCode);
        this.dom = html;

        self.init();
        let city = locationStorage().getLocationStorage("city") || "广州市";
        $(".locationModalName").text(city)
    }
}

