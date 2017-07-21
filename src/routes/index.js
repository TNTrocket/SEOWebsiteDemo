const router = require('koa-router')();
const indexCtrl = require("../controllers/indexCtrl");
const areaCtrl = require('../controllers/areaCtrl');
const dictionCtrl = require('../controllers/dictionaryCtrl');

router.get('/', async(ctx, next) => {
  ctx.redirect('/user/' + dictionCtrl.defaultCity.a_id);
  ctx.status = 301;
});
router.get('/' + dictionCtrl.defaultCity.a_id, async(ctx, next) => {
  let { city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let params = { city };
  let data = await indexCtrl.index(params);
  data.params = params;
  return await ctx.render("index", data);
});
router.get('/:city', async(ctx, next) => {
  let { city = dictionCtrl.defaultCity.a_id } = ctx.params;
  city = parseInt(city) || dictionCtrl.defaultCity.a_id;
  let params = { city };
  let data = await indexCtrl.index(params);
  data.params = params;
  return await ctx.render("index", data);
});
router.put('/phoneNO', async(ctx, next) => {
  let { phoneNO, areaID } =ctx.params;
  let result = await indexCtrl.save(phoneNO, areaID);
});

/**
 * 获取已开通城市
 */
router.get('/open/area', async(ctx, next) => {
  let citys = await areaCtrl.getCityDistrict();
  // console.log("citys======",citys);
  ctx.response.body = citys;
});

module.exports = router;
