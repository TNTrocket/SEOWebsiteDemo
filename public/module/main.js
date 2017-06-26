import $ from 'jquery'
import { informationList, information, foreignTeacher } from './commonRoutes'

//移动端适配
let isIphone = window.navigator.appVersion.match(/iphone/gi);
let isAndroid = window.navigator.appVersion.match(/android/gi);
// if( isIphone || isAndroid){
let deviceWidth = document.documentElement.clientWidth;
if(deviceWidth > 750){deviceWidth = 750;}
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
// }
let type = $("#pageType").data("pagetype");

switch (type){
    case "index":
        // require("./scripts/index/index")
        break;
    case "information":
        new information();
        break;
    case "informationList":
         new informationList();
        break;
    case "foreignTeacher":
        new foreignTeacher();
        break;
}


