import { cookie, locationStorage }from './global'

export  function cookieCity() {
  let city = CONFIG.cacheData.city;
  if(city){
    cookie().set("cityPinyin",city,1)
  }
}

export function localCity(value) {
  let city = CONFIG.cacheData.city;
  if(city){
    let cityArr = value;
    let cityName = "";
    for(let a of cityArr){
      if(a.code.toLowerCase() === city.toLowerCase()){
        cityName = a.name;
        break;
      }
    }
    let local = locationStorage().get("currentCity") || "{}";
    let localstroage = {}
    try {
      localstroage = JSON.parse(local);
    }catch(e) {
      console.log(e);
      localstroage = {city: local}
    }
    let obj = Object.assign({},localstroage,{city:cityName});
    locationStorage().set("currentCity",obj);
  }
}