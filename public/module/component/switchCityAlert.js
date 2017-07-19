/**
 * Created by Administrator on 2017/7/14.
 */
import $ from 'jquery'
import modal from '../plugin/modal'


export  default  class switchCityAlert extends modal {
    constructor(option,callback) {
        super(option);
        let self = this;
        this.callbackFn = (typeof callback === "function") ? callback : function () {}
        this.touchMove = true;
        this.event = {
            "click:.mask" : function () {
                self.hide();
                self.callbackFn("cancel")
            },
            "click:.switchConfirm" : function () {
                // self.hide();
                self.callbackFn("confirm")
            },
            "click:.switchCancel" : function () {
                self.hide();
                self.callbackFn("cancel")
            },
        };
        this.dom = '<div class="switchCityAlert success globalModal">' +
            '<p class="successTxt">提示</p>' +
            '<p class="tips">当前定位城市更改为'+ option.cityName+'，是否切换？</p>' +
                '<div class="switchBtn">'+
                '<div class="switchConfirmBOX">' +
            '<div class="switchConfirm">确定</div>' +
            '</div>'+
            '<div class="switchCancelBOX">' +
            '<div class="switchCancel">取消</div>' +
            '</div>'+
                '</div>'+
            '</div>';

        this.init();
        this.forbidTouch();
    }
    hide(){
       $(".switchCityAlert ").remove();
       $(".mask").remove();
    }
    forbidTouch(){
        let self = this;
        $("body").off("touchmove").on("touchmove",function (e) {
            if(self.touchMove){
                e.preventDefault();
            }
        })
    }
}