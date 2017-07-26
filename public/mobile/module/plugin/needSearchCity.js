/**
 * Created by Administrator on 2017/7/14.
 */
import { locationStorage } from './global'
export function needSearchCity() {
  let currentCityObj = JSON.parse(locationStorage().get('currentCity')) || {};
  let date = new Date().getTime() - (currentCityObj.time || 0);
  let days=Math.floor(date/(24*3600*1000));
  if(days > 1){
    return true;
  }else{
    return false;
  }

}