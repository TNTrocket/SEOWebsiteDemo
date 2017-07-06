/**
 * Created by Administrator on 2017/6/6.
 */
import $ from 'jquery'
import { evaluate ,getQueryString } from '../../../plugin/global'
import { fetchCity } from '../../../plugin/globalServer'




export default class informationList{
    constructor(){
        this.domEvent();
        this.page = 0;
        this.itemname = "";
        this.renderType = $("[data-rendertype]").data("rendertype");
        this.searchName = getQueryString("searchName") || "";
        if(this.searchName){
            $(".searchSumType").text(decodeURIComponent(this.searchName));
        }
        if(this.renderType ==="schoolList" ){
            fetchCity().then((data)=>{
                this.area = data;
                this.city = Object.keys(data);
                this.domEvent();
            })
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
           }
            self.itemname += itemname+"、";
            $(this).addClass('activeListClickQuery');
            $(this).closest("li").siblings("li").children("a").removeClass("activeListClickQuery");
        });
        $(".searchButton").click(function () {
            searchHideBox.removeClass("displayBlock");
            let subject = $("input[name='科目']").val();
            let grade = $("input[name='年级']").val();
            let type =  $("input[name='类目']").val();
            // let searchName = (subject ? subject+"、" : ""  ) + (grade ? grade+"、" : ""  ) + (type ? type+"、" : ""  );
            let newSearchName = self.itemname.replace(/、$/,"");
            if(self.renderType === "dataDownloadList"){
                window.location.href = "/information/"+self.renderType +"/"
                    + (grade || "unlimit")+"/"+(subject ||"unlimit" ) +"/0"+"?searchName="+newSearchName
            }else{
                window.location.href = "/information/"+self.renderType +"/"+ (type || "unlimit")
                    +"/0"+"?searchName="+newSearchName
            }
        });
    }
}