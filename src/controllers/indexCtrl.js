/**
 * Created by tseian on 26/06/2017.
 */
const request = require("request");
const BannerModel = require('../models/bannerModel');
class IndexCtrl {
  constructor() {

  }

  /**
   * 验证手机号码
   */
  async verifyPhoneNO() {

  }

  /**
   * 保存手机号码
   * @param phoneNO
   */
  async save(phoneNO, areaID) {

  }

  /**
   * 获取banner图片
   * @param city
   * @returns {*}
   */
  async getBanners(city) {
    let list = await BannerModel.findAll({ where: { b_cityID: city, b_status: 1 }, order: 'b_sort desc' });
    return list;
  }


}

module.exports = new IndexCtrl();