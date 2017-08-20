import { localStorage } from './global'
export function isSearchCity() {
  let currentCityObj = JSON.parse(localStorage().get('currentCity')) || {};
  let date = new Date().getTime() - (currentCityObj.time || 0);
  let days=Math.floor(date/(24*3600*1000));
  if(days >= 0){
    return true;
  }else{
    return false;
  }

}