/**
 * Created by Administrator on 2017/7/6.
 */
import { apiCall } from "./xhr"
import { localStorage } from '../global/global'
export function fetchCity(){
  return new Promise((resolve,reject)=>{
    let fetchCityCacheTime = localStorage().get("fetchCityCacheTime") || 0;
    let fetchCityData = localStorage().get("fetchCityData");
    let timeNow = new Date().getTime();

    if(fetchCityData){
      fetchCityData = JSON.parse(fetchCityData);
    }
    let day = Math.floor((timeNow - fetchCityCacheTime)/(24*3600*1000));
    if(day >= 1 || !fetchCityData) {
      apiCall.simpleCall("/area/open/city", {method: "get"}).then((data) => {
        let dataResult = data;
        let obj = {};
        let allObj = {};
        allObj.cityCode = {};
        allObj.locationCode = [];
        for (let item of dataResult) {
          let temp = {};
          obj[item.a_name] = [];
          allObj.cityCode[item.a_name] = {};
          allObj.cityCode[item.a_name].code = item.a_id;
          allObj.cityCode[item.a_name].pinyin = item.a_pinyin;
          temp.name = item.a_name;
          temp.code = item.a_pinyin;
          allObj.locationCode.push(temp);
          for (let a of item.districts) {
            let data = {
              itemName: a.a_name,
              code: a.a_id
            };
            obj[item.a_name].push(data)
          }
        }
        allObj.city = obj;

        localStorage().set("fetchCityCacheTime", new Date().getTime());
        localStorage().set("fetchCityData", allObj);
        resolve(allObj)
      })
    }else{
      resolve(fetchCityData)
    }
  })
}
export function searchCity() {
  return new Promise((resolve,reject)=>{
    let geolocation = new BMap.Geolocation();
    let geocoder = new BMap.Geocoder();

    geolocation.getCurrentPosition(function(r){
      if(this.getStatus() == BMAP_STATUS_SUCCESS){
        // alert('您的位置：'+r.point.lng+','+r.point.lat);
        let point = new BMap.Point(r.point.lng, r.point.lat);
        geocoder.getLocation(point, function (result) {
          let city = result.addressComponents.city;
          resolve(city)
        });
      }
      else {
        // alert('failed'+this.getStatus());
        reject({code:"fail"})
      }
    },{enableHighAccuracy: true})
  })

}
// let domain = "http://120.25.67.145:3030";
export function verifyCode(options) {

  return new Promise((resolve,reject)=>{
    apiCall.simpleCall("/api/verify/code",options).then((data)=>{
      console.log(data);
      resolve(data)
    },()=>{
      reject()
    })
  })
}

export function findTeacherWithSmsCode(options) {
  return new Promise((resolve,reject)=>{
    apiCall.simpleCall("/api/demand/findTeacherWithSmsCode",options).then((data)=>{
      console.log(data);
      resolve(data)
    },()=>{
      reject()
    })
  })
}

export function searchGradeAndSubject(options) {
  return new Promise((resolve,reject)=>{
    apiCall.simpleCall("/diction/select/download",options).then((data)=>{
      console.log(data);
      resolve(data)
    },()=>{
      reject()
    })
  })
}

export function selectTeacherAPI(options) {
  return new Promise((resolve,reject)=>{
    apiCall.simpleCall("/diction/select/teacher",options).then((data)=>{
      console.log(data);
      let obj ={}
      let temp = {}
      for(let sa of Object.keys(data)){
        obj[sa] = [];
        if(sa === "c"){
          data[sa].forEach(function (value,index) {
            temp = {code:value.a_id, name :value.a_name,pinyin:value.a_pinyin,typeno:"c"+(index+1)}
            obj[sa].push(temp)
          })
        }else if(sa === "e"){
          for (let ba in data[sa]){
            temp = {typeno:data[sa][ba][sa+"NO"], code :data[sa][ba].type_id,name:data[sa][ba].name}
            obj[sa].push(temp)
          }
        }else if(sa === "d"){
          for (let ba in data[sa]){
            let name = "";
            if(data[sa][ba].name ==="女"){
              name = "女性老师"
            }else{
              name = "男性老师"
            }
            temp = {typeno:data[sa][ba][sa+"NO"], code :data[sa][ba].code,name:name }
            obj[sa].push(temp)
          }

        }else if(sa ==="f"){
          for (let ba in data[sa]){
            temp = {typeno:data[sa][ba][sa+"NO"], code :data[sa][ba].t_id,name:data[sa][ba].t_name}
            obj[sa].push(temp)
          }
        }else{
          for (let ba in data[sa]){
            temp = {typeno:data[sa][ba][sa+"NO"], code :data[sa][ba].code,name:data[sa][ba].name}
            obj[sa].push(temp)
          }
        }
      }
      resolve(obj)
    },()=>{
      reject()
    })
  })
}

