const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const articleCtrl = require('../controllers/articleCtrl');
const informationList = dictionCtrl.informationList;
const schoolInfoCtrl = require('../controllers/schoolInfoCtrl');
const assert = require('assert');



router.get('/', async(ctx, next) => {

  let data = await articleCtrl.index();
  console.log('router.get(/ ====', data);
  return await ctx.render("information", data);
});

router.get('/parentsQaList/:grade/:offset', async(ctx, next) => {
  let { grade, offset = 0 } =ctx.params;

  offset = parseInt(offset);

  if (grade != 'unlimit') {
    assert(dictionCtrl.gradeEnumeration[grade].code, '年级参数有误');
    grade = dictionCtrl.gradeEnumeration[grade].code;
  }

  let params = { grade, offset };

  let data = await articleCtrl.getParentQuestions(params);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'parentsQaList';
  data.informationList = informationList;
  console.log('/parentsQaList/:grade/:offset--data====', data);


  return await ctx.render("informationList", data)
});
router.get('/commonList', async(ctx, next) => {
  return await ctx.render("informationList", informationList)
});

//无忧资讯
router.get('/studyNewsList/:type/:offset', async(ctx, next) => {
  let { type, offset, limit = 8 } =ctx.params;
  let typeName = type;
  assert(dictionCtrl.careFreeInfo[type], '404 文章类型不正确');
  type = dictionCtrl.careFreeInfo[type].id;

  offset = parseInt(offset) || 0;
  limit = parseInt(limit) || 8;
  let data = await articleCtrl.studyNewList({ type, offset, limit });


  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'studyNewsList';

  data.informationList = informationList;
  data.typeName = typeName;


  console.log('/studyNewsList/:offset/:type/:page===', data);
  return await ctx.render("informationList", data)
});


router.get('/dataDownloadList/:grade/:subject/:offset', async(ctx, next) => {
  let { grade, subject, offset = 0 } =ctx.params;
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

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "dataDownloadList";
  data.informationList = informationList;

  console.log('/dataDownloadList/:grade/:subject/:offset---data==', data);

  return await ctx.render("informationList", data)
});

//文章详情
router.get('/article/:id', async(ctx, next) => {

  let { id } =ctx.params;
  let data = await articleCtrl.fetch(id);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "article";
  data.informationList = informationList;

  console.log('/article/:id===', data);

  return await ctx.render("informationList", data);
});


router.get('/schoolList/:category/:level/:offset', async(ctx, next) => {
  let { category, level, offset } = ctx.params;
  let { city, region } =ctx.query;

  offset = parseInt(offset) || 0;

  let data = await schoolInfoCtrl.list({ category, region, level, offset, city });

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolList";
  data.informationList = informationList;

  console.log('/schoolList/:grade/:city/:region/:level/:offset---data===', data);

  return await ctx.render("informationList", data)
});

router.get('/school/detail/:schoolID', async(ctx, next) => {

  let { schoolID } =ctx.params;
  let { city } =ctx.query;

  assert(parseInt(schoolID), '学校id错误');
  schoolID = parseInt(schoolID);

  let data = await schoolInfoCtrl.getSchoolById(schoolID, city);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "schoolDetail";
  data.informationList = informationList;

  console.log('/schoolDetail/:city/:schoolID---data===', data);

  return await ctx.render("informationList", data)
});

module.exports = router;

