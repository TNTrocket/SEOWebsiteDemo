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
const moment = require('moment');
const teacherCtrl = require('../controllers/teacherCtrl');


const shortImgUrls = [
  'http://ortr4se0b.bkt.clouddn.com/short1.png',
  'http://ortr4se0b.bkt.clouddn.com/short2.png',
  'http://ortr4se0b.bkt.clouddn.com/short3.png',
  'http://ortr4se0b.bkt.clouddn.com/short4.png',
  'http://ortr4se0b.bkt.clouddn.com/short5.png'
];

class SchoolInfo extends BaseCtrl {

  /**
   * 根据条件获取学校列表
   * @param params
   */
  async list(params) {
    let { category, region, level, offset, city } = params;

    let cityInfo = await areaCtrl.getCityById(city);

    let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
    let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
    let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotSchools = await this.getHotSchools(cityInfo.a_id);
    let schoolLevel = dictionCtrl.schoolLevel;
    let schoolCategory = dictionCtrl.schoolCategory;

    let queryString = 'select count(id) as total from tbl_school_info where 1=1 ';
    let where = {};
    where.city = cityInfo.a_name;
    if (category != 'unlimit') {
      assert(dictionaryCtrl.schoolCategory[category].value, '学校年级参数错误');
      category = dictionaryCtrl.schoolCategory[category].value;
      where.category = category;
      queryString += 'and category  in ( "' + category[0] + '","' + category[1] + '")';
    }

    if (region != 'unlimit') {
      where.region = region;
      queryString += ' and region = "' + region + '"';
    }

    if (level != 'unlimit') {
      assert(dictionaryCtrl.schoolLevel[level].name, '学校级别参数错误');
      level = dictionaryCtrl.schoolLevel[level].name;
      where.level = level;
      queryString += ' and level = "' + level + '"';
    }


    let total = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });
    total = total[0].total;
    let list = await SchoolInfoModel.findAll({ where, offset, limit: 10 });


    let tem = [];
    list.forEach(item => {
      let id = item.id;
      let title = item.name;
      let time = moment(item.updated_at).format('YYYY-MM-DD');
      let i = parseInt(Math.random() * 5);
      let url = item.header_image_url || shortImgUrls[i];
      tem.push({ title, url, time, id });
    });

    list = tem;
    let latestComments = await teacherCtrl.getLatestComments();
    let famousTeachers = await teacherCtrl.famousTeacher();

    let data = {
      famousTeachers,
      total, list, materials, hotSchools,
      diction: [
        { item: schoolCategory, category: '年级：' },
        { item: schoolLevel, category: '级别：' }],
      page: { offset, limit: 10 },
      latestComments
    };

    return data;
  }

  /**
   * 获得十个热门学校
   * @param params
   */
  async getHotSchools(city) {
    city = parseInt(city) || dictionCtrl.defaultCity.a_id;
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

    let famousTeachers = await teacherCtrl.famousTeacher();
    let latestComments = await teacherCtrl.getLatestComments();
    let school = await SchoolInfoModel.findById(schoolID);
    assert(school, '没有该学校');

    return { latestComments, famousTeachers, hotSchools, materials, hotInfos, school };
  }
}


module.exports = new SchoolInfo();
