/**
 * Created by tseian on 16/06/2017.
 */

const ArticleModel = require('../models/articleModel');
const ArticleTypesModel = require('../models/articleTypesModel');
const BaseCtrl = require('../controllers/baseCtrl');
const assert = require('assert');
const $ = require('cheerio');
const moment = require('moment');
const sequelize = require("../config/sequelize");
const dictionCtrl = require('../controllers/dictionaryCtrl');

const shortImgUrls = [
  'http://ortr4se0b.bkt.clouddn.com/short1.png',
  'http://ortr4se0b.bkt.clouddn.com/short2.png',
  'http://ortr4se0b.bkt.clouddn.com/short3.png',
  'http://ortr4se0b.bkt.clouddn.com/short4.png',
  'http://ortr4se0b.bkt.clouddn.com/short5.png'
];


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
    await this.changeEditStatus(id, 1);
    return article;
  }

  async getlist(title, id, offset) {
    let where = { a_status: 1, a_enu_code1: ["PARENT_ASK_ANSWER", "MATERIAL", "INFO"], a_edit_status: [0, 2] };

    let queryString = 'select count(a_id) as total from tbl_articles where a_status =1 and a_enu_code1 in ("PARENT_ASK_ANSWER","MATERIAL","INFO") and a_edit_status in (0,2)';

    if (title) {
      where.a_content_title = {
        $like: '%' + title + '%'
      };
      queryString += 'and a_content_title like "%' + title + '%"';
    }

    if (id && parseInt(id)) {
      where.a_id = parseInt(id);
      queryString += 'and a_id =' + id;
    }

    let query = { where, limit: 10 };
    if (offset && parseInt(offset)) {
      query.limit = [parseInt(offset), 10];
    }

    query.order = 'a_id asc';

    let list = await ArticleModel.findAll(query);

    let total = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });

    let types = { "PARENT_ASK_ANSWER": '家长问答', "MATERIAL": '资料下载', "INFO": '无忧资讯' };

    list.forEach(item => {
      item.dataValues.type = types[item.a_enu_code1];
      item.dataValues.a_update_time = moment(new Date(item.a_update_time)).format('YYYY-MM-DD hh:mm:ss');
      item.dataValues.a_create_time = moment(new Date(item.a_create_time)).format('YYYY-MM-DD hh:mm:ss');
      delete item.dataValues.a_content;
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

    let hotInfos = await this.getHotInfo(0, 10);
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let diction = [{ item: dictionCtrl.careFreeInfo, category: '类目：' }];

    let { list, total } = await this.list(null, null, null, type, offset, limit);

    list.forEach(item => {
      item.a_images
    });

    let data = {
      total, list, hotInfos,
      materials, diction,
      page: { offset, limit }
    };
    return data;
  }

  async fetch(id) {

    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);

    let article = await ArticleModel.findById(id);
    article.threeTitles = await this.getThreeArticle();
    article.hotInfos = await this.getHotInfo(0, 10);
    article.a_create_time = moment(article.a_create_time).format('YYYY-MM-DD hh:mm:ss');

    return { materials, article };
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
      order: [['a_create_time', 'DESC']]
    });

    list = list.map(l => {
      return { title: l.a_content_title, id: l.a_id }
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
      order: [['a_create_time', 'DESC']]
    });

    list = list.map(l => {
      return { title: l.a_content_title, id: l.a_id, time: moment(l.a_create_time).format('YYYY-MM-DD hh:mm:ss') }
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

    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotInfos = await this.getHotInfo(0, 10);
    let diction = [
      { 'item': dictionCtrl.subjectEnumeration, category: '科目：' },
      { 'item': dictionCtrl.gradeEnumeration, category: '年级：' }];

    if (grade == 'unlimit') {
      grade = null;
    }
    if (subject == 'unlimit') {
      subject = null;
    }
    let { list, total } = await this.list('MATERIAL', grade, subject, null, offset, limit);

    return { total, list, materials, hotInfos, diction, page: { offset, limit } };
  }

  /**
   * 获取家长问答资讯
   * @param params
   */
  async getParentQuestions(params) {
    let { offset, limit = 10, grade } =params;

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

    let data = {
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
      queryString += 'and a_type = "' + type + '" ';
    }
    let list = await ArticleModel.findAll({ where, offset, limit });
    let total = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });
    let tem = [];
    list.forEach(l => {
      let title = l.a_content_title;
      let content = $(l.a_content);
      let i = parseInt(Math.random() * 5);
      let url = shortImgUrls[i];
      let time = moment(l.a_create_time).format('YYYY-MM-DD');
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

}

module.exports = new ArticleCtrl();