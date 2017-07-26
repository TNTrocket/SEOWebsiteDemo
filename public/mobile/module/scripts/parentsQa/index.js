/**
 * Created by Administrator on 2017/6/6.
 */
var $ = require("jquery");
var searchCondition = $(".searchCondition");
var moreGrade = $(".moreGrade");
var moreGradeTxt = $(".moreGradeTxt");
moreGrade.on("click",function () {
    if( searchCondition.hasClass("changeHeight")){
        searchCondition.removeClass("changeHeight");
        moreGradeTxt.text("更多");
    }else{
        searchCondition.addClass("changeHeight");
        moreGradeTxt.text("收起");
    }

});