import $ from 'jquery'
import modal from '../plugin/modal'

export  default  class selectTeacherAlert extends modal{
    constructor(option) {
        super(option);
        let self = this;
        self.dom = option.html || "";
        self.init();
    }
    hide(){
        let globalModal = $(".globalModal");
        let mask = $(".mask");
        globalModal.remove();
        mask.remove();
    }
}