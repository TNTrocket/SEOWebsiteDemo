const router = require('koa-router')();
const indexCtrl = require("../controllers/indexCtrl");
const areaCtrl = require('../controllers/areaCtrl');
const dictionCtrl = require('../controllers/dictionaryCtrl');

router.get('/:city', async(ctx, next) => {
  let { city = dictionCtrl.defaultCity.a_pinyin } = ctx.params;
  let params = { city };
  let data = await indexCtrl.index(params);
  data.params = params;
  return await ctx.render("mobile/index", data);
});

router.get('/', async(ctx, next) => {
  let city = 'guangzhou';
  let params = { city };
  let data = await indexCtrl.index(params);
  data.params = params;
  return await ctx.render("mobile/index", data);
});

module.exports = router;
