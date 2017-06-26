import $ from 'jquery'
import modal from '../plugin/modal'


export  default  function locationModal() {
    let self = this;
    this.config = {
        event :{
            "click:[data-role=close]":function () {
                self.hide()
            },
            "click:[data-location]":function (e) {
                let location = $(this).data("location");
                let locationTxt = $(".locationTxt");
                window.locationName = location;
                switch (location){
                    case "广州":
                        locationTxt.text("广州");
                        break;
                    case "深圳":
                        locationTxt.text("深圳");
                        break;
                    case "珠海":
                        locationTxt.text("珠海");
                        break;
                }
                self.hide()
            }
        },
        element: "locationModal"
    };
    self.dom = CMCONFIG.location;
    modal.call(self,self.config);
    self.init();
    if(window.locationName){
      $(".locationModalName").text(window.locationName)
    }
}

locationModal.prototype= new modal();





