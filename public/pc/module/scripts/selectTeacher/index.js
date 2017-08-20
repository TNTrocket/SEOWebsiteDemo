import $ from "jquery"
import basic from '../global/basic'
import { fetchCity, selectTeacherAPI } from '../global/server'
import { localStorage }from'../global/global'
import handlebars from 'handlebars'

export default class selectTeacher extends basic{
  constructor(){
    super({
      isNeedFetchCity : true
    })
  }
  initData(){
    this.query = {};
    this.teacherQuery ={};
    this.eventList={
      "click:.btnViewMore":this.btnViewMore.bind(this)
    }
  }
  btnViewMore(){
    let btnViewMore = $(".btnViewMore");
    if(!btnViewMore.data("btnViewMore")){
      this.footerEvaluate = true;
      btnViewMore.text("收起");
      btnViewMore.data("btnViewMore",true);
    }else{
      btnViewMore.text("查看更多");
      this.footerEvaluate = false;
      btnViewMore.data("btnViewMore",false);
    }
  }
  initQueryDom(){
    let teacherQueryObj = {};
    teacherQueryObj.teacherQueryArr = [];
    let obj1 = {name:"授课年级：",item:this.query.grade,inputName:"grade"};
    let obj2 = {name:"教学科目：",item:this.query.subject,inputName:"subject"};
    let obj3 = {name:"授课区域：",item:this.query.area,inputName:"area"};
    let obj4 = {name:"老师性别：",item:this.query.gender,inputName:"teachergender"};
    let obj5 = {name:"老师类型：",item:this.query.teacherType,inputName:"teachertype"};
    let obj6 = {name:"老师特点：",item:this.query.tags,inputName:"teachertags"};
    teacherQueryObj.teacherQueryArr.push(obj1,obj2,obj3,obj4,obj5,obj6);
    let teacherQueryTpl = $("#teacherQueryTpl").html();
    let teacherQueryTplDom = handlebars.compile(teacherQueryTpl);
    let teacherQueryTplHtml = teacherQueryTplDom(teacherQueryObj);
    $(".teacherQuery").html(teacherQueryTplHtml);

    let obj7 = {item:this.query.orderBy,inputName:"orderBy"};
    let orderByTpl = $("#orderByTpl").html();
    let orderByTplDom = handlebars.compile(orderByTpl);
    let orderByTplHtml = orderByTplDom(obj7);
    $(".orderByQuery").html(orderByTplHtml);
  }
  parseParamsQuery(teacherQueryData){
    let queryString = CONFIG.queryString.substring(2);
    let temp = {};
    for(let key in teacherQueryData){
      temp[key] = [];

      teacherQueryData[key].forEach(function (item,index) {
        let active = false;
        let reg = new RegExp(item.typeno[0]+"\\d+");
        let newParseString = ""
        if(queryString.indexOf(item.typeno[0]) > -1){
          newParseString = queryString.replace(reg,item.typeno);
          active = queryString.match(reg)[0] === item.typeno
        }else{
          newParseString = queryString + item.typeno;
        }

        if((queryString.indexOf("g") === -1) && (key === "g") && index === 0){
           active = true;
        }
        let itemObj = {
          code : item.code,
          name : item.name,
          typeno : newParseString || item.typeno,
          active : active
        };
        if(index === 0 && key !== "g"){
          let unlimit = queryString.replace(reg,"");
          temp[key].unshift({
            typeno :  unlimit,
            active : queryString.indexOf(item.typeno[0]) === -1
          })
        }
        temp[key].push(itemObj)
      })
    }
    this.teacherQuery = temp;
  }
  render(){
      selectTeacherAPI({method:"get"}).then((teacherQuery) =>{
        console.log(teacherQuery)
        this.parseParamsQuery(teacherQuery);
        this.query.grade = this.teacherQuery.a;
        this.query.subject = this.teacherQuery.b;
        this.query.area = this.teacherQuery.c;
        this.query.gender = this.teacherQuery.d;
        this.query.teacherType = this.teacherQuery.e;
        this.query.tags = this.teacherQuery.f;
        this.query.orderBy = this.teacherQuery.g;
        this.initQueryDom();
        this.bindEVent();
    })
  }
}