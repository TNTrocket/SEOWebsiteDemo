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

    for (let i = 0; i < districts.length; i++) {
      let d = districts[i];
      for (let x = 0; x < citys.length; x++) {
        let c = citys[x];
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
    let districts = await AreaModel.findAll({ where: { a_parentID: cityID }, order: 'a_id asc' });
    area.dataValues.districts = districts;
    return area;
  }

  /**
   * 获得城市的区
   * @param cityID
   * @returns {*}
   */
  async getDistrictsByCityId(cityID) {
    assert(parseInt(cityID), '城市id有误');
    cityID = parseInt(cityID);
    let districts = await AreaModel.findAll({ where: { a_parentID: cityID }, order: 'a_id asc' });
    return districts;
  }

  /**
   * 如果出现两个地区名字相同则获取第一个
   * 城市名字  或 区名字
   * @param name
   */
  async getCityByName(name) {
    let city = await AreaModel.findAll({ where: { a_name: name } });
    assert(city.length > 0, '不存在该城市');
    return city[0];
  }

  /**
   * 如果出现两个地区级别和拼音相同则获取第一个
   * @param pinyin
   * @param level
   * @returns {*}
   */
  async getCityByPinyin(pinyin, level) {
    let area = await AreaModel.findAll({ where: { a_pinyin: pinyin, a_level: level } });
    assert(area.length > 0, '不存在该地区');
    return area[0];
  }

}

module.exports = new AreaCtrl();