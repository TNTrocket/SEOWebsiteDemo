/**
 * Created by Administrator on 2017/7/14.
 */
import $ from 'jquery'
import modal from '../plugin/modal'



export  default  class alert extends modal {
    constructor(option,callback) {
        super(option);
        this.touchMove = true;
        this.event = {

        };
        this.dom = '<div class="normalAlert success globalModal">' +
            '<p class="successTxt">提示</p>' +
            '<p class="tips">请先选择区域</p>' +
            '</div>';
        this.init();
        this.forbidTouch();
        this.hide();
    }
    hide(){
        let self = this;
        setTimeout(function () {
            self.touchMove = false;
            $(".normalAlert ").remove();
            $(".mask").remove();
        },2000)
    }
    forbidTouch(){
        let self = this;
        $("body").on("touchmove",function (e) {
            if(self.touchMove){
                e.preventDefault();
            }
        })
    }
}

