import $ from 'jquery'
import modal from '../plugin/modal'
import { locationStorage } from '../plugin/global'


export  default  class locationModal extends modal {
    constructor(option) {
        super();
        let self = this;
        // this.config = {
          this.event = {
                "click:[data-role=close]": function () {
                    self.hide()
                },
                "click:[data-location]": function (e) {
                    let location = $(this).data("location");
                    let locationTxt = $(".locationTxt");
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
                    self.hide()
                }
            }
        this.dom = option.dom
        self.init();
          let city = locationStorage().getLocationStorage("city") || "广州市";
        // if (locationStorage().getLocationStorage("city")) {
            $(".locationModalName").text(city)
        // }
    }
}

