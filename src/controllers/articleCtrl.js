/**
 * Created by tseian on 16/06/2017.
 */

const ArticleModel = require('../models/articleModel');
const BaseCtrl = require('../controllers/baseCtrl');
const assert = require('assert');
const $ = require('cheerio');
const moment = require('moment');
const dictionCtrl = require('../controllers/dictionaryCtrl');


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


  async list(params) {
    let list = await ArticleModel.findAll({
      where: { a_status: 1, a_type: params.type },
      offset: params.offset,
      limit: params.limit
    });
    let tem = [];
    list.forEach(l => {
      let title = l.a_content_title;
      let content = $(l.a_content);
      let imgs = content.find('img');
      let url = $(imgs[0]).attr('src') || null;
      let time = moment(l.a_createtime).format('YYYY-MM-DD');
      let id = l.a_id;
      tem.push({ title, url, time, id });
    });
    return tem;
  }

  async fetch(id) {
    let article = await ArticleModel.findById(id);
    article.a_createtime = moment(article.a_createtime).format('YYYY-MM-DD hh:mm:ss');
    return article;
  }

  async getThreeArticle() {
    let type = [
      dictionCtrl.careFreeInfo.sxgl.code,
      dictionCtrl.careFreeInfo.qzcf.code,
      dictionCtrl.careFreeInfo.bsxx.code,
      dictionCtrl.careFreeInfo.jzxd.code,
      dictionCtrl.careFreeInfo.gkzn.code
    ];

    let offset = parseInt(Math.random() * 10);
    let limit = 3;
    let list = await this.list({ type, offset, limit });
    return list;
  }

  async getHotInfo(offset, limit) {
    let type = [
      dictionCtrl.careFreeInfo.sxgl.code,
      dictionCtrl.careFreeInfo.qzcf.code,
      dictionCtrl.careFreeInfo.bsxx.code,
      dictionCtrl.careFreeInfo.jzxd.code,
      dictionCtrl.careFreeInfo.gkzn.code
    ];

    let list = await ArticleModel.findAll({
      where: { a_status: 1, a_type: type },
      offset: offset,
      limit: limit,
      order: [['a_createtime', 'DESC']]
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
        dictionCtrl.subjectEnumeration.CHINESE.code,
        dictionCtrl.subjectEnumeration.MATH.code,
        dictionCtrl.subjectEnumeration.ENGLISH.code,
        dictionCtrl.subjectEnumeration.OLYMPIC_MATH.code,
      ];
      let schoolGradeCodes = [
        dictionCtrl.gradeEnumeration.GRADE1.code,
        dictionCtrl.gradeEnumeration.GRADE2.code,
        dictionCtrl.gradeEnumeration.GRADE3.code,
        dictionCtrl.gradeEnumeration.GRADE4.code,
        dictionCtrl.gradeEnumeration.GRADE5.code,
        dictionCtrl.gradeEnumeration.GRADE6.code,
      ];
      code2s = schoolGradeCodes;
      code3s = schoolSubCodes;
    } else if (type == 'senior') {
      let seniorSubCodes = [
        dictionCtrl.subjectEnumeration.CHINESE.code,
        dictionCtrl.subjectEnumeration.MATH.code,
        dictionCtrl.subjectEnumeration.ENGLISH.code,
        dictionCtrl.subjectEnumeration.OLYMPIC_MATH.code,
        dictionCtrl.subjectEnumeration.PHYSICS.code,
        dictionCtrl.subjectEnumeration.POLITICS.code,
        dictionCtrl.subjectEnumeration.HISTORY.code,
        dictionCtrl.subjectEnumeration.CHEMISTRY.code,
        dictionCtrl.subjectEnumeration.GEOGRAPHY.code,
        dictionCtrl.subjectEnumeration.BIOLOGY.code
      ];

      let seniorGradeCodes = [
        dictionCtrl.gradeEnumeration.GRADE8.code,
        dictionCtrl.gradeEnumeration.GRADE9.code,
        dictionCtrl.gradeEnumeration.GRADE7.code,
      ];

      code2s = seniorGradeCodes;
      code3s = seniorSubCodes;
    } else if (type == 'high') {
      let highGradeCodes = [
        dictionCtrl.gradeEnumeration.GRADE10.code,
        dictionCtrl.gradeEnumeration.GRADE11.code,
        dictionCtrl.gradeEnumeration.GRADE12.code,
      ];
      let highSubCodes = [
        dictionCtrl.subjectEnumeration.CHINESE.code,
        dictionCtrl.subjectEnumeration.MATH.code,
        dictionCtrl.subjectEnumeration.ENGLISH.code,
        dictionCtrl.subjectEnumeration.OLYMPIC_MATH.code,
        dictionCtrl.subjectEnumeration.PHYSICS.code,
        dictionCtrl.subjectEnumeration.POLITICS.code,
        dictionCtrl.subjectEnumeration.HISTORY.code,
        dictionCtrl.subjectEnumeration.CHEMISTRY.code,
        dictionCtrl.subjectEnumeration.GEOGRAPHY.code,
        dictionCtrl.subjectEnumeration.BIOLOGY.code
      ];

      code2s = highGradeCodes;
      code3s = highSubCodes;
    }

    let list = await ArticleModel.findAll({
      where: { a_status: 1, a_enu_code1: 'MATERIAL', a_enu_code2: code2s, a_enu_code3: code3s },
      offset: 0,
      limit: limit,
      order: [['a_createtime', 'DESC']]
    });

    list = list.map(l => {
      return { title: l.a_content_title, id: l.a_id, time: moment(l.a_createtime).format('YYYY-MM-DD hh:mm:ss') }
    });
    return list;
  }

}

module.exports = new ArticleCtrl();