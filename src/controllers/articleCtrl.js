/**
 * Created by tseian on 16/06/2017.
 */

const ArticleModel = require('../models/articleModel');
const ArticleTypesModel = require('../models/articleTypesModel');
const BaseCtrl = require('../controllers/baseCtrl');
const assert = require('assert');
const $ = require('cheerio');
const moment = require('moment');
const teacherCtrl = require('../controllers/teacherCtrl');
const sequelize = require("../config/sequelize");
const dictionCtrl = require('../controllers/dictionaryCtrl');
const indexCtrl = require('../controllers/indexCtrl');
const areaCtrl = require('../controllers/areaCtrl');


class ArticleCtrl extends BaseCtrl {
  //删除文章
  async del(id, ctx, next) {
    assert(await ArticleModel.findById(id), '400 没有该文章');
    await ArticleModel.update({ a_status: 0 }, {
      where: { a_id: id },
      fields: ['a_status']
    });
    ctx.response.body = {
      success: true,
      msg: '删除成功'
    };
  }

  async getArticleById(id) {
    let article = await ArticleModel.findById(id);
    assert(article, '不存在该文章');
    //修改为 编辑中
    // await this.changeEditStatus(id, 1);
    return article;
  }

  async getlist(title, id, offset) {
    let queryArticleString = 'select a_enu_code1,a_update_time,a_create_time,a_id,a_content_title,a_edit_status' +
      ' from tbl_articles where a_status =1 and a_enu_code1 in ("PARENT_ASK_ANSWER","MATERIAL","INFO")';
    let queryString = 'select count(a_id) as total from tbl_articles where a_status =1 and a_enu_code1 in ("PARENT_ASK_ANSWER","MATERIAL","INFO")';

    if (title) {
      queryArticleString += 'and a_content_title like "%' + title + '%"';
      queryString += 'and a_content_title like "%' + title + '%"';
    }

    if (id && parseInt(id)) {
      queryArticleString += 'and a_id =' + id;
      queryString += 'and a_id =' + id;
    }
    queryArticleString += ' order by a_id asc ';
    let limit = 'limit 10';
    if (offset && parseInt(offset)) {
      limit = 'limit ' + offset + ',' + 10;
    }
    queryArticleString += limit;
    let list = await sequelize.query(queryArticleString, { type: sequelize.QueryTypes.SELECT });
    let total = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });

    let types = { "PARENT_ASK_ANSWER": '家长问答', "MATERIAL": '资料下载', "INFO": '无忧资讯' };

    list.forEach(item => {
      item.type = types[item.a_enu_code1];
      item.a_update_time = moment(new Date(item.a_update_time)).format('YYYY-MM-DD hh:mm:ss');
      item.a_create_time = moment(new Date(item.a_create_time)).format('YYYY-MM-DD hh:mm:ss');
    });

    return { list, total: total[0].total || 0 };

  }

  async updateArticle(params) {
    let { id, title, imageUrl, content, time, seoTitle, enuCode1, enuCode2, enuCode3, description, keyword } = params;

    // let where = { at_enu_code1: enuCode1, at_status: 1 };
    // if (enuCode2) {
    //   where.at_enu_code2 = enuCode2
    // }
    //
    // if (enuCode3) {
    //   where.at_enu_code3 = enuCode3;
    // }
    //
    // let articleType = await ArticleTypesModel.findAll({ where });

    let i = await ArticleModel.update(
      {
        'a_content': content,
        'a_images': imageUrl,
        'a_content_title': title,
        'a_update_time': params.time || new Date().getUTCMilliseconds(),
        a_keyword: keyword,
        a_title: seoTitle,
        a_description: description,
        // a_type: articleType.at_id
      },
      {
        where: { a_id: id },
        fields: ['a_title', 'a_content', 'a_images', 'a_content_title', 'a_update_time', 'a_keyword', 'a_title', 'a_description', 'a_type']
      }
    );

    await this.changeEditStatus(id, 2);

    if (i > 0) {
      let article = await ArticleModel.findById(id);
      return { content: article, success: true, msg: '更新成功' };
    } else {
      return { success: false, msg: '更新失败' };
    }
  }

  async studyNewList(params) {
    let { type, offset, limit } =params;
    let latestComments = await teacherCtrl.getLatestComments();
    let hotInfos = await this.getHotInfo(0, 10);
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let diction = [{ item: dictionCtrl.careFreeInfo, category: '类目：' }];

    let famousTeachers = await teacherCtrl.famousTeacher();

    let { list, total } = await this.list(null, null, null, type, offset, limit);


    let data = {
      latestComments,
      famousTeachers,
      total, list, hotInfos,
      materials, diction,
      page: { offset, limit }
    };
    return data;
  }

  async fetch(id) {
    let latestComments = await teacherCtrl.getLatestComments();
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);

    let famousTeachers = await teacherCtrl.famousTeacher();

    let article = await ArticleModel.findById(id);
    article.threeTitles = await this.getThreeArticle();
    article.hotInfos = await this.getHotInfo(0, 10);
    article.a_update_time = moment(article.a_update_time).format('YYYY-MM-DD hh:mm:ss');

    return { latestComments, famousTeachers, materials, article };
  }

  /**
   * 三个文章
   * @returns {*}
   */
  async getThreeArticle() {
    let type = [
      dictionCtrl.careFreeInfo.sxgl.id,
      dictionCtrl.careFreeInfo.qzcf.id,
      dictionCtrl.careFreeInfo.bsxx.id,
      dictionCtrl.careFreeInfo.jzxd.id,
      dictionCtrl.careFreeInfo.gkzn.id
    ];

    let offset = parseInt(Math.random() * 10);
    let limit = 3;

    let { list } = await this.list(null, null, null, type, offset, limit);

    return list;
  }

  /**
   *  获得热门资讯
   * @param offset
   * @param limit
   * @returns {*}
   */
  async getHotInfo(offset, limit) {
    let type = [
      dictionCtrl.careFreeInfo.sxgl.id,
      dictionCtrl.careFreeInfo.qzcf.id,
      dictionCtrl.careFreeInfo.bsxx.id,
      dictionCtrl.careFreeInfo.jzxd.id,
      dictionCtrl.careFreeInfo.gkzn.id
    ];

    let list = await ArticleModel.findAll({
      where: { a_status: 1, a_type: type },
      offset: offset,
      limit: limit,
      order: [['a_update_time', 'DESC']]
    });


    list = list.map(l => {
      let url = l.a_images;
      let time = moment(new Date(l.a_update_time)).format('YYYY-MM-DD');
      return { title: l.a_content_title, id: l.a_id, url: url, time };
    });
    return list;
  }

  /**
   * 根据code 获取相应的最新的资料
   * @param code1
   * @param code2
   * @param code3
   * @param limit
   * @returns {*}
   */
  async getLatestMaterials(type, limit) {

    let code2s = [], code3s = [];

    if (type == 'school') {
      let schoolSubCodes = [
        dictionCtrl.subjectEnumeration.chinese.code,
        dictionCtrl.subjectEnumeration.math.code,
        dictionCtrl.subjectEnumeration.english.code,
        dictionCtrl.subjectEnumeration.olympic_math.code,
      ];
      let schoolGradeCodes = [
        dictionCtrl.gradeEnumeration.grade1.code,
        dictionCtrl.gradeEnumeration.grade2.code,
        dictionCtrl.gradeEnumeration.grade3.code,
        dictionCtrl.gradeEnumeration.grade4.code,
        dictionCtrl.gradeEnumeration.grade5.code,
        dictionCtrl.gradeEnumeration.grade6.code,
      ];
      code2s = schoolGradeCodes;
      code3s = schoolSubCodes;
    } else if (type == 'senior') {
      let seniorSubCodes = [
        dictionCtrl.subjectEnumeration.chinese.code,
        dictionCtrl.subjectEnumeration.math.code,
        dictionCtrl.subjectEnumeration.english.code,
        dictionCtrl.subjectEnumeration.olympic_math.code,
        dictionCtrl.subjectEnumeration.physics.code,
        dictionCtrl.subjectEnumeration.politics.code,
        dictionCtrl.subjectEnumeration.history.code,
        dictionCtrl.subjectEnumeration.chemistry.code,
        dictionCtrl.subjectEnumeration.geography.code,
        dictionCtrl.subjectEnumeration.biology.code
      ];

      let seniorGradeCodes = [
        dictionCtrl.gradeEnumeration.grade8.code,
        dictionCtrl.gradeEnumeration.grade9.code,
        dictionCtrl.gradeEnumeration.grade7.code,
      ];

      code2s = seniorGradeCodes;
      code3s = seniorSubCodes;
    } else if (type == 'high') {
      let highGradeCodes = [
        dictionCtrl.gradeEnumeration.grade10.code,
        dictionCtrl.gradeEnumeration.grade11.code,
        dictionCtrl.gradeEnumeration.grade12.code,
      ];
      let highSubCodes = [
        dictionCtrl.subjectEnumeration.chinese.code,
        dictionCtrl.subjectEnumeration.math.code,
        dictionCtrl.subjectEnumeration.english.code,
        dictionCtrl.subjectEnumeration.olympic_math.code,
        dictionCtrl.subjectEnumeration.physics.code,
        dictionCtrl.subjectEnumeration.politics.code,
        dictionCtrl.subjectEnumeration.history.code,
        dictionCtrl.subjectEnumeration.chemistry.code,
        dictionCtrl.subjectEnumeration.geography.code,
        dictionCtrl.subjectEnumeration.biology.code
      ];

      code2s = highGradeCodes;
      code3s = highSubCodes;
    }

    let list = await ArticleModel.findAll({
      where: { a_status: 1, a_enu_code1: 'MATERIAL', a_enu_code2: code2s, a_enu_code3: code3s },
      offset: 0,
      limit: limit,
      order: [['a_update_time', 'DESC']]
    });

    list = list.map(l => {
      let url = l.a_images;
      return { url, title: l.a_content_title, id: l.a_id, time: moment(l.a_update_time).format('YYYY-MM-DD hh:mm:ss') }
    });
    return list;
  }

  /**
   * 获取 资料下载列表
   * @param params
   * @returns {Array}
   */
  async getMaterials(params) {
    let { offset, limit = 10, grade, subject } =params;
    let latestComments = await teacherCtrl.getLatestComments();
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotInfos = await this.getHotInfo(0, 10);
    let diction = [
      { 'item': dictionCtrl.subjectEnumeration, category: '科目：' },
      { 'item': dictionCtrl.gradeEnumeration, category: '年级：' }];

    let famousTeachers = await teacherCtrl.famousTeacher();

    if (grade == 'unlimit') {
      grade = null;
    }
    if (subject == 'unlimit') {
      subject = null;
    }
    let { list, total } = await this.list('MATERIAL', grade, subject, null, offset, limit);

    let data = { latestComments, famousTeachers, total, list, materials, hotInfos, diction, page: { offset, limit } };
    return data;
  }

  /**
   * 获取家长问答资讯
   * @param params
   */
  async getParentQuestions(params) {
    let { offset, limit = 10, grade } =params;
    let latestComments = await teacherCtrl.getLatestComments();
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotInfos = await this.getHotInfo(0, 10);
    let diction = [{ item: dictionCtrl.gradeEnumeration, category: '年级：' }];

    if (grade == 'unlimit') {
      grade = null;
    }

    let { list, total } = await this.list('PARENT_ASK_ANSWER', grade, null, null, offset, limit);
    let famousTeachers = await teacherCtrl.famousTeacher();
    let data = {
      latestComments,
      famousTeachers,
      total, list, materials,
      diction, hotInfos,
      page: {
        offset: params.offset,
        limit: 10
      }
    };
    return data;
  }

  /**
   *
   * @param enu1
   * @param enu2
   * @param enu3
   * @param offset
   * @param limit
   */
  async list(enu1, enu2, enu3, type, offset, limit) {
    let where = { a_status: 1 };
    let queryString = 'select count(a_id) as total from tbl_articles where a_status = 1 ';
    if (enu1) {
      where.a_enu_code1 = enu1;
      queryString += 'and a_enu_code1 = "' + enu1 + '" ';
    }
    if (enu2) {
      where.a_enu_code2 = enu2;
      queryString += 'and a_enu_code2 = "' + enu2 + '" ';
    }
    if (enu3) {
      where.a_enu_code3 = enu3;
      queryString += 'and a_enu_code3 = "' + enu3 + '" ';
    }

    if (type) {
      where.a_type = type;
      if (typeof type == 'object') {
        queryString += 'and a_type in (' + type + ')';
      } else {
        queryString += 'and a_type = ' + type + ' ';
      }
    }
    let list = await ArticleModel.findAll({ where, offset, limit });
    let total = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });
    let tem = [];
    list.forEach(l => {
      let title = l.a_content_title;
      let content = $(l.a_content);
      let url = l.a_images;
      let time = moment(l.a_update_time).format('YYYY-MM-DD');
      let id = l.a_id;
      tem.push({ title, url, time, id });
    });

    return { list: tem, total: total[0].total || 0 };
  }

  /**
   * 返回文章编辑界面的的数据字典
   */
  async diction() {
    let diction = dictionCtrl.articleType;
    delete diction.sxzx;
    diction.wyzx.enuCode2 = dictionCtrl.infoEnumeration;
    diction.zlxz.enuCode2 = dictionCtrl.gradeEnumeration;
    diction.zlxz.enuCode3 = dictionCtrl.subjectEnumeration;
    diction.jzwd.enuCode2 = dictionCtrl.gradeEnumeration;

    return diction;
  }

  async changeEditStatus(id, status) {
    id = parseInt(id);
    status = parseInt(status);
    let i = await ArticleModel.update({ a_edit_status: status }, { where: { a_id: id }, fields: ['a_edit_status'] });
    if (i > 0) {
      return { success: true, msg: '修改成功' };
    } else {
      return { success: false, msg: '修改失败' };
    }
  }

  async index(params) {
    let { city } = params;

    let offset = parseInt(Math.random() * 100);
    let limit = 10;
    offset = offset > limit ? offset - limit : 0;

    let hotInfos = await this.getHotInfo(offset, limit);

    offset = offset + limit;
    let latestComments = await teacherCtrl.getLatestComments();
    let careFreeHotInfos = await this.getHotInfo(offset, limit);
    let threeInfos = await this.getThreeArticle();
    let banners = await indexCtrl.getBanners(city);
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);

    let famousTeachers = await teacherCtrl.famousTeacher();

    return { latestComments, banners, hotInfos, careFreeHotInfos, threeInfos, materials, famousTeachers };
  }

}

module.exports = new ArticleCtrl();