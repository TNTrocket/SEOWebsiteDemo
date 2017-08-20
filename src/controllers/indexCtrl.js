/**
 * Created by tseian on 26/06/2017.
 */
const request = require("request");
const BannerModel = require('../models/bannerModel');
const areaCtrl = require('../controllers/areaCtrl');
const teacherCtrl = require('../controllers/teacherCtrl');
const dictionCtrl = require('../controllers/dictionaryCtrl');
const BaseCtrl = require('../controllers/baseCtrl');
class IndexCtrl extends BaseCtrl {


  async index(params) {
    let { city } = params;
    city = await areaCtrl.getCityByPinyin(city, dictionCtrl.areaLevel.city.level);
    let banners = await this.getBanners(city.a_id);
    let comments = await teacherCtrl.getLatestComments();
    let latestComments = await teacherCtrl.getLatestComments();
    let famousTeachers = await teacherCtrl.famousTeacher();
    return { latestComments, banners, comments, famousTeachers };
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