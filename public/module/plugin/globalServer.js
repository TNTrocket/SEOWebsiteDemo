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
        let citylocation = null;
            //设置城市信息查询服务
            citylocation = new qq.maps.CityService();
            //请求成功回调函数
            citylocation.setComplete(function(result) {
                // alert(result.detail.name)
                // CONFIG.city = result.detail.name
                resolve(result.detail.name)
            });
            //请求失败回调函数
            citylocation.setError(function() {
                alert("城市定位出错");
                reject({code:"fail"})
            });
            citylocation.searchLocalCity();
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
