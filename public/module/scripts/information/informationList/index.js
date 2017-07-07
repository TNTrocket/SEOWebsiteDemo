/**
 * Created by Administrator on 2017/6/6.
 */
import $ from 'jquery'
import { evaluate ,getQueryString, locationStorage, isEmptyObject } from '../../../plugin/global'
import { fetchCity } from '../../../plugin/globalServer'
import { areaDom } from './areaDom'
import handlebars from 'handlebars'



export default class informationList{
    constructor(){
        this.itemname = "";
        this.renderType = $("[data-rendertype]").data("rendertype");
        this.searchName = getQueryString("searchName") || "";
        if(this.searchName){
            $(".searchSumType").text(decodeURIComponent(this.searchName));
        }
        this.nextpage();
        if(this.renderType ==="schoolList" ){
            this.region = getQueryString("region") || "unlimit";
            fetchCity().then((data)=>{
                this.area = data;
                this.city = Object.keys(data);
                this.allRegion = []
                for(let a of this.city){
                    this.allRegion = this.allRegion.concat(data[a])
                }
                this.currentCity = (isEmptyObject(CONFIG.city) || this.city.indexOf(CONFIG.city) === -1)? "广州市" : CONFIG.city;
                locationStorage().setLocationStorage("city",this.currentCity);
                this.schoolListEvent();
                this.domEvent();
            })
        }else if(this.renderType ==="schoolDetail"){
            this.schoolDetail();
            this.domEvent();
        }else{
            this.domEvent();
        }
    }
    nextpage(){
        $(".next_page>div>a").click(function () {
            console.log($(this).data("href"));
            window.location.href = $(this).data("href")+ window.location.search
        })
    }
    schoolDetail(){
        $(".schoolControl >div").click(function () {
            window.location.href = $(this).data("href")+ window.location.search
        })
    }
    schoolListEvent(){
        $(".hotSchool >li").click(function () {
            let href = $(this).data("href");
            window.location.href = href+"?city="+locationStorage().getLocationStorage("city");
        })
        let temp = handlebars.compile(areaDom);
        let dom = temp(this.allRegion);
        $('.searchCondition').append(dom)
        $("[data-schoollist]").click(function () {
            window.location.href = $(this).data("href")+"?city="+locationStorage().getLocationStorage("city");
        })
    }
    domEvent(){
        let searchSum = $(".searchSum");
        let searchHideBox = $(".searchHideBox");
        let self = this;
        evaluate();

        searchSum.on("click",function (e) {
            e.stopPropagation();
            searchHideBox.toggleClass("displayBlock")
        });
        $("[data-queryitem]").click(function () {
           let queryitem = $(this).data("queryitem");
           let itemname = $(this).data("itemname");
           let category = $(this).data("querycategory");
           switch(category){
               case "年级":
                   $("input[name='年级']").val(queryitem);
                   break;
               case "科目":
                   $("input[name='科目']").val(queryitem);
                   break;
               case "类目":
                   $("input[name='类目']").val(queryitem);
                   break;
               case "级别":
                   $("input[name='级别']").val(queryitem);
                   break;
               case "region":
                   $("input[name='region']").val(queryitem);
                   break;
           }
            self.itemname += itemname+"、";
            $(this).addClass('activeListClickQuery');
            $(this).closest("li").siblings("li").children("a").removeClass("activeListClickQuery");
        });
        
        $(".searchButton").click(function () {
            searchHideBox.removeClass("displayBlock");
            let subject = $("input[name='科目']").val();
            let grade = $("input[name='年级']").val();
            let type  = $("input[name='类目']").val();
            let level = $("input[name='级别']").val();
            let region = $("input[name='region']").val();
            let newSearchName = self.itemname.replace(/、$/,"");
            if(self.renderType === "dataDownloadList"){
                window.location.href = "/information/"+self.renderType +"/"
                    + (grade || "unlimit")+"/"+(subject ||"unlimit" ) +"/0"+"?searchName="+newSearchName

            }else if(self.renderType === "schoolList"){
                window.location.href = "/information/"+self.renderType +"/"+ (grade || "unlimit")+"/"+
                    (level || "unlimit")+"/0"+"?searchName="+newSearchName+"&city="+locationStorage().getLocationStorage("city")
                    +"&region="+(region || "unlimit")

            }else{
                window.location.href = "/information/"+self.renderType +"/"+ (type || "unlimit")
                    +"/0"+"?searchName="+newSearchName
            }
        });
    }
}