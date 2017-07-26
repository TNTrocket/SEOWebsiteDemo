/**
 * Created by tseian on 25/07/2017.
 */

const router = require('koa-router')();
const indexCtrl = require("../../controllers/indexCtrl");
const areaCtrl = require('../../controllers/areaCtrl');
const dictionCtrl = require('../../controllers/dictionaryCtrl');


/**
 * 获取已开通城市
 */
router.get('/open', async(ctx, next) => {
  let citys = await areaCtrl.getCityDistrict();
  console.log("citys======", citys);
  ctx.response.body = citys;
});


module.exports = router;
