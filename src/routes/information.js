const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const articleCtrl = require('../controllers/articleCtrl');
const informationList = dictionCtrl.informationList;
const schoolInfoCtrl = require('../controllers/schoolInfoCtrl');
const assert = require('assert');

router.get('/:city', async(ctx, next) => {
  let { city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let params = { city };
  let data = await articleCtrl.index(params);
  data.params = params;
  console.log('router.get(/ ====', data);
  return await ctx.render("information", data);
});

router.get('/parentsQaList/:grade/:city/:offset', async(ctx, next) => {
  let { grade, offset = 0, city = dictionCtrl.defaultCity.a_id } =ctx.params;
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
  console.log('/parentsQaList/:grade/:offset--data====', data);

  return await ctx.render("informationList", data)
});

//无忧资讯
router.get('/studyNewsList/:type/:city/:offset', async(ctx, next) => {
  let { type, offset, limit = 8, city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let paramsOld = { type, offset, limit, city };
  let typeName = type;
  assert(dictionCtrl.careFreeInfo[type], '404 文章类型不正确');
  type = dictionCtrl.careFreeInfo[type].id;

  offset = parseInt(offset) || 0;
  limit = parseInt(limit) || 8;
  let params = { type, offset, limit };
  let data = await articleCtrl.studyNewList(params);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'studyNewsList';

  data.params = paramsOld;
  data.informationList = informationList;
  data.typeName = typeName;

  console.log('/studyNewsList/:offset/:type/:page===', data);
  return await ctx.render("informationList", data)
});


router.get('/dataDownloadList/:grade/:subject/:city/:offset', async(ctx, next) => {
  let { grade, subject, offset = 0, city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let paramsOld = { grade, subject, offset, city };
  if (grade != 'unlimit') {
    assert(dictionCtrl.gradeEnumeration[grade].code, '年级参数有误');
    grade = dictionCtrl.gradeEnumeration[grade].code;
  }
  if (subject != 'unlimit') {
    assert(dictionCtrl.subjectEnumeration[subject].code, '科目参数有误');
    subject = dictionCtrl.subjectEnumeration[subject].code;
  }

  offset = parseInt(offset) || 0;

  let params = { grade, subject, offset };
  let data = await articleCtrl.getMaterials(params);
  data.params = paramsOld;
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "dataDownloadList";
  data.informationList = informationList;

  console.log('/dataDownloadList/:grade/:subject/:offset---data==', data);

  return await ctx.render("informationList", data)
});

//文章详情
router.get('/article/:city/:id', async(ctx, next) => {

  let { id, city = dictionCtrl.defaultCity.a_id } =ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let data = await articleCtrl.fetch(id);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "article";
  data.informationList = informationList;
  data.params = { id, city };
  console.log('/article/:id===', data);

  return await ctx.render("informationList", data);
});


router.get('/schoolList/:category/:level/:city/:region/:offset', async(ctx, next) => {
  let { category, level, offset, city = dictionCtrl.defaultCity.a_id, region } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let params = { city, region, category, level };

  offset = parseInt(offset) || 0;

  let data = await schoolInfoCtrl.list({ category, region, level, offset, city });

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolList";
  data.informationList = informationList;

  data.params = params;
  console.log('/schoolList/:grade/:city/:region/:level/:offset---data===', data);

  return await ctx.render("informationList", data)
});

router.get('/school/detail/:city/:schoolID', async(ctx, next) => {

  let { schoolID, city = dictionCtrl.defaultCity.a_id } =ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let params = { city, schoolID };
  assert(parseInt(schoolID), '学校id错误');
  schoolID = parseInt(schoolID);

  let data = await schoolInfoCtrl.getSchoolById(schoolID, city);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolDetail";
  data.informationList = informationList;
  data.params = params;
  console.log('/schoolDetail/:city/:schoolID---data===', data);

  return await ctx.render("informationList", data)
});

module.exports = router;

