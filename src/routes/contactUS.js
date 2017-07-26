/**
 * Created by Administrator on 2017/6/26.
 */
const router = require('koa-router')();
const teacherCtrl = require('../controllers/teacherCtrl');

router.get('/:city', async(ctx, next) => {
  let { city } = ctx.params;
  let data = {};
  data.params = { city };

  let latestComments = await teacherCtrl.getLatestComments();
  data.latestComments = latestComments;
  data.renderType = "contactUS";
  return await ctx.render("mobile/contactUS", data);
});

module.exports = router