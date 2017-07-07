/**
 * Created by tseian on 28/06/2017.
 */
const BaseCtrl = require('../controllers/baseCtrl');
const AreaModel = require('../models/areaModel');
const assert = require('assert');
class AreaCtrl extends BaseCtrl {

  /**
   * 获取已开通城市
   * @param cityID
   * @returns {*}
   */
  async getCityDistrict() {
    let citys = await AreaModel.findAll({ where: { a_status: 1 } });
    let ids = [];
    for (let city of citys) {
      city.dataValues.districts = [];
      ids.push(city.a_id);
    }
    let districts = await AreaModel.findAll({ where: { a_parentID: ids } });

    for (let d of districts) {
      for (let c of citys) {
        if (c.a_id == d.a_parentID) {
          c.dataValues.districts.push(d);
        }
      }
    }
    return citys;
  }

  /**
   * 获得城市和他的区
   * @param cityID
   * @returns {*}
   */
  async getCityById(cityID) {
    let area = await AreaModel.findById(cityID);
    let districts = await AreaModel.findAll({ where: { a_parentID: cityID } });
    area.dataValues.districts = districts;
    return area;
  }

  /**
   * 城市名字  或 区名字
   * @param name
   */
  async getCityByName(name) {
    let city = await AreaModel.findAll({ where: { a_name: name, a_status: 1 } });
    assert(city.length > 0, '不存在该城市');
    return city[0];
  }



}

module.exports = new AreaCtrl();
