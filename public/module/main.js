import $ from 'jquery'
import * as route from './commonRoutes'

let type = $("#pageType").data("pagetype");

switch (type){
    case "index":
        // require("./scripts/index/index")
        break;
    case "information":
        new route.information();
        break;
    case "informationList":
         new route.informationList();
        break;
    case "foreignTeacher":
        new route.foreignTeacher();
        break;
    case "appDownload":
        new  route.appDownload();
        break;
    case "successCase":
        new route.successCase();
        break;
    case "contactUS":
        new route.contactUS();
        break;
    case "joinUS":
        new route.contactUS();
        break;
    case "aboutUS":
        new route.contactUS();
        break;
    case "selectTeacher":
        new  route.selectTeacher();
        break;
    case "teacherDetail":
        new  route.teacherDetail();
        break;
}


