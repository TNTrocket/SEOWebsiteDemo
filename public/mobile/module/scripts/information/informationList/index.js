/**
 * Created by Administrator on 2017/6/6.
 */
import $ from 'jquery'
import { evaluate ,getQueryString, locationStorage, isEmptyObject } from '../../../plugin/global'
import { fetchCity } from '../../../plugin/globalServer'
import { areaDom } from './areaDom'
import handlebars from 'handlebars'
import { informationListCode } from './informationListCode'
import { footerData } from '../../../plugin/footArea'


export default class informationList{
    constructor(){
        this.CONFIGData = CONFIG.cacheData;
        this.itemNameObj = {};
        this.itemNameStr = "";
        this.renderType = $("[data-rendertype]").data("rendertype");
        this.searchName = getQueryString("searchName") || "";
        this.categoryName = "";
        this.cache={}
        fetchCity().then((data)=>{
            this.area = data.city;
            this.city = Object.keys(data.city);
            this.cache.city =  locationStorage().get("city") || "广州市";
            this.currentRegion = data.city[this.cache.city];
            if(this.renderType ==="schoolList" ){
                this.region = getQueryString("region") || "unlimit";
                this.schoolListEvent();
                this.domEvent();
                this.initCacheData();
                this.initQueryData();
            }else if(this.renderType ==="schoolDetail"){
                this.schoolDetail();
                this.domEvent();
                this.initQueryData();
            }else{
                this.domEvent();
                this.initCacheData();
                this.initQueryData();
            }
        })
    }
    schoolDetail(){
        // $(".schoolControl >div").click(function () {
        //     window.location.href = $(this).data("href")+ window.location.search
        // })
    }
    schoolListEvent(){
        // $(".hotSchool >li").click(function () {
        //     let href = $(this).data("href");
        //     window.location.href = href+"?city="+locationStorage().get("city");
        // })
        let temp = handlebars.compile(areaDom);
        let dom = temp(this.currentRegion);
        $('.searchCondition').append(dom)
        // $("[data-schoollist]").click(function () {
        //     window.location.href = $(this).data("href")+"?city="+locationStorage().get("city");
        // })
    }
    initCacheData(){
     if(!isEmptyObject(this.CONFIGData)){
         for(let a in  this.CONFIGData){
             $("[data-queryitem='"+this.CONFIGData[a]+"']").addClass("activeListClickQuery");
         }
     }
     if(this.renderType === "dataDownloadList"){
         let grade = getQueryString("grade");
         let subject = getQueryString("subject");
         grade && (function () {
             $("input[name='年级']").val(grade);
         })()
         subject && (function () {
             $("input[name='科目']").val(subject);
         })()

     }else if(this.renderType === "schoolList"){
         let grade = getQueryString("grade");
         let level = getQueryString("level");
         let region = decodeURIComponent(getQueryString("region"));
         grade && (function () {
             $("input[name='年级']").val(grade);
         })()
         level && (function () {
             $("input[name='级别']").val(level);
         })()
         region && (function () {
             $("input[name='region']").val(region);
         })()

     }
    }
    initQueryData(){
       let searchSumType = $(".searchSumType");
       let grade,level,region,searchName,subject;
       if(this.renderType === "studyNewsList"){
            searchName = decodeURIComponent(getQueryString("searchName") || "") ;
            searchSumType.text(searchName);

       }else if(this.renderType === "parentsQaList"){
            searchName = decodeURIComponent(getQueryString("searchName") || "");
            searchSumType.text(searchName);

       }else if (this.renderType === "dataDownloadList"){
           grade = getQueryString("grade")|| "";
           subject = getQueryString("subject")|| "";
           let gradeName = informationListCode[grade] || "";
           let subjectName = informationListCode[subject] || "";
           searchSumType.text((gradeName+"、"+subjectName).replace(/、$/,""));

       }else if(this.renderType === "schoolList"){
           grade = getQueryString("grade")|| "";
           level = getQueryString("level")|| "";
           region = decodeURIComponent(getQueryString("region") || "");
           let gradeName = informationListCode[grade] || "";
           let levelName = informationListCode[level] || "";
           if (region === "unlimit"){
               region = ""
           }
           searchSumType.text((gradeName+"、"+levelName +"、"+region).replace(/、*$/,""));
       }
    }
    domEvent(){
        let searchSum = $(".searchSum");
        let searchHideBox = $(".searchHideBox");
        let self = this;
        evaluate();
        new footerData(
            {
                city:   this.cache.city,
                area:  this.currentRegion
            }
        );
        searchSum.on("click",function (e) {
            e.stopPropagation();
            searchHideBox.toggleClass("displayBlock")
        });
        $("[data-queryitem]").click(function () {
           let queryitem = $(this).data("queryitem");
           let itemname = $(this).data("itemname");
           let category = $(this).data("querycategory");
           let name = "";

           switch(category){
               case "年级":
                   $("input[name='年级']").val(queryitem);
                   self.itemNameObj.grade = itemname;
                   break;
               case "科目":
                   $("input[name='科目']").val(queryitem);
                   self.itemNameObj.subject = itemname;
                   break;
               case "类目":
                   $("input[name='类目']").val(queryitem);
                   self.itemNameObj.category = itemname;
                   break;
               case "级别":
                   $("input[name='级别']").val(queryitem);
                   self.itemNameObj.class = itemname;
                   break;
               case "region":
                   $("input[name='region']").val(queryitem);
                   self.itemNameObj.region = itemname;
                   break;
           }

           // for(let b of Object.keys(self.itemNameObj)){
           //     name += self.itemNameObj[b]+"、"
           // }
            name =  self.itemNameObj.category || self.itemNameObj.grade;
            self.itemNameStr = name;
           console.log( self.itemNameStr);

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
            let newSearchName = self.itemNameStr || "";
            // let listData ={
            //     subject , grade , level, region
            // };

            console.log(newSearchName);
            if(self.renderType === "dataDownloadList"){
                window.location.href = "/information/"+self.renderType +"/"
                    + (grade || "unlimit")+"/"+(subject ||"unlimit" ) +"/"+CONFIG.cityID+"/0"+"?searchName="+newSearchName+
                "&grade="+(grade || "unlimit")+"&subject="+(subject || "unlimit");
            }else if(self.renderType === "schoolList"){
                window.location.href = "/information/"+self.renderType +"/"+ (grade || "unlimit")+"/"+
                    (level || "unlimit")+"/"+CONFIG.cityID+"/unlimit/0"+"?searchName="+newSearchName+"&city="+locationStorage().get("city")
                    +"&region="+(region || "unlimit")+ "&grade="+(grade || "unlimit")+"&level="+(level || "unlimit")

            }else if(self.renderType === "parentsQaList"){
                window.location.href = "/information/"+self.renderType +"/"+ (grade || "unlimit")
                    +"/"+CONFIG.cityID+"/0"+"?searchName="+newSearchName
            }else{
                window.location.href = "/information/"+self.renderType +"/"+ (type || "unlimit")
                    +"/"+CONFIG.cityID+"/0"+"?searchName="+newSearchName
            }
        });
    }
}