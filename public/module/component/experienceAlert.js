import $ from 'jquery'
import modal from '../plugin/modal'

export  default  class experienceAlert extends modal{
    constructor(option) {
        super(option);
        let self = this;
        self.tiemOut = 60;
        self.touchMove = true;
        self.forbidTouch();
        self.event = {
            "click:.step1Btn" : function (e) {
                e.stopPropagation();
                self.dom = self.successDom;
                self.init();
            },
            "click:.authCode" : function (e) {
                e.stopPropagation();
                let authCode = $(".authCode");
                if(authCode.data("time")){
                    return false;
                }else{
                    authCode.text(self.tiemOut);
                    authCode.data("time",true);
                    let time = setInterval(function () {
                        if(self.tiemOut === 0){
                            clearInterval(time);
                            self.tiemOut = 60;
                            authCode.text("获取验证码");
                            authCode.data("time",false);
                            return false;
                        }
                        self.tiemOut--;
                        authCode.text(self.tiemOut);
                    },1000)
                }
            },
            "click:.mask" : function () {
              self.hide();
            },
            "click:.successBtn" : function () {
                self.hide();
            }
        }

        self.successDom = '<div class="experienceAlert success globalModal">' +
            '<div class="successIcon"> </div>' +
            '<p class="successTxt">预约成功</p>' +
            '<p class="tips">工作人员会在30分钟内和你联系</p>' +
            '<div class="e_a_button successBtn">确&nbsp;&nbsp;定</div>' +
            '</div>';

        self.dom = '<div class="experienceAlert globalModal">' +
            '<div class="title">验证手机号码，我们尽快与你联系 </div>' +
            '<div class="e_a_inputBox">' +
            '<div class="icon phone"></div>' +
            '<div class="phoneBox">' +
            '<input placeholder="请输入手机号码"/>'+
            '</div></div>'+
            '<div class="e_a_inputBox">' +
            '<div class="icon password"></div>' +
            '<div>' +
            '<input placeholder="请输入验证码"/>' +
            '</div>' +
            '<div class="authCode">获取验证码 </div>' +
            '</div>' +
            '<div class="e_a_button step1Btn">确&nbsp;&nbsp;定</div></div>';

        self.init();
    }
    forbidTouch(){
        let self = this;
        $("body").on("touchmove",function (e) {
            if(self.touchMove){
                e.preventDefault();
            }
        })
    }
    hide(){
        let globalModal = $(".globalModal");
        let mask = $(".mask");
        globalModal.remove();
        mask.remove();
        this.touchMove = false;
    }
}