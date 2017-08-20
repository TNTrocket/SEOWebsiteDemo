/**
 * Created by tseian on 28/07/2017.
 */

const router = require('koa-router')();
const assert = require('assert');
const dictionaryCtrl = require('../../controllers/dictionaryCtrl');
const areaCtrl = require('../../controllers/areaCtrl');

router.get('/select/teacher', async(ctx, next) => {
  let a = dictionaryCtrl.s_a_grade_enu;
  let b = dictionaryCtrl.s_b_subject_enu;
  let { cityPinyin = 'Guangzhou' } = ctx.query;
  let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);
  let c = await areaCtrl.getDistrictsByCityId(cityInfo.a_id);
  let d = dictionaryCtrl.s_d_gender;
  let e = dictionaryCtrl.s_e_type;
  let f = await dictionaryCtrl.s_f_tag();
  let g = dictionaryCtrl.s_g_order_enu;
  return ctx.response.body = { a, b, c, d, e, f: f, g };
});

router.get('/select/school', async(ctx, next) => {
  let a = dictionaryCtrl.s_a_school;
  let { cityPinyin = 'Guangzhou' } = ctx.query;
  let cityInfo = await areaCtrl.getCityByPinyin(cityPinyin, dictionaryCtrl.areaLevel.city.level);
  let b = await areaCtrl.getDistrictsByCityId(cityInfo.a_id);
  let c = dictionaryCtrl.s_c_school_level;

  return ctx.response.body = { a, b, c };
});

router.get('/select/download', async(ctx, next) => {
  let a = dictionaryCtrl.s_a_grade_enu;
  let b = dictionaryCtrl.s_b_subject_enu;
  return ctx.response.body = { a, b };
});


module.exports = router;