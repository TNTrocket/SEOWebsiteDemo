import $ from 'jquery'
/**
 *pc弹窗基类
 */
export  default class pcModal{
  constructor(option) {
    if(option){
      this.event = option.event || "";
      this.mask =  option.mask  || false;
    }
    this.maskDom = "<div class='mask'>"+"</div>";
    this.bodyDom = $("body");
  }
  init(){
    $(".mask").remove();
    $(this.element).remove();
    this.show();
    this.mask && this.showMask();
    for(let a in this.event){
      let eventType = a.split(":")[0];
      let eventDom  = a.split(":")[1];
      $(eventDom).on(eventType,this.event[a]);
    }
  }
  show(){
    this.bodyDom.append(this.dom);
    this.bodyDom.addClass("disableScroll");

  }
  hide(){
    $(this.element).remove();
    this.hideMask();
    this.bodyDom.removeClass("disableScroll");
  }
  showMask(){
    this.getWidthAndHeight();
    this.bodyDom.append(this.maskDom);
    $(".mask").css({
      "width": this.width,
      "height": this.height
    })
  }
  hideMask(){
    $(".mask").remove();
  }
  getWidthAndHeight(){
    this.height = document.body.scrollHeight;
    this.width =  document.body.scrollWidth;
  }
}