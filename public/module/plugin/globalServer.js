/**
 * Created by Administrator on 2017/7/6.
 */
import { apiCall } from "../plugin/xhr"
export function fetchCity(){
    return new Promise((resolve,reject)=>{
        apiCall.simpleCall("/user/open/area",{method:"get"}).then((data)=>{
            let dataResult = data;
            let obj = {};
            let allObj = {};
            allObj.cityCode = {};
            allObj.locationCode = [];
            for(let item of dataResult){
                let temp ={};
                obj[item.a_name] = [];
                allObj.cityCode[item.a_name] = item.a_id;
                temp.name = item.a_name;
                temp.code = item.a_id;
                allObj.locationCode.push(temp);
                for (let a of item.districts){
                    let data = {
                        itemName : a.a_name,
                        code     : a.a_id
                    }
                    obj[item.a_name].push(data)
                }
            }
            allObj.city = obj;

            console.log(allObj)
            resolve(allObj)
        })
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
