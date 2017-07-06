import $ from 'jquery'

export  default class modal {
    constructor(option) {
      if(option){
        this.event = option.event || "";
        this.mask =  option.mask  || false;
      }
      this.maskDom = "<div class='mask'>"+"</div>";
    }
    init(){
      $(".mask").remove();
      $(".globalModal").remove();
      this.mask && this.showMask();
      this.show();
      for(let a in this.event){
          let eventType = a.split(":")[0];
          let eventDom  = a.split(":")[1];
          $(eventDom).on(eventType,this.event[a]);
      }
    }
    show(){
        let globalModal = $(".globalModal");
        if(globalModal.length>0){
            globalModal.show();
        }else{
            $("body").append(this.dom);
            $(".globalModal").show();
        }
    }
    hide(){
        let globalModal = $(".globalModal");
        globalModal.remove();
    }
    showMask(){
        $("body").append(this.maskDom);
    }
    hideMask(){
        $(".mask").remove();
    }
}