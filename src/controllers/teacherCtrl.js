/**
 * Created by tseian on 26/06/2017.
 */
const TeacherModel = require('../models/teacherModel');
const AreaModel = require('../models/areaModel');
const TeacherTagsModel = require('../models/teacherTagsModel');
const TeacherGradeModel = require('../models/teacherGradeModel');
const BaseCtrl = require('../controllers/baseCtrl');
const dictionaryCtrl = require('../controllers/dictionaryCtrl');
const areaCtrl = require('../controllers/areaCtrl');
const sequelize = require("../config/sequelize");
const moment = require('moment');
const paramsUtil = require('../common/paramsUtil');
const assert = require('assert');

class TeacherCtrl extends BaseCtrl {

  async listTeacher(params) {

    let { cityPinyin, queryString, offset = 0 } = params;
    let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);

    let cityID = cityInfo.a_id;

    let sAEnuS = await paramsUtil.parseParams(queryString);
    let queryParams = { where: {} };
    queryParams.where.t_city_id = cityID;
    let t_ids = [];
    let paramsParse = {};

    let tkdDistrict = '';
    let tkdGrade = '';
    let tkdSubject = '';
    let tkdTeacherType = '';
    let tkdTag = '';
    let tkdGender = '';
    let tkdCity = cityInfo.a_name;

    for (let p of sAEnuS) {

      //科目
      if (p.b) {
        assert(dictionaryCtrl.s_b_subject_enu[p.b], "老师科教科目参数不正确");
        queryParams.where.t_subject = dictionaryCtrl.s_b_subject_enu[p.b].enu_id;
        paramsParse.b = dictionaryCtrl.s_b_subject_enu[p.b];
        tkdSubject = dictionaryCtrl.s_b_subject_enu[p.b].name;
      }

      //年级
      if (p.a) {
        assert(dictionaryCtrl.s_a_grade_enu[p.a], "老师可教年级参数不正确");

        let gradeID = dictionaryCtrl.s_a_grade_enu[p.a].enu_id;
        let tem = await TeacherGradeModel.findAll({
          where: { tg_grade_id: gradeID, tg_status: 1 },
          distinct: 'tg_teacher_id'
        });
        tem.forEach(item => {
          t_ids.push(item.tg_teacher_id);
        });
        paramsParse.a = dictionaryCtrl.s_a_grade_enu[p.a];
        tkdGrade = dictionaryCtrl.s_a_grade_enu[p.a].name;
      }

      //地区
      if (p.c) {
        let districts = await areaCtrl.getDistrictsByCityId(cityID);
        let district = districts[p.c - 1];
        queryParams.where.t_district_id = district.a_id;
        tkdDistrict = district.a_name
      }
      //性别
      if (p.d) {
        queryParams.where.t_gender = p.d;
        paramsParse.d = dictionaryCtrl.s_d_gender[p.d];
        tkdGender = dictionaryCtrl.s_d_gender[p.d].name
      }
      //类型
      if (p.e) {
        assert(dictionaryCtrl.s_e_type[p.e], "老师类型参数不正确");
        queryParams.where.t_type = dictionaryCtrl.s_e_type[p.e].type_id;
        paramsParse.e = dictionaryCtrl.s_e_type[p.e];
        tkdTeacherType = dictionaryCtrl.s_e_type[p.e].t_name
      }
      //特点
      if (p.f) {
        let tags = await dictionaryCtrl.s_f_tag();

        assert(tags[p.f].t_id, "老师类型参数不正确");
        let tagId = tags[p.f].t_id;
        let query = {
          where: { tt_tag_id: tagId, tt_status: 1 },
          distinct: 't_teacher_id'
        };

        if (t_ids.length > 0) {
          query.where.tt_teacher_id = t_ids;
        }

        let teacherIDs = await TeacherTagsModel.findAll(query);

        t_ids = teacherIDs.map(item => {
          return item.tt_teacher_id;
        });
        paramsParse.f = tags[p.f];
        tkdTag = tags[p.f].t_name;
      }
      //排序
      if (p.g) {
        let order = [];
        switch (p.g) {
          case 1:
            order = 't_id DESC';
            break;
          case 2:
            order = 't_good_comment DESC';
            break;
          case 3:
            order = 't_price DESC';
            break;
          case 4:
            order = 't_price ASC';
            break;
          case 5:
            order = 't_course_total DESC';
            break;
          default:
            order = 't_id DESC';
            break;
        }
        queryParams.order = order;
        paramsParse.f = dictionaryCtrl.s_g_order_enu[p.f];
      }
    }

    let title = tkdCity + tkdDistrict + tkdGrade + tkdSubject + tkdTeacherType + tkdGender +
      '家教老师_' + tkdCity + '一对一辅导老师_广州找家教辅导老师_选师无忧';
    let keyWords = '';
    if (sAEnuS.length == 0) {
      keyWords = '家教老师';
    } else {
      keyWords = tkdCity + '家教老师，';
      if (tkdGrade) keyWords += tkdGrade + '家教老师，';
      if (tkdDistrict) keyWords += tkdDistrict + '家教老师';
    }

    let description = tkdCity + tkdDistrict + tkdGrade + tkdSubject +
      '专业一对一家教辅导老师_让家长找到合适的好老师,通过大数据帮助学生精准对接重点中小学教师、' +
      tkdCity + '名校大学生,快速提高孩子的成绩，包括数理化、语文、英语等传统科目的辅导';

    if (t_ids.length > 0) {
      queryParams.where.t_id = t_ids;
    }
    queryParams.where.t_status = 1;
    let total = await TeacherModel.count(queryParams);
    queryParams.offset = offset;
    queryParams.limit = 10;

    let list = await TeacherModel.findAll(queryParams);

    t_ids = [];

    list.forEach(item => {
      delete item.dataValues.t_comment;
      delete item.dataValues.t_case;
      delete item.dataValues.t_introduction;

      item.dataValues.t_grades = [];
      item.dataValues.t_tags = [];

      item.t_grades = [];
      item.t_tags = [];

      t_ids.push(item.t_id);
    });

    let teacherGrades = await TeacherGradeModel.findAll({ where: { tg_teacher_id: t_ids, tg_status: 1 } });
    let teacherTags = await TeacherTagsModel.findAll({ where: { tt_teacher_id: t_ids, tt_status: 1 } });
    let s_f_tags = await dictionaryCtrl.s_f_tag();
    //添加标签和年级科教科目
    list.forEach((teach) => {
      teacherGrades.forEach((grade) => {
        if (grade.tg_teacher_id == teach.t_id) {
          if (dictionaryCtrl.subjectIDName[teach.t_subject].name && dictionaryCtrl.gradeIDName[grade.tg_grade_id].name) {
            let subject = dictionaryCtrl.subjectIDName[teach.t_subject].name;
            teach.dataValues.t_grades.push(dictionaryCtrl.gradeIDName[grade.tg_grade_id].name + subject);
            teach.t_grades.push(dictionaryCtrl.gradeIDName[grade.tg_grade_id].name + subject);
          }
        }
      });
      teacherTags.forEach(tag => {
        if (teach.t_id == tag.tt_teacher_id) {
          if (s_f_tags[tag.tt_tag_id].t_name) {
            teach.dataValues.t_tags.push(s_f_tags[tag.tt_tag_id].t_name);
            teach.t_tags.push(s_f_tags[tag.tt_tag_id].t_name);
          }
        }
      });
    });

    let latestComments = await this.getLatestComments();
    return { total, latestComments, list, offset, paramsParse, tkd: { title, keyWords, description } };
  }


  /**
   * 获取老师信息
   * @param teacherID
   */
  async getTeacherInfo(params) {
    let { teacherID, cityPinyin } = params;
    let cintyInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);
    let latestComments = await this.getLatestComments();
    let teacher = await TeacherModel.findById(teacherID);
    assert(teacher, '没改该老师信息');
    teacher.t_tags = await this.getTagsByTeacherID(teacherID);
    teacher.t_grades = await this.getGradesByTeacherID(teacherID);

    let successCase = teacher.t_case.substr(0, 30) || '';

    let tkd = {};
    tkd.title = '' + teacher.t_name + '' + '_' + cintyInfo.a_name + '一对一辅导老师';
    tkd.keyWords = teacher.t_name;

    if (successCase) {
      tkd.description = teacher.t_name +
        teacher.t_teach_age + '毕业于' + teacher.t_university + successCase;
    } else {
      tkd.description = teacher.t_name + cintyInfo.a_name + '家教名师，整个课堂井然有序，思路清晰，重难点突出，' +
        '善于根据学生自身特点，迅速找出学生弱点，查漏补缺，扫清盲点，提高成绩；用心教会每一个孩子，让教学变的不再枯燥。';
    }

    let data = { teacher, latestComments, tkd };
    return data;
  }

  /**
   * 获取某一老师的所有标签的数据
   * @param teacherID
   * @returns {Array}
   */
  async getTagsByTeacherID(teacherID) {
    let tags = await TeacherTagsModel.findAll({ where: { tt_teacher_id: teacherID, tt_status: 1 } });
    let result = [];
    let s_f_tags = await dictionaryCtrl.s_f_tag();
    for (let tag of tags) {
      result.push(s_f_tags[tag.tt_tag_id].t_name);
    }
    return result;
  }


  /**
   * 给某一老师添加可教年级科目的数据
   * @param teacherID
   * @returns {Array}
   */
  async getGradesByTeacherID(teacherID) {
    let grades = await TeacherGradeModel.findAll({ where: { tg_teacher_id: teacherID, tg_status: 1 } });
    let result = [];
    for (let grade of grades) {
      result.push(dictionaryCtrl.gradeIDName[grade.tg_grade_id].name);
    }
    return result;
  }


  /**
   * 名师推荐
   */
  async famousTeacher() {
    let total = await sequelize.query('select count(t_id) as total from tbl_teacher where t_status = 1 and (t_type = 1 or t_type = 2)', { type: sequelize.QueryTypes.SELECT });
    total = total[0].total || 0;
    let offset = parseInt(total * Math.random());
    let limit = 10;
    offset = offset > limit ? offset - limit : 0;

    let teachers = await TeacherModel.findAll({ where: { t_status: 1, t_type: [1, 2] }, offset, limit });

    let tem = [];
    teachers.forEach(item => {
      let title = item.t_name;
      let url = 'http://ortr4se0b.bkt.clouddn.com/' + item.t_headimg;
      let id = item.t_id;
      let introduction = item.t_introduction;
      tem.push({ introduction, url, id, title });
    });
    return tem;
  }

  /**
   * 获取最新评价
   * @param cityId
   * @returns {*}
   */
  async getLatestComments() {
    let comments = await TeacherModel.findAll({
      where: {
        t_status: 1
      },
      limit: 10,
      order: 't_update_time desc'
    });
    let tem = [];
    comments.forEach(l => {
      let comment = l.t_comment;
      if (comment) {
        comment = JSON.parse(comment);
        comment = comment.good_comment[0];
      } else {
        comment = {};
      }

      tem.push({
        t_id: l.t_id,
        t_comment: comment,
        t_name: l.t_name
      });
    });

    comments = tem;
    return comments;
  }

  /**
   * 获取老师的评价
   * @param teacherId
   */
  async getTeacherCommentsByTeacherId(params) {
    let { teacherID, cityPinyin } = params;
    let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);
    let teacherInfo = await TeacherModel.findById(teacherID);
    assert(teacherInfo, '不存在改该老师');
    let goodComment = '';
    let midComment = '';
    let badComment = '';
    if (teacherInfo.t_comment) {
      let comment = JSON.parse(teacherInfo.t_comment);
      goodComment = comment.good_comment;
      midComment = comment.mid_comment;
      badComment = comment.bad_comment;
    }

    let comments = {
      goodComment,
      midComment,
      badComment,
      goodCount: teacherInfo.t_good_comment,
      midCount: teacherInfo.t_mid_comment,
      badCount: teacherInfo.t_bad_comment,
    };
    let headImg = teacherInfo.t_headimg;
    let name = teacherInfo.t_name;
    let latestComments = await this.getLatestComments();

    let title = cityInfo.a_name + teacherInfo.t_name + '怎样_' + teacherInfo.t_name + '好不好_评价家教老师辅导效果【选师无忧】';
    let keyWords = cityInfo.a_name + '老师怎样,' + teacherInfo.t_name + '好不好';
    let description = '';
    if (goodComment[0]) {
      description = cityInfo.a_name + teacherInfo.t_name + ',家长评价该家教老师辅导效果:' + goodComment[0].student_appraise_info;
    } else {
      description = cityInfo.a_name + teacherInfo.t_name + ',在整个课堂井然有序，思路清晰，重难点突出，善于根据学生自身特点，迅速找出学生弱点，查漏补缺';
    }

    return { comments, headImg, name, latestComments, tkd: { title, keyWords, description } };
  }

}
module.exports = new TeacherCtrl();