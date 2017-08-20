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
const paramsUtil = require('../common/paramsUtil');

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
  async listSchools(params) {
    let { queryString, cityPinyin, offset = 0 } = params;
    let sEnuS = await paramsUtil.parseParams(queryString);

    let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);

    let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
    let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
    let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotSchools = await this.getHotSchools(cityInfo.a_id);
    let schoolLevel = dictionCtrl.schoolLevel;
    let schoolCategory = dictionCtrl.schoolCategory;

    let queryStr = 'select count(*) as total from tbl_school_info where 1=1 ';
    let where = {};
    where.city = cityInfo.a_name;
    let dictions = {};


    let tkdCity = cityInfo.a_name;
    let tkdDistrict = '';
    let tkdGrade = '';
    let tkdRank = '';

    for (let p of sEnuS) {

      //学校年级参数
      if (p.a) {
        assert(dictionaryCtrl.s_a_school[p.a].value, '学校年级参数错误');
        let category = dictionaryCtrl.s_a_school[p.a].value;
        where.category = category;
        queryStr += 'and category  in ( "' + category[0] + '","' + category[1] + '")';
        dictions.a = dictionaryCtrl.s_a_school[p.a];
        tkdGrade = dictionaryCtrl.s_a_school[p.a].name;
      }

      //地区
      if (p.b) {
        let districts = await areaCtrl.getDistrictsByCityId(cityInfo.a_id);
        let district = districts[p.b - 1];
        let region = district.a_name;

        where.region = region;
        queryStr += ' and region = "' + region + '"';
        dictions.b = district;
        tkdDistrict = region;
      }

      //级别
      if (p.c) {
        assert(dictionaryCtrl.s_c_school_level[p.c].name, '学校级别参数错误');
        let level = dictionaryCtrl.s_c_school_level[p.c].name;
        where.level = level;
        queryStr += ' and level = "' + level + '"';
        dictions.c = dictionaryCtrl.s_c_school_level[p.c];
        tkdRank = dictionaryCtrl.s_c_school_level[p.c].name;
      }

    }

    let tkd = {};
    if (sEnuS.length == 0) {
      tkd.title = tkdCity + '重点名师校区大全_一对一家教学校_家教辅导中心';
      tkd.keyWords = '学校';
      tkd.description = tkdCity + '重点名师校区大全,最大的排行榜信息免费查询平台，' +
        '包括家教学校排名、排行榜、十大品牌等,寻找家教学校排名相关信息';
    } else {
      tkd.title = tkdCity + tkdDistrict + tkdGrade + tkdRank + '最好的家教学校_一对一家教辅导中心_中小学辅导校区大全';
      tkd.keyWords = tkdCity + '学校，';
      if (tkdGrade) tkd.keyWords += tkdGrade + '学校，';
      if (tkdRank) tkd.keyWords += tkdRank + '学校，';
      tkd.description = '辅导校区大全频道为中小学生提供' + tkdCity + tkdGrade + tkdRank + tkdDistrict +
        '最好的家教学校,便各位家长选择合适的家教辅导中心,一对一辅导课程,查漏补缺，扫清盲点，提高成绩';
    }

    let total = await sequelize.query(queryStr, { type: sequelize.QueryTypes.SELECT });
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
      total,
      list,
      materials,
      hotSchools,
      diction: [
        { item: dictionCtrl.s_a_school, category: '年级：' },
        { item: dictionCtrl.s_c_school_level, category: '级别：' }
      ],
      page: { offset, limit: 10 },
      latestComments,
      dictions,
      tkd
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
      'tbl_school_info where city =:city order by score desc limit 10', {
      replacements: { city: city.a_name },
      type: sequelize.QueryTypes.SELECT
    });
    return schools;
  }

  /**
   * 获取一个学校详细信息
   * @param schoolID
   */
  async getSchoolById(schoolID, cityPinyin) {
    let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);
    let hotSchools = await this.getHotSchools(cityInfo.a_id);
    let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
    let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
    let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotInfos = await articleCtrl.getHotInfo(0, 10);

    let famousTeachers = await teacherCtrl.famousTeacher();
    let latestComments = await teacherCtrl.getLatestComments();
    let school = await SchoolInfoModel.findById(schoolID);
    assert(school, '没有该学校');

    let tkd = {};
    tkd.title = school.name + '_' + school.region + '教教辅导';
    tkd.keyWords = school.name;
    tkd.description = school.name + ',地址' + school.address + ',联系电话' + school.phone + ',' + school.desc.substr(0, 20) || '';
    return { latestComments, famousTeachers, hotSchools, materials, hotInfos, school, tkd };
  }
}


module.exports = new SchoolInfo();