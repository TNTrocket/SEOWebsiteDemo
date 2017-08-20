import $ from 'jquery'
import pcModal from './pcModal'
import handlebars from 'handlebars'
import dispatch from '../global/dispatch'
import { localStorage } from '../global/global'



export  default  class normalModal extends pcModal {
  constructor(option,callback) {
    super(option);
    this.txt =option.txt;
    this.init();
  }
  init(){
    let self = this;
    this.event = {
      "click:.normalModal .confirm":function (e) {
        dispatch.emit("modalConfirm");
        self.hide();
      },
      "click:.normalModal .cancel":function (e) {
        dispatch.emit("modalCancel");
        self.hide();
      }
    };
    this.element = ".normalModal";
    let template = '<div class="normalModal globalModal">' +
      '<p class="title">提示</p>' +
      '<div class="txt">'+this.txt+'</div>'+
      '<div class="btn">' +
      '<div class="confirm">确认</div><div class="cancel">取消</div>'+
      '</div>'+
      '</div>';
    let templateDom = handlebars.compile(template);
    let templateHtml = templateDom(this.cityArr);
    this.dom = templateHtml;
    super.init();
    dispatch.on("cityChange",function (data) {
      $(".cityModalTxt").text(data)
    })
  }
}