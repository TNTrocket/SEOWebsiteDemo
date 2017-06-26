import $ from 'jquery'

export  default function modal(option) {
    if(option){
        this.event = option.event || "";
    }
}

modal.prototype = {
    constructor:modal,
    init:function () {
      this.show();
      for(let a in this.event){
          let eventType = a.split(":")[0];
          let eventDom  = a.split(":")[1];
          $(eventDom).on(eventType,this.event[a]);
      }
    },
    show:function () {
        let locationModal = $(".locationModal");
        if(locationModal.length>0){
            locationModal.show();
        }else{
            $("body").append(this.dom);
            $(".locationModal").show();
        }
    },
    hide:function () {
        let locationModal = $(".locationModal")
        locationModal.hide();
    }
}