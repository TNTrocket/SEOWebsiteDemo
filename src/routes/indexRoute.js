const router = require('koa-router')();
const indexCtrl = require("../controllers/indexCtrl");
const areaCtrl = require('../controllers/areaCtrl');
const dictionCtrl = require('../controllers/dictionaryCtrl');
const isMobile = require("./../common/checkUA");
const columnCtrl = require('../controllers/columnCtrl');


router.get('/:city/', async(ctx, next) => {

  let { city = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let params = { city };
  let data = await indexCtrl.index(params);

  let column = await columnCtrl.getColumnsByColumnNO('column.2');
  let tkd = {};
  tkd.title = column.c_title;
  tkd.keyWords = column.c_keywords;
  tkd.description = column.c_description;
  data.tkd = tkd;

  data.params = params;
  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/index", data);
  } else {
    return await ctx.render("pc/index", data);
  }
});

router.get('/', async(ctx, next) => {

  let city = ctx.cookies.get('cityPinyin') || 'Guangzhou';
  let params = { city };
  let data = await indexCtrl.index(params);

  let column = await columnCtrl.getColumnsByColumnNO('column.1');
  let tkd = {};
  tkd.title = column.c_title;
  tkd.keyWords = column.c_keywords;
  tkd.description = column.c_description;
  data.tkd = tkd;

  data.params = params;

  if (isMobile(ctx.request)) {
    return await ctx.render("mobile/index", data);
  } else {
    return await ctx.render("pc/index", data);
  }
});

module.exports = router;