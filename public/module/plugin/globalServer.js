/**
 * Created by Administrator on 2017/7/6.
 */
import { apiCall } from "../plugin/xhr"
export function fetchCity(){
    return new Promise((resolve,reject)=>{
        apiCall.simpleCall("/user/area",{method:"get"}).then((data)=>{
            let dataResult = data;
            let obj = {};
            for(let item of dataResult){
                obj[item.a_name] = [];
                for (let a of item.districts){
                    obj[item.a_name].push(a.a_name)
                }
            }
            resolve(obj)
        })
    })
}