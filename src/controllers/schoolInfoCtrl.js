/**
 * Created by tseian on 29/06/2017.
 */

const BaseCtrl = require('../controllers/baseCtrl');
const dictionaryCtrl = require('../controllers/dictionaryCtrl');
const areaCtrl = require('../controllers/areaCtrl');
const SchoolInfoModel = require('../models/schoolInfoModel');
const sequelize = require("../config/sequelize");
const assert = require('assert');
const articleCtrl = require('../controllers/articleCtrl');
const dictionCtrl = require('../controllers/dictionaryCtrl');
class SchoolInfo extends BaseCtrl {

  /**
   * 根据条件获取学校列表
   * @param params
   */
  async list(params) {
    let { category, region, level, offset, city } = params;

    let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
    let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
    let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotSchools = await this.getHotSchools(city);
    let schoolLevel = dictionCtrl.schoolLevel;
    let schoolCategory = dictionCtrl.schoolCategory;

    let where = {};
    if (category != 'unlimit') {
      assert(dictionaryCtrl.schoolCategory[category].value, '学校年级参数错误');
      category = dictionaryCtrl.schoolCategory[category].value;
      where.category = category;
    }

    if (region != 'unlimit') {
      region = await areaCtrl.getCityById(region);
      assert(region, '该城市不存在');
      where.region = region.a_name;
    }

    if (level != 'unlimit') {
      assert(dictionaryCtrl.schoolLevel[level].name, '学校级别参数错误');
      level = dictionaryCtrl.schoolLevel[level].name;
      where.level = level;
    }

    let list = await SchoolInfoModel.findAll({ where, offset, limit: 10 });

    list.forEach(item => {
      delete item.dataValues.desc;
      delete item.dataValues.recruit_condition;
      delete item.dataValues.main_page;
      delete item.dataValues.address;
      delete item.dataValues.recruit_scope;
    });

    let data = {
      list, materials, hotSchools,
      diction: [
        { item: schoolCategory, category: '年级：' },
        { item: schoolLevel, category: '级别：' }],
      page: { offset, limit: 10 }
    };

    return data;
  }

  /**
   * 获得十个热门学校
   * @param params
   */
  async getHotSchools(city) {
    city = parseInt(city) || 440100;
    city = await areaCtrl.getCityById(city);
    assert(city, '找不到该城市');
    let schools = await sequelize.query('select name,id,(entirety_score+teacher_score+teach_score) as score from ' +
      'tbl_school_info where city =:city order by score desc limit 10',
      { replacements: { city: city.a_name }, type: sequelize.QueryTypes.SELECT });
    return schools;
  }

  /**
   * 获取一个学校详细信息
   * @param schoolID
   */
  async getSchoolById(schoolID, city) {

    let hotSchools = await this.getHotSchools(city);
    let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
    let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
    let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotInfos = await articleCtrl.getHotInfo(0, 10);

    let school = await SchoolInfoModel.findById(schoolID);
    assert(school, '没有该学校');

    return { hotSchools, materials, hotInfos, school };
  }
}


module.exports = new SchoolInfo();
