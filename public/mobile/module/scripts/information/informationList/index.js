/**
 * Created by Administrator on 2017/6/6.
 */
import $ from 'jquery'
import { evaluate ,getQueryString, locationStorage, parseParams } from '../../../plugin/global'
import { fetchCity } from '../../../plugin/globalServer'
import { areaDom } from './areaDom'
import handlebars from 'handlebars'
import { cookieCity, localCity }from '../../../plugin/urlCity'
import { footerData } from '../../../plugin/footArea'


export default class informationList{
    constructor(){
        this.CONFIGData = CONFIG.cacheData;
        this.renderType = $("[data-rendertype]").data("rendertype");
        this.searchName = getQueryString("searchName") || "";
        this.cache={};
        fetchCity().then((data)=>{
            this.area = data.city;
            this.city = Object.keys(data.city);
            cookieCity();
            localCity(data.locationCode);
            let localStorage = locationStorage().get("currentCity") || "{}";
            this.cache.city =  JSON.parse(localStorage).city || "广州市";
            this.currentRegion = data.city[this.cache.city];
            if(this.renderType ==="schoolList" ){
                this.region = getQueryString("region") || "unlimit";
                this.schoolListEvent();
                this.domEvent();
                this.initCacheData();

            }else if(this.renderType ==="schoolDetail"){
                this.domEvent();
                // this.initQueryData();
            }else{
                this.domEvent();
                this.initCacheData();

            }
        })
    }
    schoolListEvent(){
        this.currentRegion = this.currentRegion.map(function (item,index) {
          let obj = item;
          obj.typeNo = "b"+(index+1);
          return obj
        })
        let temp = handlebars.compile(areaDom);
        let dom = temp(this.currentRegion);
        $('.searchCondition').append(dom)
    }
    initCacheData(){
      let stringCount = 0;
      let strings = "";
      let parseObj = null;
      let itemName = "";
     if(this.renderType === "dataDownloadList"){
       stringCount = 9
       if(CONFIG.cacheData){
         strings = CONFIG.cacheData.queryString.substring(stringCount);
         parseObj = parseParams(strings)
       }
       if(!parseObj.arr){
         parseObj.arr = [];
       }
       parseObj.arr.forEach(function (value) {
         itemName =  $("[data-typeno="+value+"]").addClass("activeListClickQuery").data("itemname")+"、"+itemName
       })
       $("input[name='科目']").val(parseObj.b);
       $("input[name='年级']").val(parseObj.a);

     }else if(this.renderType === "schoolList"){
       stringCount = 7;
       if(CONFIG.cacheData){
         strings = CONFIG.cacheData.queryString.substring(stringCount);
         parseObj = parseParams(strings)
       }
       if(!parseObj.arr){
         parseObj.arr = [];
       }
       parseObj.arr.forEach(function (value) {
         itemName =  $("[data-typeno="+value+"]").addClass("activeListClickQuery").data("itemname")+"、"+itemName
       })
       $("input[name='年级']").val(parseObj.a);
       $("input[name='region']").val(parseObj.b);
       $("input[name='级别']").val(parseObj.c);

     }else if(this.renderType === "studyNewsList"){
       stringCount = 6;
       if(CONFIG.cacheData){
         strings = CONFIG.cacheData.queryString.substring(stringCount);
         if(strings){
           itemName = $("[data-queryitem="+strings+"]").addClass("activeListClickQuery").data("itemname")
         }
       }
     }

      $(".searchSumType").text(itemName);
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
           let typeno = $(this).data("typeno");
           let name = "";

           switch(category){
               case "年级":
                   $("input[name='年级']").val(typeno);

                   break;
               case "科目":
                   $("input[name='科目']").val(typeno);

                   break;
               case "类目":
                 if(self.renderType === "studyNewsList"){
                   typeno = queryitem
                 }
                   $("input[name='类目']").val(typeno);
                   break;
               case "级别":
                   $("input[name='级别']").val(typeno);

                   break;
               case "region":
                   $("input[name='region']").val(typeno);

                   break;
           }


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



            if(self.renderType === "dataDownloadList"){
              window.location.href = "/xiazai/"+CONFIG.city+"/download-"+subject+grade+"/"
            }else if(self.renderType === "schoolList"){
                window.location.href = "/schools/"+CONFIG.city+"/school-"+grade+region+level+"/"

            }else if(self.renderType === "parentsQaList"){
                window.location.href = "/information/"+self.renderType +"/"+ (grade || "unlimit")
                    +"/"+CONFIG.cityID+"/0"

            }else if(self.renderType === "studyNewsList"){
                window.location.href = "/"+CONFIG.city +"/wuyou/wuyou-"+type+"/"
            }
        });
    }
}