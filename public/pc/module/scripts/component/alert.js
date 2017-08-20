import $ from 'jquery'
import pcModal from './pcModal'



export  default  class alert extends pcModal {
  constructor(option,callback) {
    super(option);
    this.text = option.text;
    this.init();
  }
  init(){
    let self = this;
    this.event = {

    };
    this.element = ".normalAlert";
    this.dom = '<div class="normalAlert globalModal">' +
      '<p class="title">提示</p>' +
      '<p class="tips">'+this.text+'</p>' +
      '</div>';
    super.init();
    setTimeout(function () {
      self.hide();
    },1500)
  }
}