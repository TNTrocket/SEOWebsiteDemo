const router = require('koa-router')();
const indexCtrl = require("../controllers/indexCtrl");
const areaCtrl = require('../controllers/areaCtrl');
router.get('/', async(ctx, next) => {
  return await ctx.render("index", {
    user: {
      name: "tnt"
    }
  });
});
router.get('/test', async(ctx, next) => {
  return await ctx.render("information")
});

router.put('/phoneNO', async(ctx, next) => {
  let { phoneNO, areaID } =ctx.params;
  let result = await indexCtrl.save(phoneNO, areaID);
});

/**
 * 获取已开通城市
 */
router.get('/area', async(ctx, next) => {
  let citys = await areaCtrl.getCityDistrict();
  console.log(citys);
  ctx.response.body = citys;
});

router.get('/banner/list', async(ctx, next) => {
  let { city } = ctx.query;
  city = await areaCtrl.getCityByName(city);
  let data = await indexCtrl.getBanners(city.a_id);
  ctx.response.body = data;
});

module.exports = router;
