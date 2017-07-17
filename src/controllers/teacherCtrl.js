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

const assert = require('assert');

class TeacherCtrl extends BaseCtrl {

  async listTeacher(params) {
    let { orderBy, grade, district, subject, teacherType, gender, tags, offset } = params;
    let queryParams = { where: {} };

    //排序
    if (orderBy) {
      let order = [];
      switch (orderBy) {
        case "auto":
          order = 't_id DESC';
          break;
        case "goodComment":
          order = 't_good_comment DESC';
          break;
        case "highPrice":
          order = 't_price DESC';
          break;
        case "lowPrice":
          order = 't_price ASC';
          break;
        case "longCource":
          order = 't_course_total DESC';
          break;
      }
      queryParams.order = order;
    }

    //区域
    if (district != 'unlimit') {
      district = parseInt(district);
      queryParams.where.t_district_id = district;
    }

    //科目
    if (subject != 'unlimit') {
      assert(dictionaryCtrl.subjectEnumeration[subject], "老师科教科目参数不正确");
      queryParams.where.t_subject = dictionaryCtrl.subjectEnumeration[subject].id;
    }

    //老师类型
    if (teacherType != 'unlimit') {
      assert(dictionaryCtrl.teacherTypes[teacherType], "老师类型参数不正确");
      queryParams.where.t_type = dictionaryCtrl.teacherTypes[teacherType].type;
    }

    //性别
    if (gender != 'unlimit') {
      assert(dictionaryCtrl.gender[gender], "老师性别参数不正确");
      queryParams.where.t_gender = dictionaryCtrl.gender[gender].type;
    }

    let t_ids = [];

    //年级
    if (grade != 'unlimit') {
      assert(dictionaryCtrl.gradeEnumeration[grade], "老师可教年级参数不正确");

      let gradeID = dictionaryCtrl.gradeEnumeration[grade].id;
      let tem = await TeacherGradeModel.findAll({
        where: { tg_id: gradeID, tg_status: 1 },
        distinct: 'tg_teacher_id'
      });
      tem.forEach(item => {
        t_ids.push(item.tg_teacher_id);
      });
    }

    //标签 特点
    if (tags.length > 0) {

      tags = tags.map(item => {
        assert(dictionaryCtrl.teacherTags[item].id, "老师可教特点参数不正确");
        return dictionaryCtrl.teacherTags[item].id
      });

      let query = {
        where: { tt_tag_id: tags, tt_status: 1 },
        distinct: 't_teacher_id'
      };

      if (t_ids.length > 0) {
        query.where.tt_teacher_id = t_ids;
      }

      let teacherIDs = await TeacherTagsModel.findAll(query);

      t_ids = teacherIDs.map(item => {
        return item.tt_teacher_id;
      });

    }

    if (t_ids.length > 0) {
      queryParams.where.t_id = t_ids;
    }
    queryParams.offset = offset;
    queryParams.limit = 10;
    queryParams.where.t_status = 1;
    let list = await TeacherModel.findAll(queryParams);

    t_ids = [];

    list.forEach(item => {
      delete item.dataValues.t_comment;
      delete item.dataValues.t_case;
      delete item.dataValues.t_introduction;

      item.t_grades = [];
      item.t_tags = [];

      t_ids.push(item.t_id);
    });
    let teacherGrades = await TeacherGradeModel.findAll({ where: { tg_teacher_id: t_ids, tg_status: 1 } });
    let teacherTags = await TeacherTagsModel.findAll({ where: { tt_teacher_id: t_ids, tt_status: 1 } });

    //添加标签和年级科教科目
    list.forEach((teach) => {
      teacherGrades.forEach((grade) => {
        if (grade.tg_teacher_id == teach.t_id) {
          if (dictionaryCtrl.subjectIDName[teach.t_subject].name && dictionaryCtrl.gradeIDName[grade.tg_grade_id].name) {
            let subject = dictionaryCtrl.subjectIDName[teach.t_subject].name;
            teach.t_grades.push(dictionaryCtrl.gradeIDName[grade.tg_grade_id].name + subject);
          }
        }
      });
      teacherTags.forEach(tag => {
        if (teach.t_id == tag.tt_teacher_id) {
          if (dictionaryCtrl.teacherTagIDName[tag.tt_tag_id].name) {
            teach.t_tags.push(dictionaryCtrl.teacherTagIDName[tag.tt_tag_id].name);
          }
        }
      });
    });

    let latestComments = await this.getLatestComments();
    return { latestComments, list, offset };
  }


  /**
   * 获取老师信息
   * @param teacherID
   */
  async getTeacherInfo(params) {
    let { teacherID, cityId } = params;
    let latestComments = await this.getLatestComments();
    let teacher = await TeacherModel.findById(teacherID);
    assert(teacher, '没改该老师信息');
    teacher.t_tags = await this.getTagsByTeacherID(teacherID);
    teacher.t_grades = await this.getGradesByTeacherID(teacherID);
    let data = { teacher, latestComments };
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
    for (let tag of tags) {
      result.push(dictionaryCtrl.teacherTagIDName[tag.tt_tag_id].name);
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
    let total = await sequelize.query('select count(t_id) as total from teacher where t_status = 1 and (t_type = 1 or t_type = 2)', { type: sequelize.QueryTypes.SELECT });
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
        t_status: 1,
        t_comment: { $not: null }
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
    let { teacherID, cityId } = params;
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
    let data = { comments, headImg, name, latestComments };
    return data;
  }

}
module.exports = new TeacherCtrl();