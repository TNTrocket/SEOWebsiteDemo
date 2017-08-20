const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const articleCtrl = require('../controllers/articleCtrl');
const informationList = dictionCtrl.informationList;
const schoolInfoCtrl = require('../controllers/schoolInfoCtrl');
const assert = require('assert');
const areaCtrl = require('../controllers/areaCtrl');
const check = require("./../common/checkUA");
const isMobile = check;
const columnCtrl = require('../controllers/columnCtrl');

//升学资讯首页
router.get('/:cityPinyin/zixun/', async(ctx, next) => {

  let { cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;

  let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionCtrl.areaLevel.city.level);
  let params = { city: cityInfo.a_id };
  let paramsOld = { city: cityInfo.a_pinyin };
  let data = {};
  let isphone = isMobile(ctx.request);
  if (isphone) {
    data = await articleCtrl.index(params);
  } else {
    data = await articleCtrl.pcIndex({ cityInfo });
  }

  let column = await columnCtrl.getColumnsByColumnNO('column.3');
  let tkd = await columnCtrl.parseTKD(column, { area: cityInfo.a_name });
  data.tkd = tkd;

  data.params = paramsOld;
  console.log('router.get(/ ====', data);
  if (isphone) {
    return await ctx.render("mobile/information", data);
  } else {
    return await ctx.render("pc/zixunIndex", data);
  }
});


//无忧资讯
router.get('/:cityPinyin/wuyou/:queryString/', async(ctx, next) => {
  let { queryString = 'wuyou-', limit = 8, cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let paramsOld = { queryString, limit, city: cityPinyin };
  queryString = queryString.substr(6, queryString.length - 6);
  let typeName = queryString;

  let careFreeInfos = await dictionCtrl.careFreeInfos();
  console.log('careFreeInfos===', careFreeInfos);

  let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionCtrl.areaLevel.city.level);
  let title = cityInfo.a_name + '中小学家教升学资讯大全';
  let keyWords = '升学资讯大全';
  let description = cityInfo.a_name + '无忧资讯大全,汇集海量的国内小升初/中考/高考升学资讯，快速提升你的孩子成绩';

  if (queryString) {

    assert(careFreeInfos[queryString], '404 文章类型不正确');
    title = careFreeInfos[queryString].at_title;
    keyWords = careFreeInfos[queryString].at_keywords;
    description = careFreeInfos[queryString].at_description;
    queryString = careFreeInfos[queryString].id;
  }

  let reg = new RegExp("\{area\}", 'g');
  let tkd = {};
  tkd.title = title.replace(reg, cityInfo.a_name);
  tkd.keyWords = keyWords.replace(reg, cityInfo.a_name);
  tkd.description = description.replace(reg, cityInfo.a_name);

  limit = parseInt(limit) || 8;
  let params = { queryString, limit };
  let data = await articleCtrl.studyNewList(params);
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'studyNewsList';
  data.params = paramsOld;
  data.informationList = informationList;
  data.typeName = typeName;
  data.tkd = tkd;

  // console.log('/studyNewsList/:offset/:type/:page===', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/wuyou", data);
  }
});


//无忧资讯 分页
router.get('/:cityPinyin/wuyou/:queryString/:page/', async(ctx, next) => {
  let { queryString = 'wuyou-', offset = 0, page = 'p2', limit = 8, cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let paramsOld = { page, queryString, offset, limit, city: cityPinyin };
  let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionCtrl.areaLevel.city.level);
  page = page.substring(1, page.length);
  if (parseInt(page)) {
    offset = (parseInt(page) - 1) * 10;
  }
  let typeName = queryString;
  queryString = queryString.substr(6, queryString.length - 6);

  let title = cityInfo.a_name + '中小学家教升学资讯大全';
  let keyWords = '升学资讯大全';
  let description = cityInfo.a_name + '无忧资讯大全,汇集海量的国内小升初/中考/高考升学资讯，快速提升你的孩子成绩';
  let careFreeInfos = await dictionCtrl.careFreeInfos();
  if (queryString) {

    assert(careFreeInfos[queryString], '404 文章类型不正确');
    title = careFreeInfos[queryString].at_title;
    keyWords = careFreeInfos[queryString].at_keywords;
    description = careFreeInfos[queryString].at_description;
    queryString = careFreeInfos[queryString].id;

  }

  let reg = new RegExp("\{area\}", 'g');
  let tkd = {};
  tkd.title = title.replace(reg, cityInfo.a_name);
  tkd.keyWords = keyWords.replace(reg, cityInfo.a_name);
  tkd.description = description.replace(reg, cityInfo.a_name);


  offset = parseInt(offset) || 0;
  limit = parseInt(limit) || 8;
  let params = { type: queryString, offset, limit };
  let data = await articleCtrl.studyNewList(params);
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'studyNewsList';
  data.params = paramsOld;
  data.informationList = informationList;
  data.typeName = typeName;
  data.tkd = tkd;

  // console.log('/studyNewsList/:offset/:type/:page===', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/wuyou", data);
  }
});


//文章详情
router.get('/wuyou/:id', async(ctx, next) => {
  let { id } = ctx.params;
  let cityPinyin = ctx.cookies.get('cityPinyin') || dictionCtrl.defaultCity.a_pinyin;
  id = id.substr(2, id.length - 7);
  assert(parseInt(id), '文章id参数不正确');
  let data = await articleCtrl.fetch(parseInt(id));
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "article";
  data.informationList = informationList;
  data.params = { id, city: cityPinyin };

  let title = data.article.a_content_title + '_选师无忧';
  let keyWords = data.article.a_keyword;
  let description = data.article.a_description;
  let tkd = { title, keyWords, description };
  data.tkd = tkd;

  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/newsArticle", data);
  }
});


//学校列表
router.get('/schools/:cityPinyin/:queryString/', async(ctx, next) => {
  let { queryString = 'school-', cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let params = { city: cityPinyin, queryString };
  queryString = queryString.substr(7, queryString.length - 7);
  let data = await schoolInfoCtrl.listSchools({ queryString, cityPinyin });
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolList";
  data.informationList = informationList;
  data.params = params;
  // console.log('/schoolList/:grade/:city/:region/:level/:offset---data===', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/schoolList", data);
  }
});


//学校列表  分页
router.get('/schools/:cityPinyin/:queryString/:page/', async(ctx, next) => {
  let { page = 'p2', queryString, cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let params = { page, queryString, city: cityPinyin };
  queryString = queryString.substr(7, queryString.length - 7);
  page = page.substring(1, page.length);
  let offset = 0;
  if (parseInt(page)) {
    offset = (parseInt(page) - 1) * 10;
  }
  let data = await schoolInfoCtrl.listSchools({ queryString, cityPinyin, offset });
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolList";
  data.informationList = informationList;
  data.params = params;
  console.log('/schoolList/:grade/:city/:region/:level/:offset---data===', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/schoolList", data);
  }
});

//学校详情
router.get('/school/:schoolID', async(ctx, next) => {
  let { schoolID } = ctx.params;
  schoolID = schoolID.substr(2, schoolID.length - 7);
  let cityPinyin = ctx.cookies.get('cityPinyin') || dictionCtrl.defaultCity.a_pinyin;
  let params = { city: cityPinyin, schoolID };
  assert(parseInt(schoolID), '学校id错误');
  schoolID = parseInt(schoolID);
  let data = await schoolInfoCtrl.getSchoolById(schoolID, cityPinyin);
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolDetail";
  data.informationList = informationList;
  data.params = params;
  console.log('/schoolDetail/:city/:schoolID---data===', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/schoolArticle", data);
  }
});


router.get('/xiazai/:cityPinyin/:queryString/', async(ctx, next) => {
  let { queryString, cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let paramsOld = { queryString, city: cityPinyin };
  queryString = queryString.substr(9, queryString.length - 9);
  let params = { queryString, cityPinyin };
  let data = await articleCtrl.getMaterials(params);
  data.params = paramsOld;
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "dataDownloadList";
  data.informationList = informationList;
  // console.log('/dataDownloadList/:grade/:subject/:offset---data==', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/downloadList", data);
  }
});


router.get('/xiazai/:cityPinyin/:queryString/:page/', async(ctx, next) => {
  let { queryString, page = 'p2', cityPinyin = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let paramsOld = { page, queryString, city: cityPinyin };
  page = page.substring(1, page.length);
  let offset = 0;
  if (parseInt(page)) {
    offset = (parseInt(page) - 1) * 10;
  }
  queryString = queryString.substr(9, queryString.length - 9);
  let params = { queryString, cityPinyin, offset };
  let data = await articleCtrl.getMaterials(params);
  data.params = paramsOld;
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "dataDownloadList";
  data.informationList = informationList;
  // console.log('/dataDownloadList/:grade/:subject/:offset---data==', data);
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/downloadList", data);
  }
});


// 下载的文章详情
router.get('/download/:id', async(ctx, next) => {
  let { id } = ctx.params;
  let cityPinyin = ctx.cookies.get('cityPinyin') || dictionCtrl.defaultCity.a_pinyin;
  id = id.substr(2, id.length - 7);
  assert(parseInt(id), '文章id参数不正确');
  let data = await articleCtrl.fetch(parseInt(id));
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "article";
  data.informationList = informationList;
  data.params = { id, city: cityPinyin };

  let title = data.article.a_content_title + '免费下载_最新资料免费下载';
  let keyWords = data.article.a_content_title;
  let description = data.article.a_content_title + '真题讲解,内容' + data.article.a_content.substr(0, 20) || '';
  let tkd = { title, keyWords, description };
  data.tkd = tkd;

  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/informationList", data);
  } else {
    return await ctx.render("pc/newsArticle", data);
  }
});


router.get('/parentsQaList/:grade/:city/:offset/', async(ctx, next) => {
  let { grade, offset = 0, city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let paramsOld = { grade, offset, city };
  offset = parseInt(offset);
  if (grade != 'unlimit') {
    assert(dictionCtrl.gradeEnumeration[grade].code, '年级参数有误');
    grade = dictionCtrl.gradeEnumeration[grade].code;
  }
  let params = { grade, offset };
  let data = await articleCtrl.getParentQuestions(params);
  data.params = paramsOld;
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'parentsQaList';
  data.informationList = informationList;
  // console.log('/parentsQaList/:grade/:offset--data====', data);
  return await ctx.render("mobile/informationList", data)
});
module.exports = router;