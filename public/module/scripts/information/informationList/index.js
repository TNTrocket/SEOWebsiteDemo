/**
 * Created by Administrator on 2017/6/6.
 */
import $ from 'jquery'
import { evaluate ,getQueryString } from '../../../plugin/global'
import { informationListCode } from './informationListCode'


export default class informationList{
    constructor(){
        this.domEvent();
        this.page = 0;
        this.type = null;
        this.renderType = $("[data-rendertype]").data("rendertype");
        this.searchName = getQueryString("searchName") || "";
        if(this.searchName){
            $(".searchSumType").text(decodeURIComponent(this.searchName));
        }
    }
    domEvent(){
        let searchSum = $(".searchSum");
        let searchHideBox = $(".searchHideBox");
        let self = this;
        evaluate();

        searchSum.on("click",function () {
            searchHideBox.toggleClass("displayBlock")
        });
        $("[data-queryitem]").click(function () {
           let queryitem = $(this).data("queryitem");
            self.type =informationListCode[queryitem];
            self.typeTxt = queryitem
            $(this).addClass('activeListClickQuery');
            $(this).closest("li").siblings("li").children("a").removeClass("activeListClickQuery");
        });
        $(".searchButton").click(function () {
            console.log(encodeURI(self.typeTxt));
            searchHideBox.removeClass("displayBlock")
            window.location.href = "/information/"+self.renderType +"/"+ (self.type || 0) +"/0"
        });
    }
}