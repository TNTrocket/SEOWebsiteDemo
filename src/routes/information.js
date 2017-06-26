const router = require('koa-router')();
const dictionCtrl = require('../controllers/dictionaryCtrl');
const articleCtrl = require('../controllers/articleCtrl');
const informationList = dictionCtrl.informationList;
const assert = require('assert');

router.get('/', async(ctx, next) => {
  return await ctx.render("information", {
    user: {
      name: "tnt"
    }
  })
});
router.get('/parentsQaList', async(ctx, next) => {
  let obj = {};
  Object.assign(obj, informationList, { renderType: "parentsQaList" });
  return await ctx.render("informationList", obj)
});
router.get('/commonList', async(ctx, next) => {
  return await ctx.render("informationList", informationList)
});


//无忧资讯
router.get('/studyNewsList/:type/:offset', async(ctx, next) => {
  let { type, offset, limit = 8 } =ctx.params;
  let typeName = type;
  assert(dictionCtrl.careFreeInfo[type], '404 文章类型不正确');
  type = dictionCtrl.careFreeInfo[type].code;

  if (type == 0) {
    type = [
      dictionCtrl.careFreeInfo.sxgl.code,
      dictionCtrl.careFreeInfo.qzcf.code,
      dictionCtrl.careFreeInfo.bsxx.code,
      dictionCtrl.careFreeInfo.jzxd.code,
      dictionCtrl.careFreeInfo.gkzn.code
    ];
  }
  offset = parseInt(offset);
  limit = parseInt(limit);
  let list = await articleCtrl.list({ type, offset, limit });
  let hotInfos = await articleCtrl.getHotInfo(0, 10);

  let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
  let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
  let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
  let materials = schoolMaterials.concat(seniorMaterials, highMaterials);
  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = 'studyNewsList';

  let diction = dictionCtrl.careFreeInfo;
  let data = {
    informationList: informationList,
    list: list,
    hotInfos: hotInfos,
    materials,
    diction,
    typeName,
    page: { offset, limit }
  };
  console.log('/studyNewsList/:offset/:type/:page===', data);
  return await ctx.render("informationList", data)
});


router.get('/schoolList', async(ctx, next) => {
  let obj = {};
  Object.assign(obj, informationList, { renderType: "schoolList" });
  return await ctx.render("informationList", obj)
});


router.get('/dataDownloadList', async(ctx, next) => {
  let obj = {};
  Object.assign(obj, informationList, { renderType: "dataDownloadList" });
  return await ctx.render("informationList", obj)
});

router.get('/article/:id', async(ctx, next) => {

  let { id } =ctx.params;
  let article = await articleCtrl.fetch(id);
  article.threeTitles = await articleCtrl.getThreeArticle();
  article.hotInfos = await articleCtrl.getHotInfo(0, 10);

  let schoolMaterials = await articleCtrl.getLatestMaterials('school', 3);
  let seniorMaterials = await articleCtrl.getLatestMaterials('senior', 3);
  let highMaterials = await articleCtrl.getLatestMaterials('high', 4);
  let materials = schoolMaterials.concat(seniorMaterials, highMaterials);

  informationList.prevRenderType = informationList.renderType;
  informationList.renderType = "article";
  let data = {
    informationList: informationList,
    article: article,
    materials
  };

  console.log('/article/:id===', data);

  return await ctx.render("informationList", data);
});


router.get('/schoolDetail', async(ctx, next) => {
  let obj = {};
  Object.assign(obj, informationList, { renderType: "schoolDetail" });
  return await ctx.render("informationList", obj)
});



module.exports = router;

