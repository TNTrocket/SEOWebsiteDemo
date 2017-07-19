import $ from 'jquery'
import modal from '../plugin/modal'
import { verifyCode, findTeacherWithSmsCode } from '../plugin/globalServer'


export  default  class experienceAlert extends modal{
    constructor(option,callback) {
        super(option);
        let self = this;
        self.tiemOut = 60;
        self.areaId = option.areaId;
        self.realname = option.realname;
        self.touchMove = true;
        self.forbidTouch();
        self.event = {
            "click:.step1Btn" : function (e) {
                e.stopPropagation();
                typeof callback === "function" && callback();
                let phone = $("input[name='phone']").val();
                let code = $("input[name='code']").val();
                if(self.verifyPhone("code","step1")){
                    findTeacherWithSmsCode({data:JSON.stringify({
                        phone:phone,
                        channel: "web",
                        verifyCode: code,
                        realname: self.realname || "官网用户",
                        areaId: self.areaId ? self.areaId.toString() : "440100"
                       })
                    }).then((data) =>{
                        console.log(data);
                        if(data === true || data.success === true){
                            self.dom = self.successDom;
                            self.init();
                        }else{
                            $(".errorPhone").text(data.message);
                        }

                    },()=>{
                        $(".errorPhone").text("验证码错误或网络错误");
                    })

                }
            },
            "click:.authCode" : function (e) {
                e.stopPropagation();
                let authCode = $(".authCode");
                if(authCode.data("time")){
                    return false;
                }else{
                    let phone = $("input[name='phone']").val();
                      if(self.verifyPhone()){
                          authCode.data("time",true);
                          verifyCode({
                              method : "get",
                              data : {phone:phone}
                              // mode : "cors"
                          }).then((data)=>{
                              authCode.text(self.tiemOut);
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
                          },()=>{
                              $(".errorPhone").text("获取验证码失败");
                              authCode.data("time",false);
                          })
                      }
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
            '<input placeholder="请输入手机号码" name="phone"/>'+
            '</div></div>'+
            '<div class="e_a_inputBox">' +
            '<div class="icon password"></div>' +
            '<div>' +
            '<input placeholder="请输入验证码" name="code"/>' +
            '</div>' +
            '<div class="authCode">获取验证码 </div>' +
            '</div>' +
            '<div class="errorPhone"></div>'+
            '<div class="e_a_button step1Btn">确&nbsp;&nbsp;定</div></div>';

        self.init();
    }
    forbidTouch(){
        let self = this;
        $("body").off("touchmove").on("touchmove",function (e) {
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
    verifyPhone(type ,step){
        let phone = $("input[name='phone']").val();
        let code = $("input[name='code']").val();
        let reg = /^1(3|4|5|7|8)\d{9}$/;
        if(type === "code"){
            if(!code) {
               $(".errorPhone").text("请输入验证码")
                return false;
            }
            if(!phone || !reg.test(phone)) {
                if(step === "step1"){
                    $(".errorPhone").text("输入手机号请获取验证码")
                }else{
                    $(".errorPhone").text("输入正确的手机号")
                }
                return false;
            }
        }else{
            if(!phone || !reg.test(phone)) {
                if(step === "step1"){
                    $(".errorPhone").text("输入手机号请获取验证码")
                }else{
                    $(".errorPhone").text("输入正确的手机号")
                }
                return false;
            }
        }

        return true;
  }
}