import $ from "jquery"
import basic from '../global/basic'
import { fetchCity } from '../global/server'
import { localStorage }from'../global/global'


export default class teacherComments extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    });
  }
  initData(){
    let self = this;
    this.commentType = "";
    this.vmList = $(".viewMoreList");
    this.vmListCount = null;
    this.pageSize = 10;
    this.clickViewMoreTimes = 2;
    this.commentListHeight = $(".t_commentsList");
    this.singleListHeight = $(".singleList").height() + 1;
    this.goodCommentList = $(".goodCommentList");
    this.midCommentList = $(".midCommentList");
    this.badCommentList = $(".badCommentList");
    this.goodCommentCount = Math.ceil($(".goodCommentList .singleList").length/this.pageSize);
    this.midCommentCount = Math.ceil($(".midCommentList .singleList").length/this.pageSize);
    this.badCommentCount = Math.ceil($(".badCommentList .singleList").length/this.pageSize);

    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this),
      "click:[data-comment]":function (e) {
        self.commentType = $(this).data("comment");
        $(this).addClass("queryListActive").siblings("li").removeClass("queryListActive");
        switch (self.commentType){
          case "good":
            self.goodCommentList.fadeIn().siblings("div").hide();
            self.isNeedViewMoreList = self.goodCommentCount;
            break;
          case "mid":
            self.midCommentList.fadeIn().siblings("div").hide();
            self.isNeedViewMoreList = self.midCommentCount;
            break;
          case "bad":
            self.badCommentList.fadeIn().siblings("div").hide();
            self.isNeedViewMoreList = self.badCommentCount;
            break;
        }

      },
      "click:.viewMoreList":this.showMoreContent.bind(this)
    }
  }
  showMoreContent(){
    if(this.clickViewMoreTimes >= Math.max(this.goodCommentCount,this.midCommentCount,this.badCommentCount)){
      this.isNeedViewMoreList = 0;
      return false;
    }
    this.commentListHeight.css("max-height",this.clickViewMoreTimes*this.pageSize*this.singleListHeight);
    this.clickViewMoreTimes++;
  }
  btnViewMore(){
    let btnViewMore = $(".btnViewMore");
    if(!btnViewMore.data("btnViewMore")){
      this.footerEvaluate = true;
      btnViewMore.text("收起")
      btnViewMore.data("btnViewMore",true)
    }else{
      btnViewMore.text("查看更多")
      this.footerEvaluate = false;
      btnViewMore.data("btnViewMore",false)
    }
  }
  get isNeedViewMoreList(){
    if(this.vmListCount >1){
      this.vmList.show();
    }else{
      this.vmList.hide();
    }
  }
  set isNeedViewMoreList(value){
    this.vmListCount = value;
    this.isNeedViewMoreList
  }
  initCommentsCount(){
    this.isNeedViewMoreList = this.goodCommentCount;
    this.commentListHeight.css("max-height",this.pageSize*this.singleListHeight);

  }
  render(){
      this.initCommentsCount();
      this.bindEVent();
  }
}