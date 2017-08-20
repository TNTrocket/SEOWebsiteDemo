import pcModal from'./pcModal'
import $ from 'jquery'
import { verifyCode, findTeacherWithSmsCode } from '../global/server'

export default class demandModal extends pcModal{
  constructor(option){
    super(option)
    this.tiemOut = 60;
    this.areaId = option.areaId;
    this.realname = option.realname;
    this.initDom();
  }
  initDom(){
    this.element = ".demandModal";
    this.dom = "<div class='demandModal globalModal'>" +
      "<div class='tipTitle'>请验证手机号，我们会尽快与您匹配最合适的老师</div>"+
      "<div class='phoneInput'>" +
        "<div class='phone'><input name='phone' placeholder='请输入手机号'/></div>" +
        "<div class='code' data-verifycode='code'>获取验证码</div>"+
      "</div>"+
      "<div class='verifyCodeInput'>" +
       "<input name='code' placeholder='请输入验证码'/>"+
      "</div>"+
      "<div class='error'></div>"+
      "<div class='noCodeTips'>收不到验证码？拨打客服电话400-612-535</div>" +
      "<div class='btn' data-verifybtn = 'sure'>确定</div>"+
      "<div class='close' data-verifybtn = 'close'></div>"+
      "</div>";

    this.successDom = "<div class='demandModal globalModal success'>" +
      "<div class='successTxt'>您的需求我们已经收到，课程顾问会尽快联系您</div>"+
      "<div class='successTip'>有疑问请拨打客服电话：400-612-5351</div>"+
      "<div class='successBtn'>确定</div>"+
      "</div>";

    let self = this;
    this.event={
      "click:[data-verifycode]":function (e) {
        if(!self.verifyInput("code")){
          return false;
        }
        let isClick = $(this).data("isClick");
        if(!isClick){
          let phone = $("input[name='phone']").val();
          let authCode = $("[data-verifycode='code']");
          $(this).data("isClick",true);
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
                authCode.data("isClick",false);
                return false;
              }
              self.tiemOut--;
              authCode.text(self.tiemOut);
            },1000)
          },()=>{
            $(".error").text("获取验证码失败");
            authCode.data("isClick",false);
          })
        }
      },
      "click:[data-verifybtn]":function (e) {
        let verifybtnCode = $(this).data("verifybtn");

        if(verifybtnCode === "close"){
          self.hide();

        }else if(verifybtnCode === "sure"){
          if(!self.verifyInput("sure")){
            return false;
          }
          let phone = $("input[name='phone']").val();
          let code = $("input[name='code']").val();
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
              $(".error").text(data.message);
            }

          },()=>{
            $(".error").text("验证码错误或网络错误");
          })
        }
      },
      "click:.successBtn":function (e) {
        self.hide();
      }
    }

    this.init();
  }
  verifyInput(type){
    let phone = $("input[name='phone']").val();
    let code = $("input[name='code']").val();
    let reg = /^1(3|4|5|7|8)\d{9}$/;
    let error = $(".error");
    if(type === "sure"){
      if(!code) {
        error.text("请输入验证码");
        return false;
      }
    }

      if(reg.test(phone)){
        return true;
      }else{
        error.text("请输入正确的手机号");
        return false;
      }

  }
  
}