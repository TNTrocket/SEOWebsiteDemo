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
const paramsUtil = require('../common/paramsUtil');
const schoolModel = require('../models/schoolInfoModel');
const siteMapCtrl = require('../controllers/siteMapCtrl');
const columnCtrl = require('../controllers/columnCtrl');


class ArticleCtrl extends BaseCtrl {
  //删除文章
  async del(id) {
    let article = await ArticleModel.findById(id);
    assert(article, '400 没有该文章');
    let count = await ArticleModel.update({ a_status: 0 }, {
      where: { a_id: id },
      fields: ['a_status']
    });

    //无忧资讯的文章 需要xuanshisitemap-zixun-x.xml文件
    if (article.a_enu_code1 == 'INFO') {
      await siteMapCtrl.delZixunUrlById(id);
    }

    return { success: true, msg: '删除成功', data: count };
  }

  /**
   * 获取文章信息
   * @param id
   * @returns {*}
   */
  async getArticleById(id) {
    let article = await ArticleModel.findById(id);
    assert(article, '不存在该文章');
    //修改为 编辑中
    // await this.changeEditStatus(id, 1);
    return article;
  }

  /**
   * 文章列表
   * @param title
   * @param id
   * @param offset
   * @param status
   * @returns {{list: *, total: number}}
   */
  async getlist(title, id, offset, editStatus) {
    let queryArticleString = 'select a_enu_code1,a_update_time,a_create_time,a_id,a_content_title,a_edit_status' +
      ' from tbl_articles where  a_enu_code1 in ("PARENT_ASK_ANSWER","MATERIAL","INFO") and a_status = 1';
    let queryString = 'select count(a_id) as total from tbl_articles where a_enu_code1 in ("PARENT_ASK_ANSWER","MATERIAL","INFO") and a_status = 1 ';

    if (title) {
      queryArticleString += 'and a_content_title like "%' + title + '%"';
      queryString += 'and a_content_title like "%' + title + '%"';
    }

    if (editStatus) {
      editStatus = parseInt(editStatus);
      queryString += ' and a_edit_status  = ' + editStatus;
      queryArticleString += ' and a_edit_status = ' + editStatus;
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

  /**
   * 更新文章
   * @param params
   * @returns {{success: boolean, msg: string, data: *}}
   */
  async updateArticle(params) {
    let { id, title, imageUrl, content, time, seoTitle, description, keyword, articleTypeId } = params;

    let articleType = await ArticleTypesModel.findById(articleTypeId);
    assert(articleType, 'articleTypeId 参数有误');
    time = time || new Date().getTime();

    let values = {
      'a_content': content,
      'a_images': imageUrl,
      'a_content_title': title,
      'a_update_time': time,
      a_keyword: keyword,
      a_title: seoTitle,
      a_description: description,
      a_type: articleTypeId,
      a_enu_code1: articleType.at_enu_code1,
      a_enu_code2: articleType.at_enu_code2,
      a_enu_code3: articleType.at_enu_code3,
      a_status: 1
    };

    await ArticleModel.update(values, {
      where: { a_id: id },
      fields: ['a_enu_code1', 'a_enu_code2',
        'a_enu_code3', 'a_title',
        'a_content', 'a_images',
        'a_content_title', 'a_update_time',
        'a_keyword', 'a_title',
        'a_description', 'a_type', 'a_status']
    });

    await this.changeEditStatus(id, 1);
    //无忧资讯文章 需要更新url链接时间
    if (articleType.at_enu_code1 == 'INFO') {
      await siteMapCtrl.updateWuyouUrlXmlDateById(id, time);
    }
    let article = await ArticleModel.findById(id);
    return { success: true, msg: '更新成功', data: article, };
  }

  async studyNewList(params) {
    let { type, offset = 0, limit } = params;
    let latestComments = await teacherCtrl.getLatestComments();
    let hotInfos = await this.getHotInfo(0, 10);
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);

    let diction = [{ item: await dictionCtrl.careFreeInfos(), category: '类目：' }];

    let famousTeachers = await teacherCtrl.famousTeacher();

    let { list, total } = await this.list(null, null, null, type, offset, limit);


    let data = {
      latestComments,
      famousTeachers,
      total,
      list,
      hotInfos,
      materials,
      diction,
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

    let careFreeInfos = await dictionCtrl.careFreeInfos();
    let type = [];
    let keys = Object.keys(careFreeInfos);
    for (let cfi of keys) {
      type.push(careFreeInfos[cfi].at_id);
    }

    let offset = parseInt(Math.random() * 100);
    let limit = 3;
    let { list } = await this.list(null, null, null, type, offset, limit);
    list.forEach(i => {
      let index = parseInt(Math.random() * 10) + 1;
      i.longImgUrl = 'http://cdn.seo.51xuanshi.com/longIMG' + index + '.png';
    });
    return list;
  }

  /**
   *  获得热门资讯
   * @param offset
   * @param limit
   * @returns {*}
   */
  async getHotInfo(offset, limit) {
    let careFreeInfos = await dictionCtrl.careFreeInfos();
    let type = [];
    let keys = Object.keys(careFreeInfos);
    for (let cfi of keys) {
      type.push(careFreeInfos[cfi].at_id);
    }

    let list = await ArticleModel.findAll({
      where: { a_status: 1, a_type: type },
      offset: offset,
      limit: limit,
      order: [
        ['a_update_time', 'DESC']
      ]
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

    let code2s = [],
      code3s = [];

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
      order: [
        ['a_update_time', 'DESC']
      ]
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

    let { queryString, cityPinyin, limit = 10, offset = 0 } = params;
    let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionCtrl.areaLevel.city.level);

    let downloadEnuS = await paramsUtil.parseParams(queryString);

    let latestComments = await teacherCtrl.getLatestComments();
    let schoolMaterials = await this.getLatestMaterials('school', 3);
    let seniorMaterials = await this.getLatestMaterials('senior', 3);
    let highMaterials = await this.getLatestMaterials('high', 4);
    let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
    let hotInfos = await this.getHotInfo(0, 10);
    let diction = [
      { 'item': dictionCtrl.s_b_subject_enu, category: '科目：' },
      { 'item': dictionCtrl.s_a_grade_enu, category: '年级：' }
    ];

    let famousTeachers = await teacherCtrl.famousTeacher();

    let grade = null;
    let subject = null;

    let tkdGrade = '';
    let tkdSubject = '';
    let tkdArea = cityInfo.a_name;
    for (let p of downloadEnuS) {
      //年级
      if (p.a) {
        assert(dictionCtrl.s_a_grade_enu[p.a].code, '学校年级参数错误');
        grade = dictionCtrl.s_a_grade_enu[p.a].code;
        tkdGrade = dictionCtrl.s_a_grade_enu[p.a].name;
      }
      //科目
      if (p.b) {
        assert(dictionCtrl.s_b_subject_enu[p.b].code, '科目参数错误');
        subject = dictionCtrl.s_b_subject_enu[p.b].code;
        tkdSubject = dictionCtrl.s_b_subject_enu[p.b].name;
      }
    }

    let { list, total } = await this.list('MATERIAL', grade, subject, null, offset, limit);
    let title = '';
    let keyWords = '';
    let description = '';
    if (downloadEnuS.length == 0) {
      title = tkdArea + '中小学辅导资料免费下载_最新小升初/初中/高中试题下载_教材资料免费下载';
      keyWords = '资料免费下载';
      description = '选师无忧提供' + cityInfo.a_name +
        '最新小升初/初中/高中辅导资料免费下载,汇集全国各地小学/初中/高中考试试题,真题题库,升学资讯资料下载等';
    }
    title = tkdArea + '辅导资料免费下载_最新小升初/初中/高中试题下载_教材资料免费下载';
    keyWords = tkdArea + '辅导资料免费下载,';
    if (tkdGrade) {
      keyWords += tkdGrade + '资料免费下载,';
      title = tkdGrade + title;
    }
    if (tkdSubject) keyWords += tkdSubject + '资料免费下载';
    description = ' 选师无忧提供最新' + tkdArea + tkdGrade + tkdSubject +
      '辅导资料免费下载,汇集全国各地小学/初中/高中考试试题,真题题库,升学资讯资料下载等';
    let tkd = { title, keyWords, description };

    let data = {
      tkd,
      latestComments,
      famousTeachers,
      total,
      list,
      materials,
      hotInfos,
      diction,
      page: { offset, limit }
    };
    return data;
  }

  /**
   * 获取家长问答资讯
   * @param params
   */
  async getParentQuestions(params) {
    let { offset, limit = 10, grade } = params;
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
      total,
      list,
      materials,
      diction,
      hotInfos,
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

  async pcIndex(params) {
    let { cityInfo } = params;

    let offset = parseInt(Math.random() * 100);
    let limit = 10;
    offset = offset > limit ? offset - limit : 0;

    let hotInfos = await this.getHotInfo(offset, limit);

    offset = offset + limit;
    let latestComments = await teacherCtrl.getLatestComments();
    let careFreeHotInfos = await this.getHotInfo(offset, limit);
    let threeInfos = await this.getThreeArticle();

    let schools = await schoolModel.findAll({ where: { category: ['民办小学', '公办小学'] }, limit: 10 });

    let seniors = await schoolModel.findAll({ where: { category: ['民办中学', '公办中学'] }, limit: 10 });

    let provinceLevels = await schoolModel.findAll({ where: { level: '省一级' }, limit: 10 });
    let cityLevels = await schoolModel.findAll({ where: { level: '市一级' }, limit: 10 });
    let districtLevels = await schoolModel.findAll({ where: { level: '区一级' }, limit: 10 });

    schools = { schools, seniors, provinceLevels, cityLevels, districtLevels };

    //获取 每种类型的文章
    let careFreeInfoTypes = await dictionCtrl.careFreeInfos();
    let keys = Object.keys(careFreeInfoTypes);

    for (let i = 0; i < keys.length; i++) {
      careFreeInfoTypes[keys[i]].articles = await this.list(careFreeInfoTypes[keys[i]].at_enu_code1,
        careFreeInfoTypes[keys[i]].at_enu_code2, careFreeInfoTypes[keys[i]].at_enu_code3, null, 0, 10);
    }

    let banners = await indexCtrl.getBanners(cityInfo.a_id);

    let schoolMaterials = await this.getLatestMaterials('school', 10);
    let seniorMaterials = await this.getLatestMaterials('senior', 10);
    let highMaterials = await this.getLatestMaterials('high', 10);
    let materials = { schoolMaterials, seniorMaterials, highMaterials };

    let famousTeachers = await teacherCtrl.famousTeacher();

    return {
      latestComments,
      schools,
      banners,
      hotInfos,
      careFreeHotInfos,
      threeInfos,
      materials,
      famousTeachers,
      careFreeInfoTypes
    };
  }

  /**
   * 发布文章
   */
  async add(params) {
    let { title, articleTypeId, content, seoKeywords, seoDescription, createTime, createBy = 0 } = params;
    let articleType = await ArticleTypesModel.findById(articleTypeId);
    let article = await ArticleModel.create({
      a_title: title,
      a_keyword: seoKeywords,
      a_description: seoDescription,
      a_content_title: title,
      a_content: content,
      a_images: null,
      a_source_url: null,
      a_enu_code1: articleType.at_enu_code1,
      a_enu_code2: articleType.at_enu_code2,
      a_enu_code3: articleType.at_enu_code3,
      a_type: articleTypeId,
      a_update_time: createTime,
      a_create_time: createTime,
      a_edit_status: 1
    });
    //添加一个url到xml文件
    await siteMapCtrl.addWuyouUrlXml(article.a_id, createTime);
    return { success: true, msg: '创建成功', data: article };
  }

  /**
   * 添加一个无忧资讯的type
   * @param params
   */
  async addWuyouType(params) {
    let { name, seoUrl, seoTitle, keywords, description } = params;
    let enuCode2 = seoUrl.toUpperCase();
    //判断是否有相同的名称或者路由的文章类型
    let articleTypeCount = await ArticleTypesModel.count({
      where: {
        at_status: 1,
        at_parent_id: 2,
        $or: [{ at_name: name }, { at_url: seoUrl }, { at_enu_code2: enuCode2 }]
      }
    });
    if (articleTypeCount > 0) {
      return { success: false, msg: '存在同名或者路由相同的类型', data: articleTypeCount };
    }

    let now = new Date().getTime();
    let articleType = await ArticleTypesModel.create({
      at_name: name,
      at_parent_id: 2,
      at_enu_code1: 'INFO',
      at_enu_code2: enuCode2,
      at_url: seoUrl,
      at_title: seoTitle,
      at_keywords: keywords,
      at_description: description,
      at_status: 1,
      at_create_by: 0,
      at_update_by: 0,
      at_create_time: now,
      at_update_time: now
    });
    return { success: true, msg: '添加成功', data: articleType };
  }

  /**
   * 修改一个文章类型的状态  1：有效  0 ：删除
   * @param id
   */
  async updateArticleTypeStatus(id, status) {
    status = parseInt(status);

    let count = await ArticleTypesModel.update({
      at_status: status,
      at_update_time: new Date().getTime()
    }, { where: { at_id: id } });

    return { success: true, msg: '操作成功', data: count };
  }

  /**
   * 下架一个文章类型
   * @param id
   * @returns {*}
   */
  async delArticleTypeById(id) {
    let count = await ArticleModel.count({ where: { a_type: id, a_status: 1 } });
    if (count > 0) {
      return { success: false, msg: '改文章类目下还有文章，请将文章移动到其他文章类目', data: count };
    } else {
      return this.updateArticleTypeStatus(id, 0);
    }
  }

  /**
   * 修改一个文章类型 数据
   * @param params
   */
  async updateArticleType(params) {
    let { id, name, seoUrl, seoTitle, keywords, description } = params;

    //检查是否有相同的名字和路由的文章类型
    let articleCount = await ArticleTypesModel.count({
      where: {
        at_id: { $ne: id },
        $or: [{ at_name: name }, { at_url: seoUrl }]
      }
    });
    if (articleCount > 0) {
      return { success: false, msg: '操作失败，存在名称相同或路由相同的类型', data: articleCount };
    }

    let now = new Date().getTime();
    let count = await ArticleTypesModel.update({
      at_name: name,
      at_title: seoTitle,
      at_url: seoUrl,
      at_keywords: keywords,
      at_description: description,
      at_update_time: now
    }, {
      where: { at_id: id },
      fields: ['at_update_time', 'at_name', 'at_title', 'at_url', 'at_keywords', 'at_description']
    });
    return { success: true, msg: '操作成功', data: await ArticleTypesModel.findById(id) };
  }

  /**
   * 无忧资讯类型清单
   * @param status
   */
  async wuyouTypeList() {
    return { success: true, msg: '获取成功', data: await dictionCtrl.careFreeInfos([0, 1]) };
  }

  /**
   * 下一篇文章
   * @param id
   */
  async nextArticle(id) {
    let nextArticle = await ArticleModel.findAll({ where: { a_id: { $gt: id } }, limit: 1 });
    return { success: true, msg: '获取成功', data: nextArticle };
  }
}

module.exports = new ArticleCtrl();