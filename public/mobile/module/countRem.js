/**
 * Created by Administrator on 2017/6/27.
 */
//移动端适配
let isIphone = window.navigator.appVersion.match(/iphone/gi);
let isAndroid = window.navigator.appVersion.match(/android/gi);
// if( isIphone || isAndroid){
let deviceWidth = document.documentElement.clientWidth;
if(deviceWidth > 750){deviceWidth = 750;}
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
// }