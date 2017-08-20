/**
 * Created by tseian on 09/08/2017.
 */
const BaseCtrl = require('../controllers/baseCtrl');
const sequelize = require("../config/sequelize");
const ArticleModel = require('../models/articleModel');
const SchoolInfoModel = require('../models/schoolInfoModel');
const TeacherModel = require('../models/teacherModel');

const promise = require('bluebird');
const redis = require('../config/redis');
const fs = require('fs');
const assert = require('assert');
const moment = require('moment');
const xml2js = promise.promisifyAll(require('xml2js'));
const xmlBuilder = new xml2js.Builder();
const largest = 30000;

const mHead = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
xmlns:mobile="http://www.baidu.com/schemas/sitemap-mobile/1/">`;

const pcHead = `<?xml version="1.0" encoding="utf-8"?><urlset>`;

const end = `</urlset>`;
const mXuanshiMapTem = `<url>
     <loc>
     http://m.51xuanshi.com/{entity}/{strId}.html
     </loc>
     <mobile:mobile type="mobile">
     <lastmod>{mTime}</lastmod>
     <changefreq>monthly</changefreq>
     </mobile:mobile>
     </url>`;
const pcXuanshiMapTem = `<url>
     <loc>http://www.51xuanshi.com/{entity}/{strId}.html</loc>
     <lastmod>{pcTime}</lastmod>
     </url>`;

const pcSiteMapPath = './static/sitemap.xml';
const mSiteMapPath = './static/yidong/sitemap.xml';
class SiteMapCtrl extends BaseCtrl {

  async init() {
    //如果 没有缓存在redis里面  就进行生成文件  只生成一次
    let hasInit = await redis.getAsync('hasInitSiteMapXml');
    if (!hasInit) {
      await  this.initSiteMap();
    }

  }

  /**
   * 初始化所有的sitemap
   */
  async initSiteMap() {

    await this.initTeacherSiteMap();
    await this.initWuyouSiteMap();
    await this.initSchoolSiteMap();
    redis.set('hasInitSiteMapXml', true);
  }

  /**
   *  恢复一个老师的连接
   * @param id
   * @param date
   * @returns {{success, msg}|{success, msg, data}|*}
   */
  async resumeTeacherUrlById(id, date) {
    let strId = 'te' + id;
    let entity = 'teacher';
    let xmlType = 'laoshi';
    return await this.resumeUrlById(id, date, strId, entity, xmlType);
  }


  /**
   *  恢复一个学校的连接
   * @param id
   * @param date
   * @returns {{success, msg}|{success, msg, data}|*}
   */
  async resumeSchoolUrlById(id, date) {
    let strId = 'rp' + id;
    let entity = 'school';
    let xmlType = 'xuexiao';
    return await this.resumeUrlById(id, date, strId, entity, xmlType);
  }

  /**
   *  恢复一个文章的连接
   * @param id
   * @param date
   * @returns {{success, msg}|{success, msg, data}|*}
   */
  async resumeArticleUrlById(id, date) {
    let strId = 'sd' + id;
    let entity = 'wuyou';
    let xmlType = 'zixun';
    return await this.resumeUrlById(id, date, strId, entity, xmlType);
  }


  /**
   * 恢复一个连接
   * @param id
   * @param date
   * @param strId
   * @param entity
   * @param xmlType  laoshi xuexiao zixun
   * @returns {*}
   */
  async resumeUrlById(id, date, strId, entity, xmlType) {

    let xuanShiSiteMapXmlFileInfo = await this.findXmlFileById(id, xmlType);

    let xmlFileName = xuanShiSiteMapXmlFileInfo.fileName;
    let mFile = fs.readFileSync('./static/yidong/' + xmlFileName);
    let pcFile = fs.readFileSync('./static/' + xmlFileName);

    let mFileObj = await xml2js.parseStringAsync(mFile);
    let pcFileObj = await xml2js.parseStringAsync(pcFile);

    for (let i = 0; i < pcFileObj.urlset.url.length; i++) {
      let url = pcFileObj.urlset.url[i].loc[0];
      if (url.match(strId + '.html')) {
        console.log(`${url}为有效连接`);
        return { success: false, msg: '该链接为有效连接' };
      }
    }

    let pcTem = pcXuanshiMapTem.replace('{entity}', entity)
      .replace('{strId}', strId)
      .replace('{pcTime}', moment(date).format('YYYY-MM-DD'));

    let mTem = mXuanshiMapTem.replace('{entity}', entity)
      .replace('{strId}', strId)
      .replace('{mTime}', moment(date).format());

    let mTemObj = await xml2js.parseStringAsync(mTem);
    let pcTemObj = await xml2js.parseStringAsync(pcTem);

    mFileObj.urlset.url.push(mTemObj.url);
    pcFileObj.urlset.url.push(pcTemObj.url);

    let pcXml = xmlBuilder.buildObject(pcFileObj);
    let mXml = xmlBuilder.buildObject(mFileObj);

    await this.writeToFile('./static/' + xmlFileName, pcXml);
    await this.writeToFile('./static/yidong/' + xmlFileName, mXml);
    await this.delUrlFromSilianjieXmlById(strId, entity);
    console.log('恢复成功');
    return { success: true, msg: '成功', data: xmlFileName };
  }

  /**
   * 删除一个死链接
   * @param str
   * @param id
   */
  async delUrlFromSilianjieXmlById(strId, entity) {

    let pcUrl = `http://www.51xuanshi.com/${entity}/${strId}.html`;
    let mUrl = `http://m.51xuanshi.com/${entity}/${strId}.html`;
    let dirs = fs.readdirSync('./static/deadUrl/');

    for (let i = 0; i < dirs.length; i++) {
      let fileName = dirs[i];
      let silianjieXml = fs.readFileSync('./static/deadUrl/' + fileName);
      let silianjieXmlStr = new String(silianjieXml).replace(pcUrl, '').replace(mUrl, '').trim();
      await this.writeToFile('./static/deadUrl/' + fileName, silianjieXmlStr);
    }
  }

  /**
   * 生成sitemap.xml
   */
  async createSiteMap() {
    let mDir = fs.readdirSync('./static');

    let mxml = `<?xml version="1.0" encoding="utf-8"?><sitemapindex>`;
    let pcxml = `<?xml version="1.0" encoding="utf-8"?><sitemapindex>`;
    mDir.forEach(i => {
      if (i.match('xuanshisitemap-')) {
        mxml += `<sitemap><loc>http://m.51xuanshi.com/yidong/${i}</loc></sitemap>`;
        pcxml += `<sitemap><loc>http://www.51xuanshi.com/${i}</loc></sitemap>`;
      }
    });
    mxml += `</sitemapindex>`;
    pcxml += `</sitemapindex>`;
    await this.writeToFile('./static/yidong/sitemap.xml', mxml);
    await this.writeToFile('./static/sitemap.xml', pcxml);
    console.log('加入sitemap.xml文件成功');
  }

  /**
   * 初始化老师sitemap
   */
  async initTeacherSiteMap() {

    let total = await TeacherModel.count({ where: { t_status: 1 } });

    let fileSum = parseInt(total / largest + 1);

    for (let i = 0; i < fileSum; i++) {
      await this.createTeacherSiteMap(i);
    }
    await this.createSiteMap();
    console.log('xuanshisitemap-laoshi-x.xml生成成功');
  }


  /**
   * 创建老师sitemap 填充内容 同时 将文件内的id 范围写入 redis
   */
  async createTeacherSiteMap(fileNo) {
    let offset = parseInt(fileNo) * largest;
    let queryString = `select t_id,t_create_time,t_update_time from tbl_teacher where t_status = 1 order by t_id asc limit ${offset},${largest}`;
    let teachers = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });
    let pcUrl = pcHead;
    let mUrl = mHead;
    for (let teacher of teachers) {

      let t = teacher.t_update_time || teacher.t_create_time || new Date();
      let mTime = moment(t).format();
      let strId = 'te' + teacher.t_id;
      let pcTime = moment(t).format('YYYY-MM-DD');

      mUrl += mXuanshiMapTem.replace('{strId}', strId).replace('{mTime}', mTime).replace('{entity}', 'teacher');
      pcUrl += pcXuanshiMapTem.replace('{strId}', strId).replace('{pcTime}', pcTime).replace('{entity}', 'teacher');
    }
    pcUrl += end;
    mUrl += end;
    fileNo++;
    redis.hmset('laoshiUrls.' + fileNo, ['fileNo', fileNo, 'fileName', `xuanshisitemap-laoshi-${fileNo}.xml`, 'startId', teachers[0].t_id, 'endId', teachers[teachers.length - 1].t_id]);
    await this.writeToFile(`./static/yidong/xuanshisitemap-laoshi-${fileNo}.xml`, mUrl);
    await this.writeToFile(`./static/xuanshisitemap-laoshi-${fileNo}.xml`, pcUrl);
  }

  /**
   * 初始化无忧资讯sitemap
   */
  async initWuyouSiteMap() {
    let total = await ArticleModel.count({ where: { a_status: 1, a_enu_code1: 'INFO' } });

    let fileSum = parseInt(total / largest + 1);

    for (let i = 0; i < fileSum; i++) {
      await this.createWuyouSiteMap(i);
    }
    await this.createSiteMap();
    console.log('xuanshisitemap-zixun-x.xml生成成功');
  }

  /**
   * 创建无忧资讯的sitemap 填充内容 同时 将文件内的id 范围写入 redis
   */
  async createWuyouSiteMap(fileNo) {
    let offset = parseInt(fileNo) * largest;
    let queryString = `select a_id,a_create_time,a_update_time from tbl_articles where a_status = 1 and a_enu_code1 ='INFO' order by a_id asc limit ${offset},${largest}`;
    let articles = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });
    let pcUrl = pcHead;
    let mUrl = mHead;
    for (let article of articles) {

      let t = article.a_create_time || article.a_update_time || new Date();
      let mTime = moment(t).format();
      let strId = 'sd' + article.a_id;
      let pcTime = moment(t).format('YYYY-MM-DD');

      mUrl += mXuanshiMapTem.replace('{strId}', strId).replace('{mTime}', mTime).replace('{entity}', 'wuyou');
      pcUrl += pcXuanshiMapTem.replace('{strId}', strId).replace('{pcTime}', pcTime).replace('{entity}', 'wuyou');

    }
    pcUrl += end;
    mUrl += end;
    fileNo = fileNo + 1;
    let fileName = `xuanshisitemap-zixun-${fileNo}.xml`;
    redis.hmset('zixunUrls.' + fileNo, ['fileNo', fileNo, 'fileName', fileName, 'startId', articles[0].a_id, 'endId', articles[articles.length - 1].a_id]);
    await this.writeToFile(`./static/yidong/${fileName}`, mUrl);
    await this.writeToFile(`./static/${fileName}`, pcUrl);
  }

  /**
   * 初始化无忧资讯sitemap
   */
  async initSchoolSiteMap() {
    let total = await SchoolInfoModel.count({ where: { status: 1 } });

    let fileSum = parseInt(total / largest + 1);

    for (let i = 0; i < fileSum; i++) {
      await this.crateSchoolSiteMap(i);
    }
    await this.createSiteMap();
    console.log('xuanshisitemap-xuexiao-x.xml生成成功');
  }

  /**
   * 创建无忧资讯的sitemap 填充内容 同时 将文件内的id 范围写入 redis
   */
  async crateSchoolSiteMap(fileNo) {
    let offset = parseInt(fileNo) * largest;
    let queryString = `select id,created_at,updated_at from tbl_school_info where status = 1 order by id asc  limit ${offset},${largest}`;
    let schools = await sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT });
    let pcUrl = pcHead;
    let mUrl = mHead;
    for (let school of schools) {

      let t = school.updated_at || school.created_at || new Date();
      let mTime = moment(t).format();
      let strId = 'rp' + school.id;
      let pcTime = moment(t).format('YYYY-MM-DD');

      mUrl += mXuanshiMapTem.replace('{strId}', strId).replace('{mTime}', mTime).replace('{entity}', 'school');
      pcUrl += pcXuanshiMapTem.replace('{strId}', strId).replace('{pcTime}', pcTime).replace('{entity}', 'school');

    }
    pcUrl += end;
    mUrl += end;
    fileNo++;
    let fileName = `xuanshisitemap-xuexiao-${fileNo}.xml`;
    redis.hmset('xuexiaoUrls.' + fileNo, ['fileNo', fileNo, 'fileName', fileName, 'startId', schools[0].id, 'endId', schools[schools.length - 1].id]);
    await this.writeToFile(`./static/yidong/${fileName}`, mUrl);
    await this.writeToFile(`./static/${fileName}`, pcUrl);
  }

  //写入文件
  async writeToFile(filePath, content) {
    let out = fs.createWriteStream(filePath, { encoding: 'utf-8', flags: 'w' });
    out.write(content);
    out.end();
    return { success: true, msg: '添加成功' };
  }

  /**
   * 给sitemap 添加一个xml文件路径记录
   * @param fileName
   * @constructor
   */
  async addXmlPathToSiteMap(fileName) {

    let pcSiteMapXml = fs.readFileSync(pcSiteMapPath);
    let pcSiteMapObj = await xml2js.parseStringAsync(pcSiteMapXml);
    pcSiteMapObj.sitemapindex.sitemap.push({ loc: [`http://www.51xuanshi.com/${fileName}`] });
    pcSiteMapXml = xmlBuilder.buildObject(pcSiteMapObj);

    let pcXuanshiSiteMapXml = pcHead + end;

    await this.writeToFile(`./static/${fileName}`, pcXuanshiSiteMapXml);

    await this.writeToFile(pcSiteMapPath, pcSiteMapXml);

    let mSiteMapXml = fs.readFileSync(mSiteMapPath);
    let mSiteMapObj = await xml2js.parseStringAsync(mSiteMapXml);
    mSiteMapObj.sitemapindex.sitemap.push({ loc: [`http://m.51xuanshi.com/${fileName}`] });
    mSiteMapXml = xmlBuilder.buildObject(mSiteMapObj);

    await this.writeToFile(mSiteMapPath, mSiteMapXml);
    console.log(`添加文件${fileName}的路径到sitemap.xml文件`);
  }

  /**
   * 增加一个二级 xuanshisitemap-xmltype-x.xml 文件 并增加第一个url
   * @param xmlType
   */
  async xuanshiSiteMapAdd(xmlType, strId, entity, date) {

    let redisFileInfoKey = xmlType + 'Urls.';

    let lastFileInfo = await this.findLastXuanshiSiteMapFileInfo(xmlType);
    let fileNo = parseInt(lastFileInfo.fileNo) + 1;
    let fileName = 'xuanshisitemap-' + xmlType + '-' + fileNo + '.xml';

    let pcTem = pcXuanshiMapTem.replace('{entity}', entity)
      .replace('strId', strId)
      .replace('pcTime', moment(date).format('YYYY-MM-DD'));

    let mTem = pcXuanshiMapTem.replace('{entity}', entity)
      .replace('strId', strId)
      .replace('mTime', moment(date).format());

    let pcxml = pcHead + pcTem + end;
    let mxml = mHead + mTem + end;

    await this.writeToFile('./static/' + fileName, pcxml);
    await this.writeToFile('./static/yidong/' + fileName, mxml);
    await this.addXmlPathToSiteMap(fileName);
    redis.hmset(redisFileInfoKey + fileNo, ['fileNo', fileNo, 'fileName', fileName, 'startId', 0, 'endId', 0]);
    return { success: true, msg: '成功', data: { fileName } };
  }

  /**
   * 更新了一个老师的信息  需要修改 xml里面的日期
   * @param id
   */
  async updateTeacherUrlXmlDateById(id, date) {
    let strId = 'te' + id;
    return this.updateUrlDateById(strId, date, 'laoshi');
  }

  /**
   * 更新了一篇无忧资讯的文章的信息  需要修改 xml里面的日期
   * @param id
   */
  async updateWuyouUrlXmlDateById(id, date) {
    let strId = 'sd' + id;
    return this.updateUrlDateById(strId, date, 'zixun');
  }


  /**
   * 更新了一个学校的信息  需要修改 xml里面的日期
   * @param id
   */
  async updateSchoolUrlXmlDateById(id, date) {
    let strId = 'rp' + id;
    return this.updateUrlDateById(strId, date, 'xuexiao');
  }

  /**
   * 更新时间 通过 id xmltype
   * @param strId
   * @param date
   * @param xmlType
   * @returns {{success: boolean, msg: string}}
   */
  async updateUrlDateById(strId, date, xmlType) {
    let id = strId.substr(2, strId.length - 2);

    let xmlFile = await this.findXmlFileById(id, xmlType);
    let xmlFileName = xmlFile.fileName;
    assert(xmlFile, '参数有误');

    let pcXmlFileObj = await xml2js.parseStringAsync(await fs.readFileSync('./static/' + xmlFileName));
    let mXmlFileObj = await xml2js.parseStringAsync(await fs.readFileSync('./static/yidong/' + xmlFileName));

    let pcUrls = pcXmlFileObj.urlset.url;
    let mUrls = mXmlFileObj.urlset.url;

    let matchResult = false;
    for (let i = 0; i < pcUrls.length; i++) {
      if (pcUrls[i].loc[0].match(strId + '.html')) {
        matchResult = true;
        pcUrls[i].lastmod[0] = moment(date).format('YYYY-MM-DD');
      }

      if (mUrls[i].loc[0].match(strId + '.html')) {
        matchResult = true;
        mUrls[i]['mobile:mobile'][0].lastmod[0] = moment(date).format();
      }
    }
    if (!matchResult) {
      return { success: false, msg: '更新url路由时间失败，没有找到相对的url' };
    }

    pcXmlFileObj.urlset.url = pcUrls;
    mXmlFileObj.urlset.url = mUrls;

    let pcXml = xmlBuilder.buildObject(pcXmlFileObj);
    let mXml = xmlBuilder.buildObject(mXmlFileObj);

    await this.writeToFile('./static/' + xmlFileName, pcXml);
    await this.writeToFile('./static/yidong/' + xmlFileName, mXml);
    console.log(`修改 ${strId}.html路由的更新时间 成功`);
    return { success: true, msg: '成功' };
  }

  /**
   * 根据id找到 该id对应的存放文件
   * @param id
   * @param xmlType laoshi xuexiao zixun
   */
  async findXmlFileById(id, xmlType) {
    let index = 0;
    let redisFileInfoKey = xmlType + 'Urls.';
    let file = null;
    while (true) {
      index++;
      let fileInfo = await redis.hgetallAsync(redisFileInfoKey + index);

      if (!fileInfo) {
        break;
      } else {
        let startId = parseInt(fileInfo.startId);
        let endId = parseInt(fileInfo.endId);
        if (id >= startId && id <= endId) {
          file = fileInfo;
        }
      }
    }
    assert(file, `没有找到id为${id}的${xmlType}的url所在的xml文件`);
    return file;
  }


  /**
   * 增加一个老师 增加xml 记录
   * @param id
   */
  async addTeacherUrlXml(id, date) {
    let strId = 'te' + id;
    return await this.addUrlToXml(strId, date, 'laoshi', 'teacher');
  }

  /**
   * 增加一篇无忧资讯的文章 增加xml 记录
   * @param id
   */
  async addWuyouUrlXml(id, date) {
    let strId = 'sd' + id;
    return await this.addUrlToXml(strId, date, 'zixun', 'wuyou');
  }


  /**
   * 增加一个学校 增加xml 记录
   * @param id
   */
  async addSchoolUrlXml(id, date) {
    let strId = 'rp' + id;
    return await this.addUrlToXml(strId, date, 'xuexiao', 'school');
  }

  /**
   * 添加一个 URl 到 二级xml 文件  如果最后一个二级文件满了 30000 条
   * 生成下一个文件 同事添加url进去
   * @param strId  strId  .html
   * @param date   时间
   * @param xmlType  xml 文件命名 类型  laoshi zixun xuexiao
   * @param entity   属于哪一类型的文件  在url 上的提现 三种类型 teacher,wuyou,school,
   * @returns {{success, msg, data}|*}
   */
  async addUrlToXml(strId, date, xmlType, entity) {
    let lastFileInfo = await this.findLastXuanshiSiteMapFileInfo(xmlType);
    let lastFileName = lastFileInfo.fileName;
    let mLastFile = fs.readFileSync('./static/yidong/' + lastFileName);
    let mLastFileObj = await xml2js.parseStringAsync(mLastFile);

    let pcLastFile = fs.readFileSync('./static/' + lastFileName);
    let pcLastFileObj = await xml2js.parseStringAsync(pcLastFile);

    let urlLen = mLastFileObj.urlset.url.length;
    if (urlLen >= largest) { //超过三万条 数据 就要新建一个文件
      return await this.xuanshiSiteMapAdd(xmlType, strId, entity, date);
    } else { //正常插入
      let pcTem = pcXuanshiMapTem.replace('{entity}', entity)
        .replace('{strId}', strId)
        .replace('{pcTime}', moment(date).format('YYYY-MM-DD'));

      let mTem = mXuanshiMapTem.replace('{entity}', entity)
        .replace('{strId}', strId)
        .replace('{mTime}', moment(date).format());

      let mTemObj = await xml2js.parseStringAsync(mTem);
      let pcTemObj = await xml2js.parseStringAsync(pcTem);

      mLastFileObj.urlset.url.push(mTemObj.url);
      pcLastFileObj.urlset.url.push(pcTemObj.url);

      let pcXml = xmlBuilder.buildObject(pcLastFileObj);
      let mXml = xmlBuilder.buildObject(mLastFileObj);

      await this.writeToFile('./static/' + lastFileName, pcXml);
      await this.writeToFile('./static/yidong/' + lastFileName, mXml);

      return { success: true, msg: '成功', data: lastFileName };
    }

  }

  /**
   * 找到存放某一类型的url的最新的文件  也就是没有放满的文件
   * @param fileType:  laoshi  zixun  xuexiao
   */
  async findLastXuanshiSiteMapFileInfo(fileType) {
    let index = 0;
    let redisFileInfoKey = fileType + 'Urls.';
    let lastFileInfo = null;

    while (true) {
      index++;
      let fileInfo = await redis.hgetallAsync(redisFileInfoKey + index);

      if (!fileInfo) {
        break;
      } else {
        lastFileInfo = fileInfo;
      }
    }
    assert(lastFileInfo, `未找到 ${fileType} 的存放最后url的xml文件`);
    return lastFileInfo;
  }

  /**
   *  从xml文件中删除 url
   * @param id
   * @param xmlType
   * @param entity
   * @param str
   * @returns {*}
   */
  async delUrlFromXml(id, xmlType, entity, str) {
    let strId = str + id;
    let pcUrlXmlFileInfo = await this.findXmlFileById(id, xmlType);

    let fileName = pcUrlXmlFileInfo.fileName;

    let pcUrlXmlFile = fs.readFileSync('./static/' + fileName);
    let pcUrlXmlFileObj = await xml2js.parseStringAsync(pcUrlXmlFile);
    let pcUrls = pcUrlXmlFileObj.urlset.url;
    let pcUrl = null;

    let mUrlXmlFile = fs.readFileSync('./static/yidong/' + fileName);
    let mUrlXmlFileObj = await xml2js.parseStringAsync(mUrlXmlFile);

    let mUrl = null;
    for (let i = 0; i < pcUrls.length; i++) {
      if (pcUrlXmlFileObj.urlset.url[i].loc[0].match(strId + '.html')) {

        pcUrl = pcUrlXmlFileObj.urlset.url[i].loc[0];
        mUrl = mUrlXmlFileObj.urlset.url[i].loc[0];

        pcUrlXmlFileObj.urlset.url.splice(i, 1);
        mUrlXmlFileObj.urlset.url.splice(i, 1);

      }
    }

    if (!pcUrl) {
      console.log(`没有找到id为${id}的${xmlType}的url`);
      return { success: false, msg: `没有找到id为${id}的${xmlType}的url` };
    }

    pcUrlXmlFile = xmlBuilder.buildObject(pcUrlXmlFileObj);
    mUrlXmlFile = xmlBuilder.buildObject(mUrlXmlFileObj);

    await this.writeToFile('./static/' + fileName, pcUrlXmlFile);
    await this.writeToFile('./static/yidong/' + fileName, mUrlXmlFile);
    await this.addUrlToSilianjieXml(pcUrl, mUrl);

    console.log(`删除${fileName}中id为${id}的${xmlType}的ulr`);

    return { success: true, msg: '成功' };
  }

  /**
   * 找到连接中的id
   * @param str
   * @param url
   */
  async findIdInUrl(str, url, entity) {
    return url.replace(`http://www.51xuanshi.com/${entity}/${str}`, '')
      .replace(`http://m.51xuanshi.com/${entity}/${str}`, '').replace('.html', '').trim();
  }

  /**
   * 添加一个死链接到 死链接xml文件
   * @param pcUrl
   * @param mUrl
   * @returns {{success, msg}|*}
   */
  async addUrlToSilianjieXml(pcUrl, mUrl) {
    pcUrl = pcUrl.trim();
    mUrl = mUrl.trim();
    //招最后一个死链接存放的地方
    let { lastFileName, fileNo } = await this.findLastSilianjieXml();

    if (!lastFileName) {//如果没有文件  直接创建第一个文件
      return await this.writeToFile('./static/deadUrl/silianjie-' + 1 + '.txt', [pcUrl, mUrl].join('\n'));
    }

    let lastFile = fs.readFileSync('./static/deadUrl/' + lastFileName);
    let urls = new String(lastFile).trim().split('\n');

    if (urls.length >= 49999) {//大于5万 创建新的死链接文件  同时写入该条数据
      fileNo = fileNo + 1;
      return await this.writeToFile('./static/deadUrl/silianjie-' + fileNo + '.txt', [pcUrl, mUrl].join('\n').trim());
    } else {  //正常写入
      urls.push(pcUrl);
      urls.push(mUrl);
      return await this.writeToFile('./static/deadUrl/' + lastFileName, urls.join('\n').trim());
    }
  }

  /**
   * 找到最后存放死链接的xml 文件
   */
  async findLastSilianjieXml() {
    //找到最后存放 死链接的文档
    let dirs = fs.readdirSync('./static/deadUrl/');
    let max = 0;
    let lastFileName = null;

    for (let dir of dirs) {
      let tem = parseInt(dir.replace('silianjie-', '').replace('.txt', ''));
      if (tem > max) {
        max = parseInt(tem);
        lastFileName = dir;
      }
    }
    return { lastFileName, fileNo: max };
  }

  /**
   * 删除一个老师的url
   * @param id
   */
  async delTeacherUrlById(id) {
    let xmlType = 'laoshi';
    let entity = 'teacher';
    let str = 'te';
    return await this.delUrlFromXml(id, xmlType, entity, str);
  }

  /**
   * 删除一个学校的url
   * @param id
   */
  async delSchoolUrlById(id) {
    let xmlType = 'xuexiao';
    let entity = 'school';
    let str = 'rp';
    return await this.delUrlFromXml(id, xmlType, entity, str);
  }

  /**
   * 删除一个无忧资讯文章的url
   * @param id
   */
  async delZixunUrlById(id) {
    let xmlType = 'zixun';
    let entity = 'wuyou';
    let str = 'sd';
    return await this.delUrlFromXml(id, xmlType, entity, str);
  }

}

module.exports = new SiteMapCtrl();